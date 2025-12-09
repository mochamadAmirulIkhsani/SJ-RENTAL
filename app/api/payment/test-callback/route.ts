import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/payment/test-callback
 * Test endpoint untuk simulate Midtrans callback
 *
 * Gunakan endpoint ini untuk testing callback di localhost
 * karena Midtrans tidak bisa mengirim webhook ke localhost
 */
export async function POST(request: NextRequest) {
  try {
    const { bookingCode, transactionStatus = "settlement" } = await request.json();

    if (!bookingCode) {
      return NextResponse.json({ error: "bookingCode is required" }, { status: 400 });
    }

    console.log("\n=== SIMULATING MIDTRANS CALLBACK ===");
    console.log("Booking Code:", bookingCode);
    console.log("Transaction Status:", transactionStatus);

    // Simulate Midtrans notification payload
    const grossAmount = "150000.00";
    const statusCode = "200";
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;

    // Generate signature like Midtrans does
    const signatureKey = crypto.createHash("sha512").update(`${bookingCode}${statusCode}${grossAmount}${serverKey}`).digest("hex");

    const payload = {
      order_id: bookingCode,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: "accept",
      payment_type: "bank_transfer",
      transaction_time: new Date().toISOString(),
      transaction_id: `TEST-${Date.now()}`,
    };

    console.log("Generated Payload:", JSON.stringify(payload, null, 2));

    // Call the actual callback endpoint
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/callback`;

    console.log("Sending to:", callbackUrl);

    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("Response Status:", response.status);
    console.log("Response Body:", result);
    console.log("=== SIMULATION COMPLETE ===\n");

    return NextResponse.json(
      {
        success: true,
        message: "Test callback sent successfully",
        payload,
        response: {
          status: response.status,
          data: result,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Test callback error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test callback",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/test-callback
 * Get available transaction statuses for testing
 */
export async function GET() {
  return NextResponse.json({
    message: "Midtrans Callback Test Endpoint",
    usage: {
      method: "POST",
      endpoint: "/api/payment/test-callback",
      body: {
        bookingCode: "string (required) - The booking code to test",
        transactionStatus: "string (optional) - Default: settlement",
      },
      example: {
        bookingCode: "BOOK-20231209-ABC123",
        transactionStatus: "settlement",
      },
    },
    availableStatuses: [
      {
        status: "settlement",
        description: "Payment successful (Paid)",
        result: "paymentStatus: Paid, bookingStatus: Confirmed, motorStatus: Rented",
      },
      {
        status: "capture",
        description: "Payment captured (Credit Card)",
        result: "paymentStatus: Paid, bookingStatus: Confirmed, motorStatus: Rented",
      },
      {
        status: "pending",
        description: "Payment pending",
        result: "paymentStatus: Unpaid, bookingStatus: Pending",
      },
      {
        status: "deny",
        description: "Payment denied",
        result: "paymentStatus: Unpaid, bookingStatus: Cancelled, motorStatus: Available",
      },
      {
        status: "cancel",
        description: "Payment cancelled by user",
        result: "paymentStatus: Unpaid, bookingStatus: Cancelled, motorStatus: Available",
      },
      {
        status: "expire",
        description: "Payment expired",
        result: "paymentStatus: Unpaid, bookingStatus: Cancelled, motorStatus: Available",
      },
      {
        status: "refund",
        description: "Payment refunded",
        result: "paymentStatus: Refunded, bookingStatus: Cancelled, motorStatus: Available",
      },
    ],
    testCommands: {
      curl: {
        settlement: `curl -X POST http://localhost:3000/api/payment/test-callback -H "Content-Type: application/json" -d '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"settlement"}'`,
        pending: `curl -X POST http://localhost:3000/api/payment/test-callback -H "Content-Type: application/json" -d '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"pending"}'`,
        cancel: `curl -X POST http://localhost:3000/api/payment/test-callback -H "Content-Type: application/json" -d '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"cancel"}'`,
      },
      powershell: {
        settlement: `Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"settlement"}'`,
        pending: `Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"pending"}'`,
        cancel: `Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/payment/test-callback" -ContentType "application/json" -Body '{"bookingCode":"BOOK-20231209-ABC123","transactionStatus":"cancel"}'`,
      },
    },
  });
}
