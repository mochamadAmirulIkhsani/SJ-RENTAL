import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkMotors() {
  console.log("🔍 Checking Motors in Database...\n");

  // Get all motors
  const { data: allMotors, error: allError } = await supabase.from("Motor").select("*").order("id", { ascending: true });

  if (allError) {
    console.error("❌ Error fetching motors:", allError);
    return;
  }

  console.log(`📊 Total Motors in Database: ${allMotors?.length || 0}\n`);

  if (allMotors && allMotors.length > 0) {
    console.log("Motors Details:");
    console.log("================");
    allMotors.forEach((motor) => {
      console.log(`\nID: ${motor.id}`);
      console.log(`Name: ${motor.name}`);
      console.log(`Brand: ${motor.brand} ${motor.model}`);
      console.log(`Plate: ${motor.plateNumber}`);
      console.log(`Status: ${motor.status}`);
      console.log(`Price: Rp ${motor.pricePerDay}/day`);
      console.log("---");
    });

    // Count by status
    const statusCount = allMotors.reduce((acc: any, motor) => {
      acc[motor.status] = (acc[motor.status] || 0) + 1;
      return acc;
    }, {});

    console.log("\n📈 Status Summary:");
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    // Check Available motors specifically
    const availableMotors = allMotors.filter((m) => m.status === "Available");
    console.log(`\n✅ Available Motors: ${availableMotors.length}`);

    if (availableMotors.length === 0) {
      console.log("\n⚠️  WARNING: No motors with status 'Available' found!");
      console.log("💡 Solution: Update motor status to 'Available' in admin panel");
    }
  } else {
    console.log("⚠️  No motors found in database!");
    console.log("💡 Solution: Add motors through admin panel at /admin/motors");
  }
}

checkMotors()
  .then(() => {
    console.log("\n✅ Check complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
