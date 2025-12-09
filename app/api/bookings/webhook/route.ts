import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// POST - Handle Midtrans payment notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[WEBHOOK] Received notification from Midtrans:", JSON.stringify(body, null, 2));

    // Verify signature hash
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type, transaction_time, transaction_id } = body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const hash = crypto.createHash("sha512").update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest("hex");

    console.log("[WEBHOOK] Hash verification - Expected:", hash, "Received:", signature_key);

    if (hash !== signature_key) {
      console.error("[WEBHOOK] Invalid signature!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Find booking
    const { data: booking, error: fetchError } = await supabase.from("Booking").select("*, motor:Motor(*)").eq("bookingCode", order_id).single();

    if (fetchError || !booking) {
      console.error("[WEBHOOK] Booking not found:", order_id, fetchError);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log("[WEBHOOK] Found booking:", booking.id, "Current status:", booking.paymentStatus);

    // Update booking based on transaction status
    let updateData: any = {
      paymentMethod: payment_type,
      transactionId: transaction_id,
      updatedAt: new Date().toISOString(),
    };

    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || !fraud_status) {
        updateData.paymentStatus = "Paid";
        updateData.status = "Confirmed";
        updateData.paidAt = new Date(transaction_time).toISOString();

        console.log("[WEBHOOK] Payment successful - updating motor to Rented");

        // Update motor status to Rented
        await supabase.from("Motor").update({ status: "Rented" }).eq("id", booking.motorId);
      }
    } else if (transaction_status === "pending") {
      updateData.paymentStatus = "Unpaid";
      updateData.status = "Pending";
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      updateData.paymentStatus = "Unpaid";
      updateData.status = "Cancelled";

      console.log("[WEBHOOK] Payment failed - setting motor back to Available");

      // Set motor back to Available
      await supabase.from("Motor").update({ status: "Available" }).eq("id", booking.motorId);
    } else if (transaction_status === "refund") {
      updateData.paymentStatus = "Refunded";
      updateData.status = "Cancelled";

      // Set motor back to Available
      await supabase.from("Motor").update({ status: "Available" }).eq("id", booking.motorId);
    }

    console.log("[WEBHOOK] Updating booking with:", updateData);

    // Update booking
    const { error: updateError } = await supabase.from("Booking").update(updateData).eq("id", booking.id);

    if (updateError) {
      console.error("[WEBHOOK] Failed to update booking:", updateError);
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    console.log("[WEBHOOK] Booking updated successfully!");

    return NextResponse.json({ message: "Notification processed" }, { status: 200 });
  } catch (error: any) {
    console.error("[WEBHOOK] Error processing payment notification:", error);
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}
