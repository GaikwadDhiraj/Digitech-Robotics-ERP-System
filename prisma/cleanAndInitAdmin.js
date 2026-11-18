const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ADMIN_EMAIL = "dvgaikwad333@gmail.com";

async function main() {
  console.log("🧹 Cleaning dummy data and setting up Admin...");

  // 1. Delete all existing leave requests
  await prisma.leaveRequest.deleteMany({});
  console.log("✓ Cleared all dummy leave requests");

  // 2. Delete all existing leave balances
  await prisma.leaveBalance.deleteMany({});
  console.log("✓ Cleared all dummy leave balances");

  // 3. Delete all users except (or including) and rebuild clean admin
  await prisma.user.deleteMany({});
  console.log("✓ Cleared all dummy employee records");

  // 4. Create the Admin user
  const adminUser = await prisma.user.create({
    data: {
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
  console.log("✓ Created Admin User:", adminUser.email, `(${adminUser.employeeId})`);

  // 5. Ensure default leave policies exist
  const policies = await prisma.leaveTypePolicy.findMany();
  for (const pol of policies) {
    await prisma.leaveBalance.create({
      data: {
        userId: adminUser.id,
        year: 2026,
        leaveType: pol.name,
        allocatedDays: pol.defaultDaysPerYear,
        usedDays: 0,
        remainingDays: pol.defaultDaysPerYear,
      },
    });
  }
  console.log("✓ Assigned 2026 leave policies to Admin");

  console.log("✨ Neon DB is now clean and initialized with Admin:", ADMIN_EMAIL);
}

main()
  .catch((e) => {
    console.error("Error cleaning data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
