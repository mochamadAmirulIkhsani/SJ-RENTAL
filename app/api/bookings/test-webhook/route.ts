import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Simulate Midtrans webhook for testing
export async function POST(request: NextRequest) {
  try {
    const { bookingCode, transactionStatus } = await request.json();

    if (!bookingCode || !transactionStatus) {
      return NextResponse.json({ error: "Missing bookingCode or transactionStatus" }, { status: 400 });
    }

    // Simulate Midtrans notification payload
    const grossAmount = "500000.00";
    const statusCode = transactionStatus === "settlement" ? "200" : "201";
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;

    // Generate signature
    const signatureKey = crypto.createHash("sha512").update(`${bookingCode}${statusCode}${grossAmount}${serverKey}`).digest("hex");

    const webhookPayload = {
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

    console.log("[TEST WEBHOOK] Sending simulated webhook:", webhookPayload);

    // Call actual webhook endpoint
    const webhookUrl = `${request.nextUrl.origin}/api/bookings/webhook`;
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    const result = await response.json();

    return NextResponse.json(
      {
        message: "Simulated webhook sent",
        webhookResponse: result,
        payload: webhookPayload,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[TEST WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Failed to simulate webhook", details: error.message }, { status: 500 });
  }
}
