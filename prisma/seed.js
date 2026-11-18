const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ADMIN_EMAIL = "dvgaikwad333@gmail.com";

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

async function seed() {
  console.log("🌱 Seeding Neon Database...");

  for (const pol of defaultLeavePolicies) {
    await prisma.leaveTypePolicy.upsert({
      where: { code: pol.code },
      update: pol,
      create: pol,
    });
  }
  console.log("✓ Leave policies seeded");

  for (const hol of fixedHolidays) {
    const existing = await prisma.holiday.findFirst({ where: { name: hol.name } });
    if (!existing) {
      await prisma.holiday.create({ data: hol });
    }
  }
  console.log("✓ Holidays seeded");

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "ADMIN",
    },
    create: {
      employeeId: "ADM-001",
      name: "Dhiraj Gaikwad",
      email: ADMIN_EMAIL,
      personalEmail: ADMIN_EMAIL,
      department: "Administration",
      designation: "Administrator / MD",
      role: "ADMIN",
      status: "ACTIVE",
      salary: 150000,
      joinDate: new Date("2023-01-01"),
      bio: "Digitech Robotics Administrator",
    },
  });

  for (const pol of defaultLeavePolicies) {
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
    });
  }

  console.log("✓ Admin seeded:", ADMIN_EMAIL);
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
