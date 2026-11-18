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

    // 1. Check if this is the Super Admin
    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      let admin = await withRetry(() =>
        prisma.user.findFirst({
          where: { email: { equals: normalizedEmail, mode: "insensitive" } },
          include: { leaveBalances: true },
        })
      );

      if (!admin) {
        // Create Admin if not present
        admin = await prisma.user.create({
          data: {
            employeeId: "ADM-001",
            clerkId,
            name: "Dhiraj Gaikwad",
            email: normalizedEmail,
            personalEmail: normalizedEmail,
            department: "Administration",
            designation: "Administrator / MD",
            role: "ADMIN",
            status: "ACTIVE",
            avatarUrl,
            salary: 150000,
            joinDate: new Date(),
          },
          include: { leaveBalances: true },
        });

        // Allocate leave policies
        const policies = await prisma.leaveTypePolicy.findMany().catch(() => []);
        for (const pol of policies) {
          await prisma.leaveBalance.upsert({
            where: {
              userId_year_leaveType: {
                userId: admin.id,
                year: 2026,
                leaveType: pol.name,
              },
            },
            update: {},
            create: {
              userId: admin.id,
              year: 2026,
              leaveType: pol.name,
              allocatedDays: pol.defaultDaysPerYear,
              usedDays: 0,
              remainingDays: pol.defaultDaysPerYear,
            },
          }).catch(() => {});
        }
      } else if (clerkId && (!admin.clerkId || admin.clerkId !== clerkId)) {
        admin = await prisma.user.update({
          where: { id: admin.id },
          data: { clerkId, avatarUrl: avatarUrl || admin.avatarUrl },
          include: { leaveBalances: true },
        });
      }

      return NextResponse.json({
        success: true,
        isAuthorized: true,
        user: admin,
      });
    }

    // 2. Check if this is an employee pre-registered by the Admin
    let employee = await withRetry(() =>
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

    if (!employee) {
      // User is NOT registered by Admin -> Access Denied!
      return NextResponse.json(
        {
          success: false,
          isAuthorized: false,
          error: "ACCESS_DENIED",
          message: `Your email (${normalizedEmail}) has not been registered by the Administrator. Please contact ${ADMIN_EMAIL} to add your official profile to Digitech ERP.`,
        },
        { status: 403 }
      );
    }

    // Check if employee account is ACTIVE
    if (employee.status === "INACTIVE") {
      return NextResponse.json(
        {
          success: false,
          isAuthorized: false,
          error: "ACCOUNT_INACTIVE",
          message: "Your employee account is currently deactivated. Please contact your Administrator.",
        },
        { status: 403 }
      );
    }

    // Link clerkId & avatarUrl to registered employee
    if (clerkId && (!employee.clerkId || employee.clerkId !== clerkId)) {
      employee = await prisma.user.update({
        where: { id: employee.id },
        data: {
          clerkId,
          avatarUrl: avatarUrl || employee.avatarUrl,
        },
        include: { leaveBalances: true },
      });
    }

    return NextResponse.json({
      success: true,
      isAuthorized: true,
      user: employee,
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
    const avatarUrl = clerkUser.imageUrl;

    if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
      let admin = await prisma.user.findFirst({
        where: { email: { equals: normalizedEmail, mode: "insensitive" } },
        include: { leaveBalances: true },
      });

      if (!admin) {
        admin = await prisma.user.create({
          data: {
            employeeId: "ADM-001",
            clerkId,
            name: "Dhiraj Gaikwad",
            email: normalizedEmail,
            personalEmail: normalizedEmail,
            department: "Administration",
            designation: "Administrator / MD",
            role: "ADMIN",
            status: "ACTIVE",
            avatarUrl,
            salary: 150000,
            joinDate: new Date(),
          },
          include: { leaveBalances: true },
        });
      }
      return NextResponse.json({ success: true, isAuthorized: true, user: admin });
    }

    const employee = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: normalizedEmail, mode: "insensitive" } },
          { personalEmail: { equals: normalizedEmail, mode: "insensitive" } },
          { clerkId },
        ],
      },
      include: { leaveBalances: true },
    });

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          isAuthorized: false,
          error: "ACCESS_DENIED",
          message: `Your email (${normalizedEmail}) has not been registered by the Administrator. Please contact ${ADMIN_EMAIL}.`,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, isAuthorized: true, user: employee });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
