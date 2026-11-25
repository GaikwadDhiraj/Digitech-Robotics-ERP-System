import { prisma } from "./prisma";

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
];

// Fixed Holidays for the year 2026
const fixedHolidays = [
  { id: "h-1", name: "New Year's Day", date: "2026-01-01", type: "NATIONAL" },
  { id: "h-2", name: "Republic Day", date: "2026-01-26", type: "NATIONAL" },
  { id: "h-3", name: "Holi", date: "2026-03-04", type: "FESTIVAL" },
  { id: "h-4", name: "Good Friday", date: "2026-04-03", type: "FESTIVAL" },
  { id: "h-5", name: "Labor Day / May Day", date: "2026-05-01", type: "NATIONAL" },
  { id: "h-6", name: "Independence Day", date: "2026-08-15", type: "NATIONAL" },
  { id: "h-7", name: "Gandhi Jayanti", date: "2026-10-02", type: "NATIONAL" },
  { id: "h-8", name: "Diwali", date: "2026-11-08", type: "FESTIVAL" },
  { id: "h-9", name: "Christmas Day", date: "2026-12-25", type: "FESTIVAL" },
];

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

  // LEAVE POLICIES & BALANCES
  async getLeavePolicies() {
    return globalMemory.__ERP_POLICIES__;
  },

  async addLeavePolicy(data) {
    const newPolicy = {
      id: "policy-" + Date.now(),
      name: data.name,
      code: data.code || data.name.substring(0, 2).toUpperCase(),
      defaultDaysPerYear: parseFloat(data.defaultDaysPerYear) || 10,
      description: data.description || "",
      color: data.color || "indigo",
    };
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
    const index = globalMemory.__ERP_POLICIES__.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const oldPolicy = globalMemory.__ERP_POLICIES__[index];
    const newDays = parseFloat(data.defaultDaysPerYear) || oldPolicy.defaultDaysPerYear;
    const newName = data.name || oldPolicy.name;

    globalMemory.__ERP_POLICIES__[index] = {
      ...oldPolicy,
      name: newName,
      code: data.code || oldPolicy.code,
      defaultDaysPerYear: newDays,
      description: data.description !== undefined ? data.description : oldPolicy.description,
      color: data.color || oldPolicy.color,
    };

    // Update corresponding employee leave balances
    globalMemory.__ERP_BALANCES__.forEach((bal) => {
      if (bal.leaveType === oldPolicy.name) {
        bal.leaveType = newName;
        bal.allocatedDays = newDays;
        bal.remainingDays = Math.max(0, newDays - bal.usedDays);
        bal.updatedAt = new Date().toISOString();
      }
    });

    // Also update any leave requests with the old name
    if (newName !== oldPolicy.name) {
      globalMemory.__ERP_LEAVES__.forEach((l) => {
        if (l.leaveType === oldPolicy.name) {
          l.leaveType = newName;
          l.updatedAt = new Date().toISOString();
        }
      });
    }

    return globalMemory.__ERP_POLICIES__[index];
  },

  async deleteLeavePolicy(id) {
    const policy = globalMemory.__ERP_POLICIES__.find((p) => p.id === id);
    if (!policy) return false;

    globalMemory.__ERP_POLICIES__ = globalMemory.__ERP_POLICIES__.filter((p) => p.id !== id);
    globalMemory.__ERP_BALANCES__ = globalMemory.__ERP_BALANCES__.filter((b) => b.leaveType !== policy.name);
    return true;
  },

  async getEmployeeBalances(userId, year = 2026) {
    let balances = globalMemory.__ERP_BALANCES__.filter(
      (b) => b.userId === userId && b.year === year
    );

    // If balances missing for any policy, create them automatically
    globalMemory.__ERP_POLICIES__.forEach((policy) => {
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

    return balances;
  },

  // LEAVE REQUESTS
  async getLeaves(filters = {}) {
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

    globalMemory.__ERP_LEAVES__.unshift(newLeave);

    const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === data.userId);
    return { ...newLeave, user };
  },

  async updateLeaveStatus(id, { status, actionNotes, actionBy }) {
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
  async getHolidays() {
    if (await isPrismaAvailable()) {
      try {
        const count = await prisma.holiday.count();
        if (count === 0) {
          // Seed fixed holidays
          for (const h of fixedHolidays) {
            await prisma.holiday.create({
              data: {
                name: h.name,
                date: new Date(h.date),
                type: h.type,
                isWorkingDay: false,
              },
            });
          }
        }
        const dbHolidays = await prisma.holiday.findMany({
          orderBy: { date: "asc" },
        });
        return dbHolidays.map((h) => ({
          ...h,
          date: h.date.toISOString().split("T")[0],
        }));
      } catch (err) {
        console.warn("Prisma holidays fallback:", err.message);
      }
    }
    return globalMemory.__ERP_HOLIDAYS__;
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
    if (await isPrismaAvailable()) {
      try {
        const where = userId ? { userId } : {};
        return await prisma.compOffRequest.findMany({
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
      } catch (err) {
        console.warn("Prisma compOff get fallback:", err.message);
      }
    }

    let items = globalMemory.__ERP_COMP_OFFS__;
    if (userId) {
      items = items.filter((c) => c.userId === userId);
    }
    return items.map((c) => {
      const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === c.userId);
      return { ...c, user };
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

        // If APPROVED, credit exactly +1 Comp Off leave day to the employee's LeaveBalance!
        if (status === "APPROVED") {
          await prisma.leaveBalance.upsert({
            where: {
              userId_year_leaveType: {
                userId: updated.userId,
                year: 2026,
                leaveType: "Compensatory Off",
              },
            },
            update: {
              allocatedDays: { increment: 1 },
              remainingDays: { increment: 1 },
            },
            create: {
              userId: updated.userId,
              year: 2026,
              leaveType: "Compensatory Off",
              allocatedDays: 1,
              usedDays: 0,
              remainingDays: 1,
            },
          });
        }

        return updated;
      } catch (err) {
        console.warn("Prisma compOff update fallback:", err.message);
      }
    }

    const index = globalMemory.__ERP_COMP_OFFS__.findIndex((c) => c.id === id);
    if (index === -1) return null;

    globalMemory.__ERP_COMP_OFFS__[index] = {
      ...globalMemory.__ERP_COMP_OFFS__[index],
      status,
      actionNotes: actionNotes || null,
      actionBy: actionBy || "Administrator",
      actionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const claim = globalMemory.__ERP_COMP_OFFS__[index];

    // If APPROVED, credit +1 to in-memory balance
    if (status === "APPROVED") {
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

    const user = globalMemory.__ERP_EMPLOYEES__.find((e) => e.id === claim.userId);
    return { ...claim, user };
  },
};
