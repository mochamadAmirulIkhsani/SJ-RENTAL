import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function updateMotorStatus() {
  console.log("🔧 Updating Motor Status to 'Available'...\n");

  // Get all motors that are not Available
  const { data: motors, error: fetchError } = await supabase.from("Motor").select("*").neq("status", "Available");

  if (fetchError) {
    console.error("❌ Error fetching motors:", fetchError);
    return;
  }

  if (!motors || motors.length === 0) {
    console.log("✅ All motors are already 'Available'!");
    return;
  }

  console.log(`📋 Found ${motors.length} motor(s) with non-Available status:\n`);

  for (const motor of motors) {
    console.log(`  - ${motor.brand} ${motor.model} (${motor.plateNumber}): ${motor.status}`);
  }

  console.log("\n🔄 Updating all motors to 'Available'...\n");

  // Update all motors to Available
  const { data: updated, error: updateError } = await supabase.from("Motor").update({ status: "Available" }).neq("status", "Available").select();

  if (updateError) {
    console.error("❌ Error updating motors:", updateError);
    return;
  }

  console.log(`✅ Successfully updated ${updated?.length || 0} motor(s) to 'Available'!\n`);

  // Verify
  const { data: allAvailable, error: verifyError } = await supabase.from("Motor").select("id, name, brand, model, status").eq("status", "Available");

  if (verifyError) {
    console.error("❌ Error verifying:", verifyError);
    return;
  }

  console.log("📊 Current Available Motors:");
  console.log("============================");
  allAvailable?.forEach((motor) => {
    console.log(`  ✓ ${motor.brand} ${motor.model} - ${motor.name}`);
  });

  console.log(`\n🎉 Total Available Motors: ${allAvailable?.length || 0}`);
}

updateMotorStatus()
  .then(() => {
    console.log("\n✅ Update complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
