import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// GET - List bookings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const bookingCode = searchParams.get("bookingCode");

    let query = supabase
      .from("Booking")
      .select(
        `
        *,
        motor:Motor(*),
        user:User(id, email, name)
      `
      )
      .order("createdAt", { ascending: false });

    if (userId) query = query.eq("userId", parseInt(userId));
    if (status) query = query.eq("status", status);
    if (bookingCode) query = query.eq("bookingCode", bookingCode);

    const { data: bookings, error } = await query;

    if (error) throw error;

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST - Create new booking with Midtrans payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { motorId, startDate, endDate, userId, notes } = body;

    // Validate required fields
    if (!motorId || !startDate || !endDate || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get motor details
    const { data: motor, error: motorError } = await supabase.from("Motor").select("*").eq("id", motorId).single();

    if (motorError || !motor) {
      return NextResponse.json({ error: "Motor not found" }, { status: 404 });
    }

    if (motor.status !== "Available") {
      return NextResponse.json({ error: "Motor is not available" }, { status: 400 });
    }

    // Get user details
    const { data: user, error: userError } = await supabase.from("User").select("*").eq("id", userId).single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total days and price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDays < 1) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
    }

    const totalPrice = parseFloat(motor.pricePerDay.toString()) * totalDays;

    // Generate booking code
    const bookingCode = `SJ-${Date.now()}-${motorId}`;

    // Create booking in database
    const now = new Date().toISOString();
    const { data: booking, error: bookingError } = await supabase
      .from("Booking")
      .insert({
        bookingCode,
        userId,
        motorId,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        totalDays,
        totalPrice,
        status: "Pending",
        paymentStatus: "Unpaid",
        notes: notes || null,
        createdAt: now,
        updatedAt: now,
      })
      .select(
        `
        *,
        motor:Motor(*),
        user:User(id, email, name)
      `
      )
      .single();

    if (bookingError || !booking) {
      console.error("Booking creation error:", bookingError);
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }

    // Create Midtrans transaction
    const midtransResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: bookingCode,
          gross_amount: totalPrice,
        },
        customer_details: {
          first_name: user.name || user.email.split("@")[0],
          email: user.email,
        },
        item_details: [
          {
            id: motor.id.toString(),
            price: parseFloat(motor.pricePerDay.toString()),
            quantity: totalDays,
            name: `${motor.brand} ${motor.model} - ${totalDays} days`,
          },
        ],
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "https://www.")}/confirmation?booking=${bookingCode}`,
        },
      }),
    });

    if (!midtransResponse.ok) {
      const errorData = await midtransResponse.json();
      console.error("Midtrans error:", errorData);

      // Delete booking if Midtrans fails
      await supabase.from("Booking").delete().eq("id", booking.id);

      return NextResponse.json({ error: "Failed to create payment", details: errorData }, { status: 500 });
    }

    const midtransData = await midtransResponse.json();

    // Update booking with payment URL and transaction ID
    const { data: updatedBooking, error: updateError } = await supabase
      .from("Booking")
      .update({
        transactionId: midtransData.token,
        paymentUrl: midtransData.redirect_url,
      })
      .eq("id", booking.id)
      .select(
        `
        *,
        motor:Motor(*),
        user:User(id, email, name)
      `
      )
      .single();

    if (updateError) {
      console.error("Update booking error:", updateError);
    }

    return NextResponse.json(
      {
        booking: updatedBooking || booking,
        payment: {
          token: midtransData.token,
          redirect_url: midtransData.redirect_url,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking", details: error.message }, { status: 500 });
  }
}
