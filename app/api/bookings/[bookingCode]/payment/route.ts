import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST - Generate payment token for existing booking
export async function POST(request: NextRequest, { params }: { params: Promise<{ bookingCode: string }> }) {
  try {
    const { bookingCode } = await params;

    console.log("Generating payment for booking:", bookingCode);

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from("Booking")
      .select(
        `
        *,
        motor:Motor(*),
        user:User(id, email, name)
      `
      )
      .eq("bookingCode", bookingCode)
      .single();

    if (bookingError || !booking) {
      console.error("Booking not found:", bookingError);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if booking can be paid
    if (booking.status !== "Pending") {
      return NextResponse.json({ error: "Booking is not pending" }, { status: 400 });
    }

    if (booking.paymentStatus === "Paid") {
      return NextResponse.json({ error: "Booking is already paid" }, { status: 400 });
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
          gross_amount: parseFloat(booking.totalPrice.toString()),
        },
        customer_details: {
          first_name: booking.user.name || booking.user.email.split("@")[0],
          email: booking.user.email,
        },
        item_details: [
          {
            id: booking.motor.id.toString(),
            price: parseFloat(booking.motor.pricePerDay.toString()),
            quantity: booking.totalDays,
            name: `${booking.motor.brand} ${booking.motor.model} - ${booking.totalDays} days`,
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
      return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
    }

    const paymentData = await midtransResponse.json();
    console.log("Payment token generated:", paymentData.token);

    // Update booking with payment info
    const { error: updateError } = await supabase
      .from("Booking")
      .update({
        transactionId: paymentData.token,
        paymentUrl: paymentData.redirect_url,
        updatedAt: new Date().toISOString(),
      })
      .eq("bookingCode", bookingCode);

    if (updateError) {
      console.error("Failed to update booking:", updateError);
    }

    return NextResponse.json({
      token: paymentData.token,
      redirectUrl: paymentData.redirect_url,
    });
  } catch (error) {
    console.error("Payment generation error:", error);
    return NextResponse.json({ error: "Failed to generate payment" }, { status: 500 });
  }
}
