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

// Comprehensive initial mock employees with all profile details
const initialEmployees = [
  {
    id: "emp-1",
    employeeId: "EMP-001",
    name: "Alex Johnson",
    email: "alex.johnson@digitech.com",
    personalEmail: "alex.johnson.personal@gmail.com",
    phone: "+1 (555) 019-2834",
    department: "Engineering",
    designation: "Senior Full Stack Engineer",
    role: "EMPLOYEE",
    status: "ACTIVE",
    salary: 95000,
    joinDate: new Date("2023-03-15").toISOString(),
    dob: "1994-06-20",
    gender: "Male",
    maritalStatus: "Married",
    bloodGroup: "O+",
    aadharNumber: "4589 1234 9876",
    panNumber: "ABCDE1234F",
    residentialAddress: "Flat 402, Skyline Heights, Silicon Valley, CA 94016",
    communicationAddress: "Flat 402, Skyline Heights, Silicon Valley, CA 94016",
    bankAccountName: "Alex Johnson",
    bankAccountNumber: "987654321012",
    bankIfscCode: "HDFC0001234",
    bankName: "HDFC Bank",
    emergencyContact: "Maria Johnson (Spouse) - +1 (555) 019-2835",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Passionate software engineer building resilient enterprise systems with modern tech.",
    createdAt: new Date("2023-03-15").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "emp-2",
    employeeId: "EMP-002",
    name: "Sophia Martinez",
    email: "sophia.martinez@digitech.com",
    personalEmail: "sophia.martinez@gmail.com",
    phone: "+1 (555) 018-9921",
    department: "UI/UX Design",
    designation: "Lead Product Designer",
    role: "EMPLOYEE",
    status: "ACTIVE",
    salary: 82000,
    joinDate: new Date("2023-06-01").toISOString(),
    dob: "1996-09-14",
    gender: "Female",
    maritalStatus: "Single",
    bloodGroup: "B+",
    aadharNumber: "7845 6123 9081",
    panNumber: "FGHIJ5678K",
    residentialAddress: "128 Creative Ave, Design District, San Francisco, CA 94103",
    communicationAddress: "128 Creative Ave, Design District, San Francisco, CA 94103",
    bankAccountName: "Sophia Martinez",
    bankAccountNumber: "456789123456",
    bankIfscCode: "SBIN0004567",
    bankName: "State Bank",
    emergencyContact: "Carlos Martinez (Father) - +1 (555) 018-9920",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "Creating user-centric design systems and accessible digital experiences.",
    createdAt: new Date("2023-06-01").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "emp-3",
    employeeId: "EMP-003",
    name: "David Chen",
    email: "david.chen@digitech.com",
    personalEmail: "david.chen.tech@gmail.com",
    phone: "+1 (555) 014-4433",
    department: "Product Management",
    designation: "Technical Product Manager",
    role: "EMPLOYEE",
    status: "ACTIVE",
    salary: 110000,
    joinDate: new Date("2022-11-10").toISOString(),
    dob: "1991-12-05",
    gender: "Male",
    maritalStatus: "Married",
    bloodGroup: "A+",
    aadharNumber: "9123 4567 8901",
    panNumber: "KLMNO9012P",
    residentialAddress: "89 Silicon Way, San Jose, CA 95110",
    communicationAddress: "89 Silicon Way, San Jose, CA 95110",
    bankAccountName: "David Chen",
    bankAccountNumber: "123456789098",
    bankIfscCode: "ICIC0002345",
    bankName: "ICICI Bank",
    emergencyContact: "Lily Chen (Spouse) - +1 (555) 014-4432",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Connecting engineering and user needs into scalable enterprise products.",
    createdAt: new Date("2022-11-10").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
  {
    id: "admin-1",
    employeeId: "ADM-001",
    name: "Admin User",
    email: "admin@digitech.com",
    personalEmail: "admin.super@digitech.com",
    phone: "+1 (555) 010-0001",
    department: "Operations & HR",
    designation: "Head of Operations & Human Resources",
    role: "ADMIN",
    status: "ACTIVE",
    salary: 145000,
    joinDate: new Date("2021-01-01").toISOString(),
    dob: "1988-03-25",
    gender: "Male",
    maritalStatus: "Married",
    bloodGroup: "O+",
    aadharNumber: "1122 3344 5566",
    panNumber: "PQRST3456U",
    residentialAddress: "100 Executive Boulevard, Suite 500, Headquarters",
    communicationAddress: "100 Executive Boulevard, Suite 500, Headquarters",
    bankAccountName: "Admin User",
    bankAccountNumber: "778899001122",
    bankIfscCode: "HDFC0000001",
    bankName: "HDFC Bank",
    emergencyContact: "HR Dept Desk (+1 555-010-0000)",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "System administrator with organizational oversight and employee management authority.",
    createdAt: new Date("2021-01-01").toISOString(),
    updatedAt: new Date("2024-01-10").toISOString(),
  },
];

// Helper to seed annual leave balances for an employee
function generateInitialBalancesForUser(userId) {
  return defaultLeavePolicies.map((policy) => {
    let used = 0;
    if (userId === "emp-1" && policy.name === "Annual Leave") used = 5;
    if (userId === "emp-1" && policy.name === "Sick Leave") used = 2;
    if (userId === "emp-2" && policy.name === "Casual Leave") used = 2;
    return {
      id: `bal-${userId}-${policy.code}`,
      userId,
      year: 2026,
      leaveType: policy.name,
      allocatedDays: policy.defaultDaysPerYear,
      usedDays: used,
      remainingDays: Math.max(0, policy.defaultDaysPerYear - used),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

// Initial leaves with absence incharge, contact address, half-day flag
const initialLeaves = [
  {
    id: "leave-101",
    userId: "emp-1",
    leaveType: "Annual Leave",
    startDate: "2026-12-20",
    endDate: "2026-12-24",
    isHalfDay: false,
    halfDayType: null,
    daysCount: 5,
    reason: "Year-end family vacation and holiday travel.",
    inchargePerson: "Sophia Martinez (EMP-002)",
    contactDuringLeave: "Lake Tahoe Cabin, NV. Available on cell: +1 555-019-2834",
    documentUrl: null,
    documentName: null,
    status: "APPROVED",
    actionNotes: "Approved. Have a great vacation, Alex!",
    actionDate: "2026-11-10T10:30:00.000Z",
    actionBy: "Admin User",
    createdAt: "2026-11-08T09:15:00.000Z",
    updatedAt: "2026-11-10T10:30:00.000Z",
  },
  {
    id: "leave-102",
    userId: "emp-1",
    leaveType: "Sick Leave",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
    isHalfDay: true,
    halfDayType: "SECOND_HALF",
    daysCount: 0.5,
    reason: "Medical dental appointment and rest in afternoon.",
    inchargePerson: "David Chen (EMP-003)",
    contactDuringLeave: "Home address. Emergency phone: +1 555-019-2835",
    documentUrl: "medical-receipt.pdf",
    documentName: "Dental_Prescription_Receipt.pdf",
    status: "PENDING",
    actionNotes: null,
    actionDate: null,
    actionBy: null,
    createdAt: "2026-11-15T08:20:00.000Z",
    updatedAt: "2026-11-15T08:20:00.000Z",
  },
  {
    id: "leave-103",
    userId: "emp-2",
    leaveType: "Casual Leave",
    startDate: "2026-11-25",
    endDate: "2026-11-26",
    isHalfDay: false,
    halfDayType: null,
    daysCount: 2,
    reason: "Attending design conference and creative sprint workshop.",
    inchargePerson: "Alex Johnson (EMP-001)",
    contactDuringLeave: "Westin Hotel, Downtown SF. Cell: +1 555-018-9921",
    documentUrl: "design-ticket.pdf",
    documentName: "DesignConf_Ticket.pdf",
    status: "PENDING",
    actionNotes: null,
    actionDate: null,
    actionBy: null,
    createdAt: "2026-11-14T11:00:00.000Z",
    updatedAt: "2026-11-14T11:00:00.000Z",
  },
  {
    id: "leave-104",
    userId: "emp-3",
    leaveType: "Casual Leave",
    startDate: "2026-11-18",
    endDate: "2026-11-18",
    isHalfDay: false,
    halfDayType: null,
    daysCount: 1,
    reason: "Personal urgent documentation errand at civic center.",
    inchargePerson: "Sophia Martinez (EMP-002)",
    contactDuringLeave: "San Jose residence. Reachable via Slack.",
    documentUrl: null,
    documentName: null,
    status: "REJECTED",
    actionNotes: "Critical sprint release scheduled on this day. Please reschedule if possible.",
    actionDate: "2026-11-12T14:00:00.000Z",
    actionBy: "Admin User",
    createdAt: "2026-11-11T16:00:00.000Z",
    updatedAt: "2026-11-12T14:00:00.000Z",
  },
];

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
    const newEmp = {
      id: "emp-" + Date.now(),
      employeeId: data.employeeId || `EMP-${String(globalMemory.__ERP_EMPLOYEES__.length + 1).padStart(3, "0")}`,
      name: data.name,
      email: data.email,
      personalEmail: data.personalEmail || "",
      phone: data.phone || "",
      department: data.department || "Engineering",
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
      emergencyContact: data.emergencyContact || "",
      avatarUrl: data.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
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

  async updateEmployee(id, data) {
    if (await isPrismaAvailable()) {
      try {
        return await prisma.user.update({
          where: { id },
          data: {
            ...data,
            salary: data.salary !== undefined ? parseFloat(data.salary) : undefined,
            joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
            dob: data.dob ? new Date(data.dob) : undefined,
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
      ...data,
      salary: data.salary !== undefined ? parseFloat(data.salary) : globalMemory.__ERP_EMPLOYEES__[index].salary,
      updatedAt: new Date().toISOString(),
    };
    return globalMemory.__ERP_EMPLOYEES__[index];
  },

  async toggleEmployeeStatus(id) {
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

  // HOLIDAYS
  async getHolidays() {
    return globalMemory.__ERP_HOLIDAYS__;
  },
};
