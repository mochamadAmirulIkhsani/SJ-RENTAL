import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// PATCH - Update booking status
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;
    const bookingId = parseInt(id);

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Get current booking
    const { data: booking, error: fetchError } = await supabase.from("Booking").select("*, motor:Motor(*)").eq("id", bookingId).single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update booking status
    const { data: updatedBooking, error: updateError } = await supabase
      .from("Booking")
      .update({
        status: status,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", bookingId)
      .select("*")
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }

    // Update motor status based on booking status
    let motorStatus = booking.motor.status;

    if (status === "Confirmed" || status === "Active") {
      motorStatus = "Rented";
    } else if (status === "Cancelled" || status === "Completed") {
      motorStatus = "Available";
    }

    // Update motor status if changed
    if (motorStatus !== booking.motor.status) {
      await supabase.from("Motor").update({ status: motorStatus }).eq("id", booking.motorId);
    }

    return NextResponse.json(
      {
        booking: updatedBooking,
        message: "Booking updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking", details: error.message }, { status: 500 });
  }
}

// DELETE - Cancel/Delete booking
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const bookingId = parseInt(id);

    // Get booking details first
    const { data: booking, error: fetchError } = await supabase.from("Booking").select("*").eq("id", bookingId).single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update booking status to Cancelled instead of deleting
    const { error: updateError } = await supabase
      .from("Booking")
      .update({
        status: "Cancelled",
        updatedAt: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
    }

    // Set motor back to Available
    await supabase.from("Motor").update({ status: "Available" }).eq("id", booking.motorId);

    return NextResponse.json({ message: "Booking cancelled successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json({ error: "Failed to cancel booking", details: error.message }, { status: 500 });
  }
}
