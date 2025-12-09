import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Initialize Supabase with service role key for admin operations
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

/**
 * POST /api/payment/callback
 * Midtrans Payment Notification Handler (Webhook)
 *
 * This endpoint receives payment notifications from Midtrans
 * and updates the booking and payment status in the database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("=== MIDTRANS CALLBACK RECEIVED ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Payload:", JSON.stringify(body, null, 2));

    // Extract notification data from Midtrans
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type, transaction_time, transaction_id } = body;

    // Validate required fields
    if (!order_id || !status_code || !gross_amount || !signature_key) {
      console.error("Missing required fields in notification");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // === STEP 1: Verify Signature ===
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const expectedHash = crypto.createHash("sha512").update(`${order_id}${status_code}${gross_amount}${serverKey}`).digest("hex");

    console.log("Signature Verification:");
    console.log("- Expected:", expectedHash);
    console.log("- Received:", signature_key);
    console.log("- Match:", expectedHash === signature_key);

    if (expectedHash !== signature_key) {
      console.error("❌ INVALID SIGNATURE - Possible security threat!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Signature verified successfully");

    // === STEP 2: Find Booking ===
    console.log(`Searching for booking with code: ${order_id}`);

    const { data: booking, error: fetchError } = await supabase.from("Booking").select("*, Motor(*), User(*)").eq("bookingCode", order_id).single();

    if (fetchError || !booking) {
      console.error("❌ Booking not found:", order_id);
      console.error("Error:", fetchError);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    console.log("✅ Booking found:");
    console.log("- Booking ID:", booking.id);
    console.log("- Current Status:", booking.status);
    console.log("- Current Payment Status:", booking.paymentStatus);
    console.log("- Motor ID:", booking.motorId);
    console.log("- User ID:", booking.userId);

    // === STEP 3: Determine Status Updates ===
    let bookingStatus = booking.status;
    let paymentStatus = booking.paymentStatus;
    let motorStatus = booking.Motor.status;
    let paidAt = booking.paidAt;

    console.log(`Processing transaction status: ${transaction_status}`);

    switch (transaction_status) {
      case "capture":
      case "settlement":
        // Payment successful
        if (fraud_status === "accept" || !fraud_status) {
          console.log("✅ Payment SUCCESSFUL");
          paymentStatus = "Paid";
          bookingStatus = "Confirmed";
          motorStatus = "Rented";
          paidAt = new Date(transaction_time).toISOString();
        } else {
          console.log("⚠️ Payment captured but fraud status is:", fraud_status);
        }
        break;

      case "pending":
        // Payment pending
        console.log("⏳ Payment PENDING");
        paymentStatus = "Unpaid";
        bookingStatus = "Pending";
        break;

      case "deny":
      case "cancel":
      case "expire":
        // Payment failed/cancelled
        console.log("❌ Payment FAILED/CANCELLED/EXPIRED");
        paymentStatus = "Unpaid";
        bookingStatus = "Cancelled";
        motorStatus = "Available";
        break;

      case "refund":
        // Payment refunded
        console.log("💰 Payment REFUNDED");
        paymentStatus = "Refunded";
        bookingStatus = "Cancelled";
        motorStatus = "Available";
        break;

      default:
        console.log("⚠️ Unknown transaction status:", transaction_status);
    }

    // === STEP 4: Update Booking ===
    console.log("Updating booking with:");
    console.log("- Payment Status:", paymentStatus);
    console.log("- Booking Status:", bookingStatus);
    console.log("- Payment Method:", payment_type);
    console.log("- Transaction ID:", transaction_id);
    console.log("- Paid At:", paidAt);

    const { error: updateBookingError } = await supabase
      .from("Booking")
      .update({
        paymentStatus,
        status: bookingStatus,
        paymentMethod: payment_type,
        transactionId: transaction_id,
        paidAt,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", booking.id);

    if (updateBookingError) {
      console.error("❌ Failed to update booking:", updateBookingError);
      return NextResponse.json({ error: "Failed to update booking", details: updateBookingError.message }, { status: 500 });
    }

    console.log("✅ Booking updated successfully");

    // === STEP 5: Update Motor Status (if needed) ===
    if (motorStatus !== booking.Motor.status) {
      console.log(`Updating motor status from ${booking.Motor.status} to ${motorStatus}`);

      const { error: updateMotorError } = await supabase
        .from("Motor")
        .update({
          status: motorStatus,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", booking.motorId);

      if (updateMotorError) {
        console.error("❌ Failed to update motor status:", updateMotorError);
        // Continue even if motor update fails
      } else {
        console.log("✅ Motor status updated successfully");
      }
    }

    // === STEP 6: Send Success Response ===
    console.log("=== CALLBACK PROCESSED SUCCESSFULLY ===");

    return NextResponse.json(
      {
        success: true,
        message: "Payment notification processed successfully",
        data: {
          bookingCode: order_id,
          paymentStatus,
          bookingStatus,
          transactionId: transaction_id,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("=== CALLBACK ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/callback
 * Test endpoint to verify the callback URL is accessible
 */
export async function GET() {
  return NextResponse.json(
    {
      message: "Midtrans Payment Callback Endpoint",
      status: "active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
