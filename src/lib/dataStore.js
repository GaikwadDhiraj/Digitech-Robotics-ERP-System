import { prisma } from "./prisma.js";

// Default leave policies for the year (1 Jan - 31 Dec)
const defaultLeavePolicies = [
  {
    id: "policy-1",
    name: "Casual Leave",
    code: "CL",
    defaultDaysPerYear: 12,
    description: "Paid leave for personal matters, emergency errands, or short breaks.",
    color: "indigo",
  },
  {
    id: "policy-2",
    name: "Sick Leave",
    code: "SL",
    defaultDaysPerYear: 10,
    description: "Medical leave for illness, medical appointments, and recovery.",
    color: "rose",
  },
  {
    id: "policy-3",
    name: "Annual Leave",
    code: "AL",
    defaultDaysPerYear: 15,
    description: "Earned annual vacation leave for rest and rejuvenation.",
    color: "emerald",
  },
  {
    id: "policy-4",
    name: "Emergency Leave",
    code: "EL",
    defaultDaysPerYear: 5,
    description: "Immediate leave for unforeseen personal or family emergencies.",
    color: "amber",
  },
  {
    id: "policy-comp",
    name: "Compensatory Off",
    code: "CO",
    defaultDaysPerYear: 0,
    description: "Earned complementary leave for approved weekend/holiday duty (+1 per approved claim). Valid for 60 days from worked date.",
    color: "teal",
  },
  {
    id: "policy-duty",
    name: "On Duty Leave",
    code: "OD",
    defaultDaysPerYear: 0,
    isUnlimited: true,
    description: "Official company on-duty assignments, external client visits, conferences, and offsite duty with no quota limit.",
    color: "sky",
  },
];

// Comprehensive Indian National & Gazetted Public Holidays calendar generator
function getStandardNationalHolidays(year = 2026) {
  const y = parseInt(year, 10) || 2026;

  // Fixed Date National & Gazetted Public Holidays (same date every year across the calendar)
  const fixed = [
    { name: "New Year's Day", date: `${y}-01-01`, type: "NATIONAL" },
    { name: "Makar Sankranti / Pongal", date: `${y}-01-14`, type: "FESTIVAL" },
    { name: "Republic Day", date: `${y}-01-26`, type: "NATIONAL" },
    { name: "Chhatrapati Shivaji Maharaj Jayanti", date: `${y}-02-19`, type: "FESTIVAL" },
    { name: "Dr. B.R. Ambedkar Jayanti", date: `${y}-04-14`, type: "NATIONAL" },
    { name: "Maharashtra Day / Labour Day", date: `${y}-05-01`, type: "NATIONAL" },
    { name: "Independence Day", date: `${y}-08-15`, type: "NATIONAL" },
    { name: "Mahatma Gandhi Jayanti", date: `${y}-10-02`, type: "NATIONAL" },
    { name: "Christmas Day", date: `${y}-12-25`, type: "NATIONAL" },
  ];

  // Lunar / Gazetted festivals specific to each calendar year
  const yearSpecific = {
    2025: [
      { name: "Maha Shivratri", date: "2025-02-26", type: "FESTIVAL" },
      { name: "Holi / Dhulivandan", date: "2025-03-14", type: "FESTIVAL" },
      { name: "Gudi Padwa", date: "2025-03-30", type: "FESTIVAL" },
      { name: "Eid-ul-Fitr (Ramzan Eid)", date: "2025-03-31", type: "FESTIVAL" },
      { name: "Good Friday", date: "2025-04-18", type: "FESTIVAL" },
      { name: "Buddha Purnima", date: "2025-05-12", type: "FESTIVAL" },
      { name: "Eid-ul-Adha (Bakrid)", date: "2025-06-07", type: "FESTIVAL" },
      { name: "Ganesh Chaturthi", date: "2025-08-27", type: "FESTIVAL" },
      { name: "Dussehra (Vijayadashami)", date: "2025-10-02", type: "FESTIVAL" },
      { name: "Diwali (Laxmi Pujan)", date: "2025-10-20", type: "FESTIVAL" },
      { name: "Govardhan Puja / Balipratipada", date: "2025-10-22", type: "FESTIVAL" },
      { name: "Bhai Dooj", date: "2025-10-23", type: "FESTIVAL" },
      { name: "Guru Nanak Jayanti", date: "2025-11-05", type: "FESTIVAL" },
    ],
    2026: [
      { name: "Maha Shivratri", date: "2026-02-15", type: "FESTIVAL" },
      { name: "Holi / Dhulivandan", date: "2026-03-04", type: "FESTIVAL" },
      { name: "Gudi Padwa / Ugadi", date: "2026-03-19", type: "FESTIVAL" },
      { name: "Eid-ul-Fitr (Ramzan Eid)", date: "2026-03-21", type: "FESTIVAL" },
      { name: "Good Friday", date: "2026-04-03", type: "FESTIVAL" },
      { name: "Mahavir Jayanti", date: "2026-04-01", type: "FESTIVAL" },
      { name: "Buddha Purnima", date: "2026-05-31", type: "FESTIVAL" },
      { name: "Eid-ul-Adha (Bakrid)", date: "2026-05-27", type: "FESTIVAL" },
      { name: "Muharram", date: "2026-06-26", type: "FESTIVAL" },
      { name: "Raksha Bandhan", date: "2026-08-28", type: "FESTIVAL" },
      { name: "Janmashtami", date: "2026-09-04", type: "FESTIVAL" },
      { name: "Ganesh Chaturthi", date: "2026-09-14", type: "FESTIVAL" },
      { name: "Eid-e-Milad", date: "2026-08-26", type: "FESTIVAL" },
      { name: "Dussehra (Vijayadashami)", date: "2026-10-20", type: "FESTIVAL" },
      { name: "Diwali (Laxmi Pujan)", date: "2026-11-08", type: "FESTIVAL" },
      { name: "Govardhan Puja / Balipratipada", date: "2026-11-10", type: "FESTIVAL" },
      { name: "Bhai Dooj", date: "2026-11-11", type: "FESTIVAL" },
      { name: "Guru Nanak Jayanti", date: "2026-11-24", type: "FESTIVAL" },
    ],
    2027: [
      { name: "Maha Shivratri", date: "2027-03-07", type: "FESTIVAL" },
      { name: "Holi / Dhulivandan", date: "2027-03-23", type: "FESTIVAL" },
      { name: "Good Friday", date: "2027-03-26", type: "FESTIVAL" },
      { name: "Gudi Padwa", date: "2027-04-07", type: "FESTIVAL" },
      { name: "Eid-ul-Fitr (Ramzan Eid)", date: "2027-04-09", type: "FESTIVAL" },
      { name: "Buddha Purnima", date: "2027-05-20", type: "FESTIVAL" },
      { name: "Eid-ul-Adha (Bakrid)", date: "2027-05-17", type: "FESTIVAL" },
      { name: "Ganesh Chaturthi", date: "2027-09-04", type: "FESTIVAL" },
      { name: "Dussehra (Vijayadashami)", date: "2027-10-10", type: "FESTIVAL" },
      { name: "Diwali (Laxmi Pujan)", date: "2027-10-29", type: "FESTIVAL" },
      { name: "Govardhan Puja / Balipratipada", date: "2027-10-31", type: "FESTIVAL" },
      { name: "Bhai Dooj", date: "2027-11-01", type: "FESTIVAL" },
      { name: "Guru Nanak Jayanti", date: "2027-11-14", type: "FESTIVAL" },
    ],
  };

  const festivals = yearSpecific[y] || [];
  return [...fixed, ...festivals].map((h, i) => ({
    id: `nat-${y}-${i}-${h.date}`,
    name: h.name,
    date: h.date,
    type: h.type,
    isWorkingDay: false,
  }));
}

// Fixed Holidays default seed list for 2026
const fixedHolidays = getStandardNationalHolidays(2026);

// Default Departments for the organization
const defaultDepartments = [
  { id: "dept-admin", name: "Admin Department", code: "ADM", description: "Executive administration, management, and system governance.", headName: "Dhiraj Gaikwad" },
  { id: "dept-1", name: "Robotics Engineering", code: "ROB-ENG", description: "Design, prototyping, and assembly of robotic systems.", headName: "Dhiraj Gaikwad" },
  { id: "dept-2", name: "Industrial Automation", code: "IND-AUTO", description: "PLC programming, SCADA, and factory automated cells.", headName: "Automation Lead" },
  { id: "dept-3", name: "Software Development", code: "SFT-DEV", description: "Cloud software, ERP, firmware, and AI algorithms.", headName: "Software Lead" },
  { id: "dept-4", name: "Operations & HR", code: "OPS-HR", description: "Human resources, workplace administration, and compliance.", headName: "Operations Head" },
  { id: "dept-5", name: "Research & Development", code: "RND-DEPT", description: "Next-gen autonomous mobile robots and computer vision.", headName: "R&D Lead" },
];

// Initial Admin Account
const initialEmployees = [
  {
    id: "admin-1",
    employeeId: "DG-26-0001",
    name: "Dhiraj Gaikwad",
    email: "dvgaikwad333@gmail.com",
    personalEmail: "dvgaikwad333@gmail.com",
    phone: "+91 98765 43210",
    department: "Administration",
    designation: "Administrator / MD",
    role: "ADMIN",
    status: "ACTIVE",
    salary: 1500000,
    joinDate: new Date("2026-01-01").toISOString(),
    bio: "Digitech Robotics Administrator",
    avatarUrl: "",
    bankDetailsLocked: true,
    bankEditRequested: false,
    resumeUrl: null,
    resumeName: null,
    aadharDocUrl: null,
    aadharDocName: null,
    panDocUrl: null,
    panDocName: null,
    bankDocUrl: null,
    bankDocName: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to seed annual leave balances for an employee
function generateInitialBalancesForUser(userId) {
  return defaultLeavePolicies.map((policy) => {
    return {
      id: `bal-${userId}-${policy.code}`,
      userId,
      year: 2026,
      leaveType: policy.name,
      allocatedDays: policy.defaultDaysPerYear,
      usedDays: 0,
      remainingDays: policy.defaultDaysPerYear,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

// Initial leaves (empty - clean system)
const initialLeaves = [];

// In-memory global store so state persists across API routes during dev
const globalMemory = globalThis;
if (!globalMemory.__ERP_EMPLOYEES__) {
  globalMemory.__ERP_EMPLOYEES__ = [...initialEmployees];
}
if (!globalMemory.__ERP_POLICIES__) {
  globalMemory.__ERP_POLICIES__ = [...defaultLeavePolicies];
}
if (!globalMemory.__ERP_BALANCES__) {
  globalMemory.__ERP_BALANCES__ = [];
  globalMemory.__ERP_EMPLOYEES__.forEach((emp) => {
    globalMemory.__ERP_BALANCES__.push(...generateInitialBalancesForUser(emp.id));
  });
}
if (!globalMemory.__ERP_LEAVES__) {
  globalMemory.__ERP_LEAVES__ = [...initialLeaves];
}
if (!globalMemory.__ERP_HOLIDAYS__) {
  globalMemory.__ERP_HOLIDAYS__ = [...fixedHolidays];
}
if (!globalMemory.__ERP_DEPARTMENTS__) {
  globalMemory.__ERP_DEPARTMENTS__ = [...defaultDepartments];
}
if (!globalMemory.__ERP_COMP_OFFS__) {
  globalMemory.__ERP_COMP_OFFS__ = [];
}
if (!globalMemory.__ERP_CALENDAR_SETTING__) {
  globalMemory.__ERP_CALENDAR_SETTING__ = {
    id: "default-org-calendar",
    weeklyOffDay: "SUNDAY",
    defaultStartTime: "09:15 AM",
    defaultEndTime: "06:30 PM",
  };
}

// Helper to check if Prisma has a working database connection
async function isPrismaAvailable() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("YOUR_PASSWORD") || url.includes("ep-sample-pooler")) {
    return false;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    return false;
  }
}

export const dataStore = {
  // EMPLOYEE METHODS
  async getEmployees() {
    if (await isPrismaAvailable()) {
      try {
        return await prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          include: { leaves: true, leaveBalances: true },
        });
      } catch (err) {
        console.warn("Prisma fallback:", err.message);
      }
    }
    return globalMemory.__ERP_EMPLOYEES__.map((emp) => ({
      ...emp,
      leaves: globalMemory.__ERP_LEAVES__.filter((l) => l.userId === emp.id),
      leaveBalances: globalMemory.__ERP_BALANCES__.filter((b) => b.userId === emp.id),
    }));
  },

  async getEmployeeById(id) {
    if (await isPrismaAvailable()) {
      try {
        return await prisma.user.findUnique({
          where: { id },
          include: { leaves: true, leaveBalances: true },
        });
      } catch (err) {
        console.warn("Prisma fallback:", err.message);
      }
    }
    const emp = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === id);
    if (!emp) return null;
    return {
      ...emp,
      leaves: globalMemory.__ERP_LEAVES__.filter((l) => l.userId === emp.id),
      leaveBalances: globalMemory.__ERP_BALANCES__.filter((b) => b.userId === emp.id),
    };
  },

  async createEmployee(data) {
    let generatedId = data.employeeId;
    if (!generatedId || generatedId.startsWith("Digitech-") || generatedId.startsWith("EMP-")) {
      const joinYear = data.joinDate ? new Date(data.joinDate).getFullYear().toString().slice(-2) : "26";
      let count = 1;
      if (await isPrismaAvailable()) {
        try {
          const empCount = await prisma.user.count();
          count = empCount + 1;
        } catch (e) {
          count = globalMemory.__ERP_EMPLOYEES__.length + 1;
        }
      } else {
        count = globalMemory.__ERP_EMPLOYEES__.length + 1;
      }
      generatedId = `DG-${joinYear}-${String(count).padStart(4, "0")}`;
    }

    const newEmp = {
      id: "emp-" + Date.now(),
      employeeId: generatedId,
      name: data.name,
      email: data.email,
      personalEmail: data.personalEmail || "",
      phone: data.phone || "",
      department: data.department || "Robotics Engineering",
      designation: data.designation,
      role: data.role || "EMPLOYEE",
      status: data.status || "ACTIVE",
      salary: data.salary ? parseFloat(data.salary) : 0,
      joinDate: data.joinDate || new Date().toISOString(),
      dob: data.dob || "",
      gender: data.gender || "Other",
      maritalStatus: data.maritalStatus || "Single",
      bloodGroup: data.bloodGroup || "O+",
      aadharNumber: data.aadharNumber || "",
      panNumber: data.panNumber || "",
      residentialAddress: data.residentialAddress || "",
      communicationAddress: data.communicationAddress || data.residentialAddress || "",
      bankAccountName: data.bankAccountName || data.name,
      bankAccountNumber: data.bankAccountNumber || "",
      bankIfscCode: data.bankIfscCode || "",
      bankName: data.bankName || "",
      bankDetailsLocked: data.bankDetailsLocked || false,
      bankEditRequested: data.bankEditRequested || false,
      resumeUrl: data.resumeUrl || null,
      resumeName: data.resumeName || null,
      aadharDocUrl: data.aadharDocUrl || null,
      aadharDocName: data.aadharDocName || null,
      panDocUrl: data.panDocUrl || null,
      panDocName: data.panDocName || null,
      bankDocUrl: data.bankDocUrl || null,
      bankDocName: data.bankDocName || null,
      emergencyContact: data.emergencyContact || "",
      avatarUrl: data.avatarUrl || null,
      bio: data.bio || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (await isPrismaAvailable()) {
      try {
        const created = await prisma.user.create({
          data: {
            ...newEmp,
            joinDate: new Date(newEmp.joinDate),
            dob: newEmp.dob ? new Date(newEmp.dob) : null,
          },
        });
        return created;
      } catch (err) {
        console.warn("Prisma fallback:", err.message);
      }
    }

    globalMemory.__ERP_EMPLOYEES__.unshift(newEmp);

    // Automatically allocate default leave policies for year 2026
    globalMemory.__ERP_POLICIES__.forEach((policy) => {
      globalMemory.__ERP_BALANCES__.push({
        id: `bal-${newEmp.id}-${policy.code}`,
        userId: newEmp.id,
        year: 2026,
        leaveType: policy.name,
        allocatedDays: policy.defaultDaysPerYear,
        usedDays: 0,
        remainingDays: policy.defaultDaysPerYear,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    return newEmp;
  },

  async updateEmployee(id, data, options = {}) {
    let updatePayload = { ...data };

    // Employee self-service restrictions
    if (options.isEmployeeSelfEdit) {
      delete updatePayload.name;
      delete updatePayload.email;
      delete updatePayload.salary;
      delete updatePayload.role;
      delete updatePayload.department;
      delete updatePayload.designation;

      const existing = await this.getEmployeeById(id);
      if (existing?.bankDetailsLocked) {
        delete updatePayload.bankAccountName;
        delete updatePayload.bankAccountNumber;
        delete updatePayload.bankIfscCode;
        delete updatePayload.bankName;
        delete updatePayload.bankDocUrl;
        delete updatePayload.bankDocName;
      } else if (updatePayload.bankAccountNumber && updatePayload.bankAccountNumber.trim().length > 0) {
        // First-time submission of bank details locks it automatically
        updatePayload.bankDetailsLocked = true;
      }
    }

    if (await isPrismaAvailable()) {
      try {
        return await prisma.user.update({
          where: { id },
          data: {
            ...updatePayload,
            salary: updatePayload.salary !== undefined ? parseFloat(updatePayload.salary) : undefined,
            joinDate: updatePayload.joinDate ? new Date(updatePayload.joinDate) : undefined,
            dob: updatePayload.dob ? new Date(updatePayload.dob) : undefined,
          },
        });
      } catch (err) {
        console.warn("Prisma fallback:", err.message);
      }
    }

    const index = globalMemory.__ERP_EMPLOYEES__.findIndex((e) => e.id === id);
    if (index === -1) return null;
    globalMemory.__ERP_EMPLOYEES__[index] = {
      ...globalMemory.__ERP_EMPLOYEES__[index],
      ...updatePayload,
      salary: updatePayload.salary !== undefined ? parseFloat(updatePayload.salary) : globalMemory.__ERP_EMPLOYEES__[index].salary,
      updatedAt: new Date().toISOString(),
    };
    return globalMemory.__ERP_EMPLOYEES__[index];
  },

  async toggleEmployeeStatus(id) {
    if (await isPrismaAvailable()) {
      try {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u) {
          const newStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          const updated = await prisma.user.update({
            where: { id },
            data: { status: newStatus },
          });
          return updated;
        }
      } catch (err) {
        console.warn("Prisma toggleEmployeeStatus fallback:", err.message);
      }
    }
    const index = globalMemory.__ERP_EMPLOYEES__.findIndex((e) => e.id === id);
    if (index === -1) return null;
    const current = globalMemory.__ERP_EMPLOYEES__[index].status;
    const newStatus = current === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    globalMemory.__ERP_EMPLOYEES__[index].status = newStatus;
    globalMemory.__ERP_EMPLOYEES__[index].updatedAt = new Date().toISOString();
    return globalMemory.__ERP_EMPLOYEES__[index];
  },

  async deleteEmployee(id) {
    if (await isPrismaAvailable()) {
      try {
        await prisma.user.delete({ where: { id } });
        return true;
      } catch (err) {
        console.warn("Prisma fallback:", err.message);
      }
    }
    globalMemory.__ERP_EMPLOYEES__ = globalMemory.__ERP_EMPLOYEES__.filter((e) => e.id !== id);
    globalMemory.__ERP_LEAVES__ = globalMemory.__ERP_LEAVES__.filter((l) => l.userId !== id);
    globalMemory.__ERP_BALANCES__ = globalMemory.__ERP_BALANCES__.filter((b) => b.userId !== id);
    return true;
  },

  // Helper: Calculate Comp Off 60-Day Validity & Available Balance via FIFO
  async calculateCompOffBalanceForUser(userId, year = 2026) {
    const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;
    const now = new Date();

    if (await isPrismaAvailable()) {
      try {
        const approvedClaims = await prisma.compOffRequest.findMany({
          where: { userId, status: "APPROVED" },
          orderBy: { date: "asc" },
        });

        const approvedLeaves = await prisma.leaveRequest.findMany({
          where: {
            userId,
            status: "APPROVED",
            OR: [{ leaveType: "Compensatory Off" }, { leaveType: "Comp Off" }],
          },
        });

        const totalUsedDays = approvedLeaves.reduce((sum, l) => sum + (l.daysCount || 0), 0);

        let usedDaysToConsume = totalUsedDays;
        let validAvailableDays = 0;
        let expiredUnusedDays = 0;

        for (const claim of approvedClaims) {
          const claimDate = new Date(claim.date);
          const validUntil = new Date(claimDate.getTime() + SIXTY_DAYS_MS);
          const isExpired = now > validUntil;

          if (usedDaysToConsume >= 1) {
            usedDaysToConsume -= 1;
          } else if (usedDaysToConsume > 0) {
            const fractionRemaining = 1 - usedDaysToConsume;
            usedDaysToConsume = 0;
            if (isExpired) {
              expiredUnusedDays += fractionRemaining;
            } else {
              validAvailableDays += fractionRemaining;
            }
          } else {
            if (isExpired) {
              expiredUnusedDays += 1;
            } else {
              validAvailableDays += 1;
            }
          }
        }

        const totalAllocated = totalUsedDays + validAvailableDays;

        await prisma.leaveBalance.upsert({
          where: {
            userId_year_leaveType: {
              userId,
              year,
              leaveType: "Compensatory Off",
            },
          },
          update: {
            allocatedDays: totalAllocated,
            usedDays: totalUsedDays,
            remainingDays: validAvailableDays,
          },
          create: {
            userId,
            year,
            leaveType: "Compensatory Off",
            allocatedDays: totalAllocated,
            usedDays: totalUsedDays,
            remainingDays: validAvailableDays,
          },
        }).catch(() => {});

        return {
          validAvailableDays,
          totalUsedDays,
          expiredUnusedDays,
          totalApprovedClaims: approvedClaims.length,
        };
      } catch (err) {
        console.warn("calculateCompOffBalanceForUser error:", err.message);
      }
    }

    // In-memory fallback
    const approvedClaims = (globalMemory.__ERP_COMP_OFFS__ || [])
      .filter((c) => c.userId === userId && c.status === "APPROVED")
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const approvedLeaves = (globalMemory.__ERP_LEAVES__ || [])
      .filter(
        (l) =>
          l.userId === userId &&
          l.status === "APPROVED" &&
          (l.leaveType === "Compensatory Off" || l.leaveType === "Comp Off")
      );

    const totalUsedDays = approvedLeaves.reduce((sum, l) => sum + (l.daysCount || 0), 0);
    let usedDaysToConsume = totalUsedDays;
    let validAvailableDays = 0;
    let expiredUnusedDays = 0;

    for (const claim of approvedClaims) {
      const claimDate = new Date(claim.date);
      const validUntil = new Date(claimDate.getTime() + SIXTY_DAYS_MS);
      const isExpired = now > validUntil;

      if (usedDaysToConsume >= 1) {
        usedDaysToConsume -= 1;
      } else if (usedDaysToConsume > 0) {
        const fractionRemaining = 1 - usedDaysToConsume;
        usedDaysToConsume = 0;
        if (isExpired) {
          expiredUnusedDays += fractionRemaining;
        } else {
          validAvailableDays += fractionRemaining;
        }
      } else {
        if (isExpired) {
          expiredUnusedDays += 1;
        } else {
          validAvailableDays += 1;
        }
      }
    }

    const balIndex = (globalMemory.__ERP_BALANCES__ || []).findIndex(
      (b) => b.userId === userId && b.year === year && (b.leaveType === "Compensatory Off" || b.leaveType === "Comp Off")
    );
    if (balIndex !== -1) {
      globalMemory.__ERP_BALANCES__[balIndex] = {
        ...globalMemory.__ERP_BALANCES__[balIndex],
        allocatedDays: totalUsedDays + validAvailableDays,
        usedDays: totalUsedDays,
        remainingDays: validAvailableDays,
      };
    }

    return {
      validAvailableDays,
      totalUsedDays,
      expiredUnusedDays,
      totalApprovedClaims: approvedClaims.length,
    };
  },

  // LEAVE POLICIES & BALANCES
  async getLeavePolicies() {
    if (await isPrismaAvailable()) {
      try {
        const count = await prisma.leaveTypePolicy.count();
        if (count === 0) {
          // Only seed initial default policies when table is empty
          for (const pol of defaultLeavePolicies) {
            await prisma.leaveTypePolicy.create({
              data: {
                name: pol.name,
                code: pol.code,
                defaultDaysPerYear: pol.defaultDaysPerYear,
                description: pol.description,
                color: pol.color,
              },
            }).catch(() => {});
          }
        } else {
          // Ensure "On Duty Leave" is seeded once if not already present
          const hasOnDuty = await prisma.leaveTypePolicy.findFirst({
            where: { OR: [{ code: "OD" }, { name: "On Duty Leave" }, { name: "In Duty Leave" }] },
          });
          if (!hasOnDuty) {
            await prisma.leaveTypePolicy.create({
              data: {
                name: "On Duty Leave",
                code: "OD",
                defaultDaysPerYear: 0,
                description: "Official company on-duty work, external client visits, conferences, or offsite assignments with no quota limit.",
                color: "sky",
              },
            }).catch(() => {});
          }
        }

        const dbPolicies = await prisma.leaveTypePolicy.findMany({
          orderBy: { createdAt: "asc" },
        });
        if (dbPolicies && dbPolicies.length > 0) {
          return dbPolicies.map((p) => ({
            ...p,
            isUnlimited: p.code === "OD" || p.name === "On Duty Leave" || p.name === "In Duty Leave" || (p.defaultDaysPerYear === 0 && p.code !== "CO"),
          }));
        }
      } catch (err) {
        console.warn("Prisma getLeavePolicies fallback:", err.message);
      }
    }
    return (globalMemory.__ERP_POLICIES__ || []).map((p) => ({
      ...p,
      isUnlimited: p.code === "OD" || p.name === "On Duty Leave" || p.name === "In Duty Leave" || (p.defaultDaysPerYear === 0 && p.code !== "CO"),
    }));
  },

  async addLeavePolicy(data) {
    const isUnlimited = !!data.isUnlimited || data.code === "OD" || data.name === "On Duty Leave";
    const defaultDays = isUnlimited ? 0 : data.defaultDaysPerYear !== undefined ? parseFloat(data.defaultDaysPerYear) : 10;
    const newPolicy = {
      id: "policy-" + Date.now(),
      name: data.name.trim(),
      code: (data.code || data.name.substring(0, 4)).toUpperCase().trim(),
      defaultDaysPerYear: isNaN(defaultDays) ? 0 : defaultDays,
      description: data.description || "",
      color: data.color || "indigo",
      isUnlimited,
    };

    if (await isPrismaAvailable()) {
      try {
        const created = await prisma.leaveTypePolicy.create({
          data: {
            name: newPolicy.name,
            code: newPolicy.code,
            defaultDaysPerYear: newPolicy.defaultDaysPerYear,
            description: newPolicy.description,
            color: newPolicy.color,
          },
        });

        // Automatically allocate this new leave type to all existing employees for year 2026
        const allUsers = await prisma.user.findMany({ select: { id: true } });
        for (const u of allUsers) {
          await prisma.leaveBalance.upsert({
            where: {
              userId_year_leaveType: {
                userId: u.id,
                year: 2026,
                leaveType: created.name,
              },
            },
            update: {},
            create: {
              userId: u.id,
              year: 2026,
              leaveType: created.name,
              allocatedDays: created.defaultDaysPerYear,
              usedDays: 0,
              remainingDays: created.defaultDaysPerYear,
            },
          }).catch(() => {});
        }

        return { ...created, isUnlimited };
      } catch (err) {
        console.error("Prisma addLeavePolicy error:", err);
        throw new Error(err.message || "Failed to add leave policy in database.");
      }
    }

    globalMemory.__ERP_POLICIES__.push(newPolicy);

    // Automatically allocate this new leave type to all employees for the year 2026
    globalMemory.__ERP_EMPLOYEES__.forEach((emp) => {
      const exists = globalMemory.__ERP_BALANCES__.find(
        (b) => b.userId === emp.id && b.leaveType === newPolicy.name
      );
      if (!exists) {
        globalMemory.__ERP_BALANCES__.push({
          id: `bal-${emp.id}-${newPolicy.code}-${Date.now()}`,
          userId: emp.id,
          year: 2026,
          leaveType: newPolicy.name,
          allocatedDays: newPolicy.defaultDaysPerYear,
          usedDays: 0,
          remainingDays: newPolicy.defaultDaysPerYear,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return newPolicy;
  },

  async updateLeavePolicy(id, data) {
    if (await isPrismaAvailable()) {
      try {
        const existing = await prisma.leaveTypePolicy.findUnique({ where: { id } });
        if (existing) {
          const newName = (data.name || existing.name).trim();
          const newCode = (data.code || existing.code).trim().toUpperCase();
          const isUnlimited = !!data.isUnlimited || newCode === "OD" || newName === "On Duty Leave";
          const newDays = isUnlimited
            ? 0
            : data.defaultDaysPerYear !== undefined
            ? parseFloat(data.defaultDaysPerYear)
            : existing.defaultDaysPerYear;

          const updated = await prisma.leaveTypePolicy.update({
            where: { id },
            data: {
              name: newName,
              code: newCode,
              defaultDaysPerYear: isNaN(newDays) ? 0 : newDays,
              description: data.description !== undefined ? data.description : existing.description,
              color: data.color || existing.color,
            },
          });

          // Cascade name change to LeaveBalance and LeaveRequest
          if (newName !== existing.name) {
            await prisma.leaveBalance.updateMany({
              where: { leaveType: existing.name },
              data: { leaveType: newName },
            });
            await prisma.leaveRequest.updateMany({
              where: { leaveType: existing.name },
              data: { leaveType: newName },
            });
          }

          // Cascade quota changes to all employees
          if (newDays !== existing.defaultDaysPerYear && !isNaN(newDays) && !isUnlimited && newCode !== "CO") {
            const allBalances = await prisma.leaveBalance.findMany({
              where: { leaveType: newName, year: 2026 },
            });
            for (const bal of allBalances) {
              const newRemaining = Math.max(0, newDays - bal.usedDays);
              await prisma.leaveBalance.update({
                where: { id: bal.id },
                data: {
                  allocatedDays: newDays,
                  remainingDays: newRemaining,
                },
              });
            }
          }

          return { ...updated, isUnlimited };
        }
      } catch (err) {
        console.error("Prisma updateLeavePolicy error:", err);
        throw new Error(err.message || "Failed to update leave policy in database.");
      }
    }

    const index = (globalMemory.__ERP_POLICIES__ || []).findIndex((p) => p.id === id);
    if (index === -1) return null;

    const oldPolicy = globalMemory.__ERP_POLICIES__[index];
    const isUnlimited = !!data.isUnlimited || data.code === "OD" || (data.name && data.name.includes("On Duty"));
    const newDays = isUnlimited ? 0 : data.defaultDaysPerYear !== undefined ? parseFloat(data.defaultDaysPerYear) : oldPolicy.defaultDaysPerYear;
    const newName = (data.name || oldPolicy.name).trim();

    globalMemory.__ERP_POLICIES__[index] = {
      ...oldPolicy,
      name: newName,
      code: (data.code || oldPolicy.code).toUpperCase().trim(),
      defaultDaysPerYear: isNaN(newDays) ? 0 : newDays,
      description: data.description !== undefined ? data.description : oldPolicy.description,
      color: data.color || oldPolicy.color,
      isUnlimited,
    };

    // Update corresponding employee leave balances in memory
    (globalMemory.__ERP_BALANCES__ || []).forEach((bal) => {
      if (bal.leaveType === oldPolicy.name) {
        bal.leaveType = newName;
        bal.allocatedDays = newDays;
        bal.remainingDays = Math.max(0, newDays - bal.usedDays);
        bal.updatedAt = new Date().toISOString();
      }
    });

    if (newName !== oldPolicy.name) {
      (globalMemory.__ERP_LEAVES__ || []).forEach((l) => {
        if (l.leaveType === oldPolicy.name) {
          l.leaveType = newName;
          l.updatedAt = new Date().toISOString();
        }
      });
    }

    return globalMemory.__ERP_POLICIES__[index];
  },

  async deleteLeavePolicy(id) {
    if (await isPrismaAvailable()) {
      try {
        const pol = await prisma.leaveTypePolicy.findUnique({ where: { id } });
        if (pol) {
          await prisma.leaveBalance.deleteMany({ where: { leaveType: pol.name } });
          await prisma.leaveTypePolicy.delete({ where: { id: pol.id } });

          // Also remove from in-memory fallback
          globalMemory.__ERP_POLICIES__ = (globalMemory.__ERP_POLICIES__ || []).filter(
            (p) => p.id !== id && p.code !== pol.code && p.name !== pol.name
          );
          globalMemory.__ERP_BALANCES__ = (globalMemory.__ERP_BALANCES__ || []).filter(
            (b) => b.leaveType !== pol.name
          );
          return true;
        }
      } catch (err) {
        console.error("Prisma deleteLeavePolicy error:", err);
        throw new Error(err.message || "Failed to delete leave policy from database.");
      }
    }

    const policy = (globalMemory.__ERP_POLICIES__ || []).find((p) => p.id === id);
    if (!policy) return false;

    globalMemory.__ERP_POLICIES__ = globalMemory.__ERP_POLICIES__.filter((p) => p.id !== id);
    globalMemory.__ERP_BALANCES__ = globalMemory.__ERP_BALANCES__.filter((b) => b.leaveType !== policy.name);
    return true;
  },

  async getEmployeeBalances(userId, year = 2026) {
    // Recalculate Comp-Off balance against 60-day validity window
    const compOffInfo = await this.calculateCompOffBalanceForUser(userId, year);

    if (await isPrismaAvailable()) {
      try {
        const policies = await prisma.leaveTypePolicy.findMany();
        for (const p of policies) {
          await prisma.leaveBalance.upsert({
            where: {
              userId_year_leaveType: {
                userId,
                year,
                leaveType: p.name,
              },
            },
            update: {},
            create: {
              userId,
              year,
              leaveType: p.name,
              allocatedDays: p.defaultDaysPerYear,
              usedDays: 0,
              remainingDays: p.defaultDaysPerYear,
            },
          }).catch(() => {});
        }

        const dbBalances = await prisma.leaveBalance.findMany({
          where: { userId, year },
          orderBy: { leaveType: "asc" },
        });

        if (dbBalances && dbBalances.length > 0) {
          return dbBalances.map((bal) => {
            const isUnlimited = bal.leaveType === "On Duty Leave" || bal.leaveType === "In Duty Leave";
            const isCompOff = bal.leaveType === "Compensatory Off" || bal.leaveType === "Comp Off";
            return {
              ...bal,
              isUnlimited,
              isCompOff,
              validityDays: isCompOff ? 60 : null,
              expiredDays: isCompOff ? compOffInfo?.expiredUnusedDays || 0 : 0,
            };
          });
        }
      } catch (err) {
        console.warn("Prisma getEmployeeBalances fallback:", err.message);
      }
    }

    let balances = (globalMemory.__ERP_BALANCES__ || []).filter(
      (b) => b.userId === userId && b.year === year
    );

    (globalMemory.__ERP_POLICIES__ || []).forEach((policy) => {
      let b = balances.find((x) => x.leaveType === policy.name);
      if (!b) {
        const newBal = {
          id: `bal-${userId}-${policy.code}-${Date.now()}`,
          userId,
          year,
          leaveType: policy.name,
          allocatedDays: policy.defaultDaysPerYear,
          usedDays: 0,
          remainingDays: policy.defaultDaysPerYear,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        globalMemory.__ERP_BALANCES__.push(newBal);
        balances.push(newBal);
      }
    });

    return balances.map((bal) => {
      const isUnlimited = bal.leaveType === "On Duty Leave" || bal.leaveType === "In Duty Leave";
      const isCompOff = bal.leaveType === "Compensatory Off" || bal.leaveType === "Comp Off";
      return {
        ...bal,
        isUnlimited,
        isCompOff,
        validityDays: isCompOff ? 60 : null,
        expiredDays: isCompOff ? compOffInfo?.expiredUnusedDays || 0 : 0,
      };
    });
  },

  // LEAVE REQUESTS
  async getLeaves(filters = {}) {
    if (await isPrismaAvailable()) {
      try {
        const where = {};
        if (filters.userId) where.userId = filters.userId;
        if (filters.status && filters.status !== "ALL") where.status = filters.status;

        const dbLeaves = await prisma.leaveRequest.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                department: true,
                designation: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return dbLeaves.map((l) => ({
          ...l,
          startDate: l.startDate.toISOString(),
          endDate: l.endDate.toISOString(),
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
        }));
      } catch (err) {
        console.warn("Prisma getLeaves fallback:", err.message);
      }
    }

    let result = globalMemory.__ERP_LEAVES__.map((leave) => {
      const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === leave.userId);
      return { ...leave, user };
    });

    if (filters.userId) {
      result = result.filter((l) => l.userId === filters.userId);
    }
    if (filters.status && filters.status !== "ALL") {
      result = result.filter((l) => l.status === filters.status);
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createLeave(data) {
    const daysCount = parseFloat(data.daysCount) || (data.isHalfDay ? 0.5 : 1);

    const newLeave = {
      id: "leave-" + Date.now(),
      userId: data.userId,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      isHalfDay: !!data.isHalfDay,
      halfDayType: data.halfDayType || null,
      daysCount,
      reason: data.reason,
      inchargePerson: data.inchargePerson || null,
      contactDuringLeave: data.contactDuringLeave || null,
      documentUrl: data.documentUrl || null,
      documentName: data.documentName || null,
      status: "PENDING",
      actionNotes: null,
      actionDate: null,
      actionBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (await isPrismaAvailable()) {
      try {
        const created = await prisma.leaveRequest.create({
          data: {
            userId: data.userId,
            leaveType: data.leaveType,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            isHalfDay: !!data.isHalfDay,
            halfDayType: data.halfDayType || null,
            daysCount,
            reason: data.reason,
            inchargePerson: data.inchargePerson || null,
            contactDuringLeave: data.contactDuringLeave || null,
            documentUrl: data.documentUrl || null,
            documentName: data.documentName || null,
            status: "PENDING",
          },
          include: {
            user: {
              select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                department: true,
                designation: true,
                avatarUrl: true,
              },
            },
          },
        });

        return {
          ...created,
          startDate: created.startDate.toISOString(),
          endDate: created.endDate.toISOString(),
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        };
      } catch (err) {
        console.warn("Prisma createLeave fallback:", err.message);
      }
    }

    globalMemory.__ERP_LEAVES__.unshift(newLeave);

    const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === data.userId);
    return { ...newLeave, user };
  },

  async updateLeaveStatus(id, { status, actionNotes, actionBy }) {
    if (await isPrismaAvailable()) {
      try {
        const leave = await prisma.leaveRequest.findUnique({ where: { id } });
        if (leave) {
          const previousStatus = leave.status;
          const updated = await prisma.leaveRequest.update({
            where: { id },
            data: {
              status,
              actionNotes: actionNotes || null,
              actionDate: new Date(),
              actionBy: actionBy || "Admin",
            },
            include: { user: true },
          });

          // If newly approved, update leave balance used days and remaining days
          if (status === "APPROVED" && previousStatus !== "APPROVED") {
            const isUnlimited =
              leave.leaveType === "On Duty Leave" ||
              leave.leaveType === "In Duty Leave";
            const isCompOff =
              leave.leaveType === "Compensatory Off" ||
              leave.leaveType === "Comp Off";

            if (isUnlimited) {
              await prisma.leaveBalance.updateMany({
                where: {
                  userId: leave.userId,
                  year: 2026,
                  leaveType: leave.leaveType,
                },
                data: {
                  usedDays: { increment: leave.daysCount },
                },
              });
            } else if (isCompOff) {
              await this.calculateCompOffBalanceForUser(leave.userId, 2026);
            } else {
              await prisma.leaveBalance.updateMany({
                where: {
                  userId: leave.userId,
                  year: 2026,
                  leaveType: leave.leaveType,
                },
                data: {
                  usedDays: { increment: leave.daysCount },
                  remainingDays: { decrement: leave.daysCount },
                },
              });
            }
          }

          // If previously approved but now rejected, restore used days
          if (previousStatus === "APPROVED" && status === "REJECTED") {
            const isUnlimited =
              leave.leaveType === "On Duty Leave" ||
              leave.leaveType === "In Duty Leave";
            const isCompOff =
              leave.leaveType === "Compensatory Off" ||
              leave.leaveType === "Comp Off";

            if (isUnlimited) {
              await prisma.leaveBalance.updateMany({
                where: {
                  userId: leave.userId,
                  year: 2026,
                  leaveType: leave.leaveType,
                },
                data: {
                  usedDays: { decrement: leave.daysCount },
                },
              });
            } else if (isCompOff) {
              await this.calculateCompOffBalanceForUser(leave.userId, 2026);
            } else {
              await prisma.leaveBalance.updateMany({
                where: {
                  userId: leave.userId,
                  year: 2026,
                  leaveType: leave.leaveType,
                },
                data: {
                  usedDays: { decrement: leave.daysCount },
                  remainingDays: { increment: leave.daysCount },
                },
              });
            }
          }

          return {
            ...updated,
            startDate: updated.startDate.toISOString(),
            endDate: updated.endDate.toISOString(),
            createdAt: updated.createdAt.toISOString(),
            updatedAt: updated.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        console.warn("Prisma updateLeaveStatus fallback:", err.message);
      }
    }

    const index = globalMemory.__ERP_LEAVES__.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const previousStatus = globalMemory.__ERP_LEAVES__[index].status;
    const leave = globalMemory.__ERP_LEAVES__[index];

    globalMemory.__ERP_LEAVES__[index] = {
      ...leave,
      status,
      actionNotes: actionNotes || null,
      actionDate: new Date().toISOString(),
      actionBy: actionBy || "Admin",
      updatedAt: new Date().toISOString(),
    };

    // If newly approved, update leave balance used days
    if (status === "APPROVED" && previousStatus !== "APPROVED") {
      const balIndex = globalMemory.__ERP_BALANCES__.findIndex(
        (b) => b.userId === leave.userId && b.leaveType === leave.leaveType && b.year === 2026
      );
      if (balIndex !== -1) {
        const bal = globalMemory.__ERP_BALANCES__[balIndex];
        const newUsed = bal.usedDays + leave.daysCount;
        globalMemory.__ERP_BALANCES__[balIndex] = {
          ...bal,
          usedDays: newUsed,
          remainingDays: Math.max(0, bal.allocatedDays - newUsed),
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // If previously approved but now rejected, restore used days
    if (previousStatus === "APPROVED" && status === "REJECTED") {
      const balIndex = globalMemory.__ERP_BALANCES__.findIndex(
        (b) => b.userId === leave.userId && b.leaveType === leave.leaveType && b.year === 2026
      );
      if (balIndex !== -1) {
        const bal = globalMemory.__ERP_BALANCES__[balIndex];
        const newUsed = Math.max(0, bal.usedDays - leave.daysCount);
        globalMemory.__ERP_BALANCES__[balIndex] = {
          ...bal,
          usedDays: newUsed,
          remainingDays: Math.max(0, bal.allocatedDays - newUsed),
          updatedAt: new Date().toISOString(),
        };
      }
    }

    const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === leave.userId);
    return { ...globalMemory.__ERP_LEAVES__[index], user };
  },

  // HOLIDAYS & WORK ROSTER METHODS
  async getHolidays(targetYear) {
    // Generate automatic national & gazetted public holidays for calendar years (Republic Day, Independence Day, Gandhi Jayanti, Christmas Day, etc.)
    const yearsToGenerate = targetYear ? [parseInt(targetYear, 10)] : [2025, 2026, 2027];
    const nationalHolidays = [];
    yearsToGenerate.forEach((y) => {
      nationalHolidays.push(...getStandardNationalHolidays(y));
    });

    let dbHolidays = [];
    if (await isPrismaAvailable()) {
      try {
        const holidaysInDb = await prisma.holiday.findMany({
          orderBy: { date: "asc" },
        });
        dbHolidays = holidaysInDb.map((h) => ({
          ...h,
          date: h.date.toISOString().split("T")[0],
        }));
      } catch (err) {
        console.warn("Prisma holidays fallback:", err.message);
        dbHolidays = globalMemory.__ERP_HOLIDAYS__ || [];
      }
    } else {
      dbHolidays = globalMemory.__ERP_HOLIDAYS__ || [];
    }

    // Merge: National holidays are automatically included across the annual calendar.
    // Any holiday explicitly added or overridden in the Database (e.g. forced working day) takes precedence!
    const holidayMap = new Map();
    for (const nat of nationalHolidays) {
      holidayMap.set(nat.date, nat);
    }
    for (const dbh of dbHolidays) {
      holidayMap.set(dbh.date, dbh);
    }

    return Array.from(holidayMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  },

  async createHoliday(data) {
    const dateStr = (data.date || "").split("T")[0];
    const newH = {
      id: "h-" + Date.now(),
      name: data.name,
      date: dateStr,
      type: data.type || "COMPANY",
      isWorkingDay: data.isWorkingDay === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (await isPrismaAvailable()) {
      try {
        const created = await prisma.holiday.create({
          data: {
            name: newH.name,
            date: new Date(newH.date),
            type: newH.type,
            isWorkingDay: newH.isWorkingDay,
          },
        });
        return {
          ...created,
          date: created.date.toISOString().split("T")[0],
        };
      } catch (err) {
        console.warn("Prisma create holiday fallback:", err.message);
      }
    }

    const idx = globalMemory.__ERP_HOLIDAYS__.findIndex((h) => h.date === dateStr);
    if (idx !== -1) {
      globalMemory.__ERP_HOLIDAYS__[idx] = newH;
    } else {
      globalMemory.__ERP_HOLIDAYS__.push(newH);
    }
    return newH;
  },

  async deleteHoliday(id) {
    if (await isPrismaAvailable()) {
      try {
        await prisma.holiday.delete({ where: { id } });
        return true;
      } catch (err) {
        console.warn("Prisma delete holiday fallback:", err.message);
      }
    }
    const idx = globalMemory.__ERP_HOLIDAYS__.findIndex((h) => h.id === id);
    if (idx !== -1) {
      globalMemory.__ERP_HOLIDAYS__.splice(idx, 1);
      return true;
    }
    return false;
  },

  // CALENDAR SETTINGS (WEEKLY OFF & TIMINGS)
  async getCalendarSetting() {
    if (await isPrismaAvailable()) {
      try {
        let setting = await prisma.calendarSetting.findFirst();
        if (!setting) {
          setting = await prisma.calendarSetting.create({
            data: {
              id: "default-org-calendar",
              weeklyOffDay: "SUNDAY",
              defaultStartTime: "09:15 AM",
              defaultEndTime: "06:30 PM",
            },
          });
        }
        return setting;
      } catch (err) {
        console.warn("Prisma calendar setting fallback:", err.message);
      }
    }
    return (
      globalMemory.__ERP_CALENDAR_SETTING__ || {
        id: "default-org-calendar",
        weeklyOffDay: "SUNDAY",
        defaultStartTime: "09:15 AM",
        defaultEndTime: "06:30 PM",
      }
    );
  },

  async updateCalendarSetting(data) {
    if (await isPrismaAvailable()) {
      try {
        return await prisma.calendarSetting.upsert({
          where: { id: "default-org-calendar" },
          update: {
            weeklyOffDay: data.weeklyOffDay || "SUNDAY",
            defaultStartTime: data.defaultStartTime || "09:15 AM",
            defaultEndTime: data.defaultEndTime || "06:30 PM",
          },
          create: {
            id: "default-org-calendar",
            weeklyOffDay: data.weeklyOffDay || "SUNDAY",
            defaultStartTime: data.defaultStartTime || "09:15 AM",
            defaultEndTime: data.defaultEndTime || "06:30 PM",
          },
        });
      } catch (err) {
        console.warn("Prisma calendar update fallback:", err.message);
      }
    }
    globalMemory.__ERP_CALENDAR_SETTING__ = {
      ...(globalMemory.__ERP_CALENDAR_SETTING__ || {}),
      ...data,
    };
    return globalMemory.__ERP_CALENDAR_SETTING__;
  },

  // DEPARTMENT METHODS
  async getDepartments() {
    if (await isPrismaAvailable()) {
      try {
        let depts = await prisma.department.findMany({
          orderBy: { createdAt: "asc" },
        });

        // Ensure default departments and Admin Department exist in DB
        if (depts.length === 0) {
          for (const d of defaultDepartments) {
            await prisma.department.create({
              data: {
                name: d.name,
                code: d.code,
                description: d.description,
                headName: d.headName,
              },
            }).catch(() => {});
          }
          depts = await prisma.department.findMany({
            orderBy: { createdAt: "asc" },
          });
        } else if (!depts.some((d) => d.code === "ADM" || d.name === "Admin Department" || d.name === "Administration")) {
          await prisma.department.create({
            data: {
              name: "Admin Department",
              code: "ADM",
              description: "Executive administration, management, and system governance.",
              headName: "Dhiraj Gaikwad",
            },
          }).catch(() => {});
          depts = await prisma.department.findMany({
            orderBy: { createdAt: "asc" },
          });
        }
        return depts;
      } catch (err) {
        console.warn("Prisma fallback for departments:", err.message);
      }
    }
    return globalMemory.__ERP_DEPARTMENTS__;
  },

  async getDepartmentById(id) {
    if (await isPrismaAvailable()) {
      try {
        return await prisma.department.findUnique({
          where: { id },
        });
      } catch (err) {
        console.warn("Prisma fallback:", err.message);
      }
    }
    return globalMemory.__ERP_DEPARTMENTS__.find((d) => d.id === id) || null;
  },

  async createDepartment(data) {
    const newDept = {
      id: "dept-" + Date.now(),
      name: data.name,
      code: (data.code || data.name.substring(0, 4)).toUpperCase().trim(),
      description: data.description || "",
      headName: data.headName || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (await isPrismaAvailable()) {
      try {
        const created = await prisma.department.create({
          data: {
            name: newDept.name,
            code: newDept.code,
            description: newDept.description,
            headName: newDept.headName,
          },
        });
        return created;
      } catch (err) {
        console.warn("Prisma create department fallback:", err.message);
      }
    }

    globalMemory.__ERP_DEPARTMENTS__.push(newDept);
    return newDept;
  },

  async updateDepartment(id, data) {
    if (await isPrismaAvailable()) {
      try {
        return await prisma.department.update({
          where: { id },
          data: {
            name: data.name,
            code: data.code ? data.code.toUpperCase().trim() : undefined,
            description: data.description,
            headName: data.headName,
          },
        });
      } catch (err) {
        console.warn("Prisma update department fallback:", err.message);
      }
    }

    const index = globalMemory.__ERP_DEPARTMENTS__.findIndex((d) => d.id === id);
    if (index === -1) return null;
    globalMemory.__ERP_DEPARTMENTS__[index] = {
      ...globalMemory.__ERP_DEPARTMENTS__[index],
      ...data,
      code: data.code ? data.code.toUpperCase().trim() : globalMemory.__ERP_DEPARTMENTS__[index].code,
      updatedAt: new Date().toISOString(),
    };
    return globalMemory.__ERP_DEPARTMENTS__[index];
  },

  async deleteDepartment(id) {
    if (await isPrismaAvailable()) {
      try {
        await prisma.department.delete({ where: { id } });
        return true;
      } catch (err) {
        console.warn("Prisma delete department fallback:", err.message);
      }
    }

    const index = globalMemory.__ERP_DEPARTMENTS__.findIndex((d) => d.id === id);
    if (index === -1) return false;
    globalMemory.__ERP_DEPARTMENTS__.splice(index, 1);
    return true;
  },

  // COMPENSATORY OFF (COMP OFF) METHODS
  async getCompOffRequests(userId = null) {
    const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;
    const now = new Date();

    if (await isPrismaAvailable()) {
      try {
        const where = userId ? { userId } : {};
        const items = await prisma.compOffRequest.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                department: true,
                designation: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { date: "desc" },
        });

        return items.map((claim) => {
          const claimDate = new Date(claim.date);
          const validUntil = new Date(claimDate.getTime() + SIXTY_DAYS_MS);
          const isExpired = claim.status === "APPROVED" && now > validUntil;
          const daysRemaining = Math.max(0, Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

          return {
            ...claim,
            date: claim.date.toISOString(),
            validUntil: validUntil.toISOString(),
            isExpired,
            daysRemaining,
            validityDays: 60,
          };
        });
      } catch (err) {
        console.warn("Prisma compOff get fallback:", err.message);
      }
    }

    let items = globalMemory.__ERP_COMP_OFFS__ || [];
    if (userId) {
      items = items.filter((c) => c.userId === userId);
    }
    return items.map((c) => {
      const user = (globalMemory.__ERP_EMPLOYEES__ || []).find((e) => e.id === c.userId);
      const claimDate = new Date(c.date);
      const validUntil = new Date(claimDate.getTime() + SIXTY_DAYS_MS);
      const isExpired = c.status === "APPROVED" && now > validUntil;
      const daysRemaining = Math.max(0, Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      return {
        ...c,
        user,
        validUntil: validUntil.toISOString(),
        isExpired,
        daysRemaining,
        validityDays: 60,
      };
    });
  },

  async createCompOffRequest(data) {
    const newClaim = {
      id: "compoff-" + Date.now(),
      userId: data.userId,
      date: new Date(data.date).toISOString(),
      entryTime: data.entryTime || "09:30 AM",
      exitTime: data.exitTime || "06:30 PM",
      hoursWorked: parseFloat(data.hoursWorked) || 8.0,
      reason: data.reason || "Worked on official duties during weekend/holiday.",
      status: "PENDING",
      actionNotes: null,
      actionDate: null,
      actionBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (await isPrismaAvailable()) {
      try {
        const created = await prisma.compOffRequest.create({
          data: {
            userId: data.userId,
            date: new Date(data.date),
            entryTime: newClaim.entryTime,
            exitTime: newClaim.exitTime,
            hoursWorked: newClaim.hoursWorked,
            reason: newClaim.reason,
            status: "PENDING",
          },
          include: {
            user: {
              select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                department: true,
                designation: true,
              },
            },
          },
        });
        return created;
      } catch (err) {
        console.warn("Prisma compOff create fallback:", err.message);
      }
    }

    globalMemory.__ERP_COMP_OFFS__.push(newClaim);
    const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === newClaim.userId);
    return { ...newClaim, user };
  },

  async updateCompOffStatus(id, { status, actionNotes, actionBy }) {
    if (await isPrismaAvailable()) {
      try {
        const existing = await prisma.compOffRequest.findUnique({ where: { id } });
        const previousStatus = existing ? existing.status : null;

        const updated = await prisma.compOffRequest.update({
          where: { id },
          data: {
            status,
            actionNotes: actionNotes || null,
            actionBy: actionBy || "Administrator",
            actionDate: new Date(),
          },
          include: {
            user: true,
          },
        });

        // Recalculate Comp-Off balance with 60-day validity window
        await this.calculateCompOffBalanceForUser(updated.userId, 2026);

        return updated;
      } catch (err) {
        console.warn("Prisma compOff update fallback:", err.message);
      }
    }

    const index = globalMemory.__ERP_COMP_OFFS__.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const previousStatus = globalMemory.__ERP_COMP_OFFS__[index].status;
    globalMemory.__ERP_COMP_OFFS__[index] = {
      ...globalMemory.__ERP_COMP_OFFS__[index],
      status,
      actionNotes: actionNotes || null,
      actionBy: actionBy || "Administrator",
      actionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const claim = globalMemory.__ERP_COMP_OFFS__[index];

    // If newly APPROVED, credit +1 to in-memory balance
    if (status === "APPROVED" && previousStatus !== "APPROVED") {
      const balIndex = globalMemory.__ERP_BALANCES__.findIndex(
        (b) => b.userId === claim.userId && b.year === 2026 && (b.leaveType === "Compensatory Off" || b.leaveType === "Comp Off")
      );
      if (balIndex !== -1) {
        const bal = globalMemory.__ERP_BALANCES__[balIndex];
        globalMemory.__ERP_BALANCES__[balIndex] = {
          ...bal,
          allocatedDays: bal.allocatedDays + 1,
          remainingDays: bal.remainingDays + 1,
          updatedAt: new Date().toISOString(),
        };
      } else {
        globalMemory.__ERP_BALANCES__.push({
          id: `bal-${claim.userId}-CO-${Date.now()}`,
          userId: claim.userId,
          year: 2026,
          leaveType: "Compensatory Off",
          allocatedDays: 1,
          usedDays: 0,
          remainingDays: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // If previously APPROVED and now REJECTED, decrement 1 day
    if (previousStatus === "APPROVED" && status === "REJECTED") {
      const balIndex = globalMemory.__ERP_BALANCES__.findIndex(
        (b) => b.userId === claim.userId && b.year === 2026 && (b.leaveType === "Compensatory Off" || b.leaveType === "Comp Off")
      );
      if (balIndex !== -1) {
        const bal = globalMemory.__ERP_BALANCES__[balIndex];
        globalMemory.__ERP_BALANCES__[balIndex] = {
          ...bal,
          allocatedDays: Math.max(0, bal.allocatedDays - 1),
          remainingDays: Math.max(0, bal.remainingDays - 1),
          updatedAt: new Date().toISOString(),
        };
      }
    }

    const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === claim.userId);
    return { ...claim, user };
  },
};
