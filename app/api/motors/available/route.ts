import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - Get available motors for a specific date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    console.log("Available Motors API called");
    console.log("Start Date Param:", startDate);
    console.log("End Date Param:", endDate);

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log("Parsed Start:", start);
    console.log("Parsed End:", end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (end <= start) {
      console.error("Date validation failed:", { start, end });
      return NextResponse.json(
        {
          error: "End date and time must be after start date and time. Please select a later time or date.",
        },
        { status: 400 }
      );
    }

    // Get all motors with status Available
    const { data: allMotors, error: motorsError } = await supabase.from("Motor").select("*").eq("status", "Available").order("pricePerDay", { ascending: true });

    console.log("All Available Motors:", allMotors?.length || 0);

    if (motorsError) {
      console.error("Motors query error:", motorsError);
      return NextResponse.json({ error: "Failed to fetch motors" }, { status: 500 });
    }

    // Get all bookings that overlap with the requested period
    // A booking overlaps if:
    // - Booking starts before requested end AND
    // - Booking ends after requested start
    const { data: overlappingBookings, error: bookingsError } = await supabase
      .from("Booking")
      .select("motorId, startDate, endDate, status")
      .or(`status.eq.Pending,status.eq.Paid,status.eq.Active`)
      .lt("startDate", end.toISOString())
      .gt("endDate", start.toISOString());

    console.log("Overlapping Bookings:", overlappingBookings?.length || 0);

    if (bookingsError) {
      console.error("Bookings query error:", bookingsError);
      return NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
    }

    // Get motor IDs that are booked during the requested period
    const bookedMotorIds = new Set(overlappingBookings?.map((b) => b.motorId) || []);
    console.log("Booked Motor IDs:", Array.from(bookedMotorIds));

    // Filter out booked motors
    const availableMotors = allMotors?.filter((motor) => !bookedMotorIds.has(motor.id)) || [];
    console.log("Available Motors After Filter:", availableMotors.length);

    return NextResponse.json({
      motors: availableMotors,
      total: availableMotors.length,
      period: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Get available motors error:", error);
    return NextResponse.json({ error: "Failed to fetch available motors" }, { status: 500 });
  }
}
