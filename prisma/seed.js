const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const defaultLeavePolicies = [
  {
    name: "Casual Leave",
    code: "CL",
    defaultDaysPerYear: 12,
    description: "Paid leave for personal matters, emergency errands, or short breaks.",
    color: "indigo",
  },
  {
    name: "Sick Leave",
    code: "SL",
    defaultDaysPerYear: 10,
    description: "Medical leave for illness, medical appointments, and recovery.",
    color: "rose",
  },
  {
    name: "Annual Leave",
    code: "AL",
    defaultDaysPerYear: 15,
    description: "Earned annual vacation leave for rest and rejuvenation.",
    color: "emerald",
  },
  {
    name: "Emergency Leave",
    code: "EL",
    defaultDaysPerYear: 5,
    description: "Immediate leave for unforeseen personal or family emergencies.",
    color: "amber",
  },
];

const fixedHolidays = [
  { name: "New Year's Day", date: new Date("2026-01-01"), type: "NATIONAL" },
  { name: "Republic Day", date: new Date("2026-01-26"), type: "NATIONAL" },
  { name: "Holi", date: new Date("2026-03-04"), type: "FESTIVAL" },
  { name: "Good Friday", date: new Date("2026-04-03"), type: "FESTIVAL" },
  { name: "Labor Day / May Day", date: new Date("2026-05-01"), type: "NATIONAL" },
  { name: "Independence Day", date: new Date("2026-08-15"), type: "NATIONAL" },
  { name: "Gandhi Jayanti", date: new Date("2026-10-02"), type: "NATIONAL" },
  { name: "Diwali", date: new Date("2026-11-08"), type: "FESTIVAL" },
  { name: "Christmas Day", date: new Date("2026-12-25"), type: "FESTIVAL" },
];

const initialEmployees = [
  {
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
    joinDate: new Date("2023-03-15"),
    dob: new Date("1994-06-20"),
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
  },
  {
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
    joinDate: new Date("2023-06-01"),
    dob: new Date("1996-09-14"),
    gender: "Female",
    maritalStatus: "Single",
    bloodGroup: "A+",
    aadharNumber: "6789 2345 0123",
    panNumber: "FGHIJ5678K",
    residentialAddress: "742 Evergreen Terrace, San Francisco, CA 94107",
    communicationAddress: "742 Evergreen Terrace, San Francisco, CA 94107",
    bankAccountName: "Sophia Martinez",
    bankAccountNumber: "554433221100",
    bankIfscCode: "ICIC0002345",
    bankName: "ICICI Bank",
    emergencyContact: "Carlos Martinez (Father) - +1 (555) 018-9922",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "UI/UX Lead crafting intuitive, high-impact industrial robotics interfaces.",
  },
  {
    employeeId: "EMP-003",
    name: "David Chen",
    email: "david.chen@digitech.com",
    personalEmail: "david.chen.dev@gmail.com",
    phone: "+1 (555) 017-4433",
    department: "Robotics Hardware",
    designation: "Firmware Architect",
    role: "EMPLOYEE",
    status: "ACTIVE",
    salary: 110000,
    joinDate: new Date("2022-09-10"),
    dob: new Date("1990-11-05"),
    gender: "Male",
    maritalStatus: "Married",
    bloodGroup: "B+",
    aadharNumber: "8912 3456 7890",
    panNumber: "KLMNO9012P",
    residentialAddress: "128 Innovation Way, San Jose, CA 95112",
    communicationAddress: "128 Innovation Way, San Jose, CA 95112",
    bankAccountName: "David Chen",
    bankAccountNumber: "112233445566",
    bankIfscCode: "SBIN0003456",
    bankName: "State Bank of India",
    emergencyContact: "Helen Chen (Spouse) - +1 (555) 017-4434",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Hardware firmware engineer specializing in robotic arm control and PLC integration.",
  }
];

async function seed() {
  console.log("🌱 Seeding Neon Database...");

  // 1. Seed Leave Policies
  for (const pol of defaultLeavePolicies) {
    await prisma.leaveTypePolicy.upsert({
      where: { code: pol.code },
      update: pol,
      create: pol,
    });
  }
  console.log("✓ Leave policies seeded");

  // 2. Seed Holidays
  for (const hol of fixedHolidays) {
    const existing = await prisma.holiday.findFirst({ where: { name: hol.name } });
    if (!existing) {
      await prisma.holiday.create({ data: hol });
    }
  }
  console.log("✓ Holidays seeded");

  // 3. Seed Employees & Balances
  for (const emp of initialEmployees) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: emp,
      create: emp,
    });

    for (const pol of defaultLeavePolicies) {
      await prisma.leaveBalance.upsert({
        where: {
          userId_year_leaveType: {
            userId: user.id,
            year: 2026,
            leaveType: pol.name,
          },
        },
        update: {
          allocatedDays: pol.defaultDaysPerYear,
          remainingDays: pol.defaultDaysPerYear,
        },
        create: {
          userId: user.id,
          year: 2026,
          leaveType: pol.name,
          allocatedDays: pol.defaultDaysPerYear,
          usedDays: 0,
          remainingDays: pol.defaultDaysPerYear,
        },
      });
    }
  }
  console.log("✓ Employees and Leave balances seeded");

  console.log("🎉 Seed finished successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
