import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Get dashboard statistics
export async function GET() {
  try {
    // Get total motors
    const { count: motorsCount, error: motorsError } = await supabase.from("Motor").select("*", { count: "exact", head: true });

    if (motorsError) {
      console.error("Error counting motors:", motorsError);
    }

    // Get total completed/active bookings (happy customers)
    const { count: bookingsCount, error: bookingsError } = await supabase.from("Booking").select("*", { count: "exact", head: true }).in("status", ["Completed", "Active", "Paid"]);

    if (bookingsError) {
      console.error("Error counting bookings:", bookingsError);
    }

    // Get available motors count
    const { count: availableCount, error: availableError } = await supabase.from("Motor").select("*", { count: "exact", head: true }).eq("status", "Available");

    if (availableError) {
      console.error("Error counting available motors:", availableError);
    }

    return NextResponse.json({
      stats: {
        totalMotors: motorsCount || 0,
        availableMotors: availableCount || 0,
        totalBookings: bookingsCount || 0,
        averageRating: 4.9, // Fixed rating for now, can be calculated from reviews later
      },
    });
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch statistics", details: error.message }, { status: 500 });
  }
}
