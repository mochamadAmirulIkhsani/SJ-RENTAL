import { prisma } from "./lib/prisma";

async function testConnection() {
  try {
    console.log("Testing database connection...");

    // Test query
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log("✅ Database connected successfully!");
    console.log("Current time from database:", result);

    // Check if tables exist
    const users = await prisma.user.findMany({ take: 1 });
    console.log("✅ User table accessible");

    const motors = await prisma.motor.findMany({ take: 1 });
    console.log("✅ Motor table accessible");

    const bookings = await prisma.booking.findMany({ take: 1 });
    console.log("✅ Booking table accessible");

    console.log("\n🎉 All tables are ready!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
