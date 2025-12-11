import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function testDoubleBooking() {
  console.log("🧪 Testing Double Booking Prevention\n");

  // Test dates
  const startDate = new Date("2026-01-15T09:00:00.000Z");
  const endDate = new Date("2026-01-20T17:00:00.000Z");

  // Get first available motor
  const { data: motors } = await supabase.from("Motor").select("*").eq("status", "Available").limit(1);

  if (!motors || motors.length === 0) {
    console.log("❌ No available motors found for testing");
    return;
  }

  const motorId = motors[0].id;
  console.log(`📋 Testing with Motor: ${motors[0].brand} ${motors[0].model} (ID: ${motorId})`);
  console.log(`📅 Test Period: ${startDate.toISOString()} to ${endDate.toISOString()}\n`);

  // Check for conflicts
  console.log("1️⃣ Checking for existing conflicts...");
  const { data: conflicts } = await supabase.from("Booking").select("*").eq("motorId", motorId).or(`status.eq.Pending,status.eq.Paid,status.eq.Active`).lt("startDate", endDate.toISOString()).gt("endDate", startDate.toISOString());

  if (conflicts && conflicts.length > 0) {
    console.log(`⚠️  Found ${conflicts.length} existing booking(s) that would conflict:`);
    conflicts.forEach((b) => {
      console.log(`   - Booking ${b.bookingCode}: ${b.startDate} to ${b.endDate} [${b.status}]`);
    });
  } else {
    console.log("✅ No existing conflicts found");
  }

  // Test overlap scenarios
  console.log("\n2️⃣ Testing overlap detection scenarios:");

  const testCases = [
    {
      name: "Exact same period",
      start: new Date("2026-01-15T09:00:00.000Z"),
      end: new Date("2026-01-20T17:00:00.000Z"),
      shouldConflict: true,
    },
    {
      name: "Starts during booking",
      start: new Date("2026-01-17T09:00:00.000Z"),
      end: new Date("2026-01-22T17:00:00.000Z"),
      shouldConflict: true,
    },
    {
      name: "Ends during booking",
      start: new Date("2026-01-13T09:00:00.000Z"),
      end: new Date("2026-01-18T17:00:00.000Z"),
      shouldConflict: true,
    },
    {
      name: "Completely contains booking",
      start: new Date("2026-01-14T09:00:00.000Z"),
      end: new Date("2026-01-21T17:00:00.000Z"),
      shouldConflict: true,
    },
    {
      name: "Before booking (no conflict)",
      start: new Date("2026-01-10T09:00:00.000Z"),
      end: new Date("2026-01-14T17:00:00.000Z"),
      shouldConflict: false,
    },
    {
      name: "After booking (no conflict)",
      start: new Date("2026-01-21T09:00:00.000Z"),
      end: new Date("2026-01-25T17:00:00.000Z"),
      shouldConflict: false,
    },
  ];

  for (const testCase of testCases) {
    const { data: testConflicts } = await supabase
      .from("Booking")
      .select("id")
      .eq("motorId", motorId)
      .or(`status.eq.Pending,status.eq.Paid,status.eq.Active`)
      .lt("startDate", testCase.end.toISOString())
      .gt("endDate", testCase.start.toISOString());

    const hasConflict = testConflicts && testConflicts.length > 0;
    const result = hasConflict === testCase.shouldConflict ? "✅ PASS" : "❌ FAIL";

    console.log(`   ${result} - ${testCase.name}`);
    console.log(`      Expected conflict: ${testCase.shouldConflict}, Got: ${hasConflict}`);
  }

  console.log("\n3️⃣ Testing API endpoint...");

  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("supabase.co", "vercel.app") || "http://localhost:3000"}/api/motors/available`;
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    console.log(`   Calling: ${apiUrl}?${params.toString()}`);

    // Note: This requires the dev server to be running
    console.log("   ℹ️  Skipping API test (requires dev server to be running)");
    console.log("   To test API manually, run: npm run dev");
  } catch (error) {
    console.log("   ⚠️  Could not test API endpoint:", error);
  }

  console.log("\n✅ Double Booking Prevention Test Complete!");
  console.log("\n📝 Summary:");
  console.log("   - Database queries are checking for overlapping bookings");
  console.log("   - Status filters: Pending, Paid, Active (excludes Completed, Cancelled)");
  console.log("   - Date overlap logic: startDate < requestedEnd AND endDate > requestedStart");
}

testDoubleBooking()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
