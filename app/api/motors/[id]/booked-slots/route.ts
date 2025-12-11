import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Get all booked time slots for a specific motor
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const motorId = parseInt(id);

    if (isNaN(motorId)) {
      return NextResponse.json({ error: "Invalid motor ID" }, { status: 400 });
    }

    // Get all bookings for this motor that are active (not cancelled/completed)
    const { data: bookings, error } = await supabase.from("Booking").select("id, startDate, endDate, status").eq("motorId", motorId).in("status", ["Pending", "Paid", "Active"]).order("startDate", { ascending: true });

    if (error) {
      console.error("Error fetching booked slots:", error);
      return NextResponse.json({ error: "Failed to fetch booked slots" }, { status: 500 });
    }

    // Return the booked slots
    return NextResponse.json({
      motorId,
      bookedSlots: bookings || [],
    });
  } catch (error: any) {
    console.error("Error in booked-slots API:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
