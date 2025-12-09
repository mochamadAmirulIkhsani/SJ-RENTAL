import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get motor details
    const { data: motor, error: motorError } = await supabase.from("Motor").select("*").eq("id", parseInt(id)).single();

    if (motorError || !motor) {
      return NextResponse.json({ error: "Motor not found" }, { status: 404 });
    }

    // Get bookings for this motor
    const { data: bookings } = await supabase
      .from("Booking")
      .select(
        `
        *,
        user:User(id, name, email)
      `
      )
      .eq("motorId", parseInt(id))
      .order("createdAt", { ascending: false })
      .limit(10);

    return NextResponse.json({ motor: { ...motor, bookings: bookings || [] } });
  } catch (error) {
    console.error("Get motor error:", error);
    return NextResponse.json({ error: "Failed to fetch motor" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, location, pricePerDay, description, color } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (location) updateData.location = location;
    if (pricePerDay) updateData.pricePerDay = parseFloat(pricePerDay);
    if (description) updateData.description = description;
    if (color) updateData.color = color;

    const { data: motor, error } = await supabase.from("Motor").update(updateData).eq("id", parseInt(id)).select().single();

    if (error) {
      console.error("Update motor error:", error);
      return NextResponse.json({ error: "Failed to update motor" }, { status: 500 });
    }

    return NextResponse.json({ message: "Motor updated successfully", motor });
  } catch (error) {
    console.error("Update motor error:", error);
    return NextResponse.json({ error: "Failed to update motor" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if motor has active bookings
    const { data: activeBookings } = await supabase.from("Booking").select("id").eq("motorId", parseInt(id)).in("status", ["Pending", "Active"]);

    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json({ error: "Cannot delete motor with active bookings" }, { status: 400 });
    }

    // Get motor to check if it has an image
    const { data: motor } = await supabase.from("Motor").select("image").eq("id", parseInt(id)).single();

    // Delete image from storage if exists
    if (motor?.image) {
      const BUCKET_NAME = "motor-images";
      const urlParts = motor.image.split(`/${BUCKET_NAME}/`);
      if (urlParts.length >= 2) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

        if (storageError) {
          console.error("Failed to delete image from storage:", storageError);
          // Continue with motor deletion even if image deletion fails
        }
      }
    }

    // Delete motor from database
    const { error } = await supabase.from("Motor").delete().eq("id", parseInt(id));

    if (error) {
      console.error("Delete motor error:", error);
      return NextResponse.json({ error: "Failed to delete motor" }, { status: 500 });
    }

    return NextResponse.json({ message: "Motor deleted successfully" });
  } catch (error) {
    console.error("Delete motor error:", error);
    return NextResponse.json({ error: "Failed to delete motor" }, { status: 500 });
  }
}
