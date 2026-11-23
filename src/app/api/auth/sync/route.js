import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = "dvgaikwad333@gmail.com";

async function withRetry(fn, retries = 3, delayMs = 1500) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

// Helper to seed annual leave balances for any user in DB
async function ensureLeaveBalances(userId) {
  try {
    const policies = await prisma.leaveTypePolicy.findMany().catch(() => []);
    for (const pol of policies) {
      await prisma.leaveBalance.upsert({
        where: {
          userId_year_leaveType: {
            userId,
            year: 2026,
            leaveType: pol.name,
          },
        },
        update: {},
        create: {
          userId,
          year: 2026,
          leaveType: pol.name,
          allocatedDays: pol.defaultDaysPerYear,
          usedDays: 0,
          remainingDays: pol.defaultDaysPerYear,
        },
      }).catch(() => {});
    }
  } catch (e) {
    // Non-blocking
  }
}

export async function POST(request) {
  try {
    let clerkUser = null;
    try {
      clerkUser = await currentUser();
    } catch (e) {
      // Ignored if headers not available
    }

    const body = await request.json().catch(() => ({}));

    const email =
      body.email ||
      clerkUser?.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to verify authorization." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const clerkId = body.clerkId || clerkUser?.id || null;
    const name =
      body.name ||
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      normalizedEmail.split("@")[0];
    const avatarUrl = body.avatarUrl || clerkUser?.imageUrl || null;

    // Search for existing user in database
    let user = await withRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: normalizedEmail, mode: "insensitive" } },
            { personalEmail: { equals: normalizedEmail, mode: "insensitive" } },
            ...(clerkId ? [{ clerkId }] : []),
          ],
        },
        include: { leaveBalances: true },
      })
    );

    const isSuperAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

    // 1. Super Admin (dvgaikwad333@gmail.com)
    if (isSuperAdmin) {
      if (!user) {
        user = await prisma.user.create({
          data: {
            employeeId: "DG-26-0001",
            clerkId,
            name: "Dhiraj Gaikwad",
            email: normalizedEmail,
            personalEmail: normalizedEmail,
            department: "Admin Department",
            designation: "Administrator / MD",
            role: "ADMIN",
            status: "ACTIVE",
            avatarUrl,
            salary: 1500000,
            joinDate: new Date("2026-01-01"),
          },
          include: { leaveBalances: true },
        });
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "ADMIN",
            department: user.department || "Admin Department",
            clerkId: clerkId || user.clerkId,
            avatarUrl: avatarUrl || user.avatarUrl,
          },
          include: { leaveBalances: true },
        });
      }
      await ensureLeaveBalances(user.id);

      return NextResponse.json({
        success: true,
        isAuthorized: true,
        user,
      });
    }

    // 2. Existing user in DB (pre-registered by Admin as ADMIN or EMPLOYEE)
    if (user) {
      // Check if deactivated
      if (user.status === "INACTIVE") {
        return NextResponse.json(
          {
            success: false,
            isAuthorized: false,
            error: "ACCOUNT_INACTIVE",
            message: "Your account is currently deactivated. Please contact your Administrator.",
          },
          { status: 403 }
        );
      }

      // Link clerkId & avatarUrl if not already linked
      if (clerkId && (!user.clerkId || user.clerkId !== clerkId || (avatarUrl && !user.avatarUrl))) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            clerkId: clerkId || user.clerkId,
            avatarUrl: avatarUrl || user.avatarUrl,
          },
          include: { leaveBalances: true },
        });
      }
      await ensureLeaveBalances(user.id);

      return NextResponse.json({
        success: true,
        isAuthorized: true,
        user,
      });
    }

    // 3. User does NOT exist in DB yet -> COMPULSORY SAVE TO DATABASE
    // "who ever try to login or signing the user login data should be goes to the database in the user table complusary"
    const userCount = await prisma.user.count().catch(() => 0);
    const joinYear = (new Date().getFullYear() % 100).toString().padStart(2, "0");
    const generatedId = `DG-${joinYear}-${String(userCount + 1).padStart(4, "0")}`;

    user = await prisma.user.create({
      data: {
        employeeId: generatedId,
        clerkId,
        name,
        email: normalizedEmail,
        personalEmail: normalizedEmail,
        department: "Robotics Engineering",
        designation: "Associate",
        role: "EMPLOYEE",
        status: "ACTIVE",
        avatarUrl,
        salary: 0,
        joinDate: new Date(),
      },
      include: { leaveBalances: true },
    });

    await ensureLeaveBalances(user.id);

    return NextResponse.json({
      success: true,
      isAuthorized: true,
      user,
    });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const email =
      clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ success: false, error: "No email on Clerk account" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const clerkId = clerkUser.id;
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      normalizedEmail.split("@")[0];
    const avatarUrl = clerkUser.imageUrl;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: normalizedEmail, mode: "insensitive" } },
          { personalEmail: { equals: normalizedEmail, mode: "insensitive" } },
          { clerkId },
        ],
      },
      include: { leaveBalances: true },
    });

    const isSuperAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

    if (isSuperAdmin) {
      if (!user) {
        user = await prisma.user.create({
          data: {
            employeeId: "DG-26-0001",
            clerkId,
            name: "Dhiraj Gaikwad",
            email: normalizedEmail,
            personalEmail: normalizedEmail,
            department: "Admin Department",
            designation: "Administrator / MD",
            role: "ADMIN",
            status: "ACTIVE",
            avatarUrl,
            salary: 1500000,
            joinDate: new Date("2026-01-01"),
          },
          include: { leaveBalances: true },
        });
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "ADMIN",
            clerkId: clerkId || user.clerkId,
            avatarUrl: avatarUrl || user.avatarUrl,
          },
          include: { leaveBalances: true },
        });
      }
      await ensureLeaveBalances(user.id);
      return NextResponse.json({ success: true, isAuthorized: true, user });
    }

    if (user) {
      if (user.status === "INACTIVE") {
        return NextResponse.json(
          {
            success: false,
            isAuthorized: false,
            error: "ACCOUNT_INACTIVE",
            message: "Your account is currently deactivated. Please contact your Administrator.",
          },
          { status: 403 }
        );
      }
      if (clerkId && (!user.clerkId || user.clerkId !== clerkId || (avatarUrl && !user.avatarUrl))) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            clerkId: clerkId || user.clerkId,
            avatarUrl: avatarUrl || user.avatarUrl,
          },
          include: { leaveBalances: true },
        });
      }
      await ensureLeaveBalances(user.id);
      return NextResponse.json({ success: true, isAuthorized: true, user });
    }

    // Compulsory create in database
    const userCount = await prisma.user.count().catch(() => 0);
    const joinYear = (new Date().getFullYear() % 100).toString().padStart(2, "0");
    const generatedId = `DG-${joinYear}-${String(userCount + 1).padStart(4, "0")}`;

    user = await prisma.user.create({
      data: {
        employeeId: generatedId,
        clerkId,
        name,
        email: normalizedEmail,
        personalEmail: normalizedEmail,
        department: "Robotics Engineering",
        designation: "Associate",
        role: "EMPLOYEE",
        status: "ACTIVE",
        avatarUrl,
        salary: 0,
        joinDate: new Date(),
      },
      include: { leaveBalances: true },
    });

    await ensureLeaveBalances(user.id);
    return NextResponse.json({ success: true, isAuthorized: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
