import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Get user details
    const { data: user, error: userError } = await supabase.from("User").select("*").eq("id", parseInt(id)).single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get bookings for this user
    const { data: bookings } = await supabase
      .from("Booking")
      .select(
        `
        *,
        motor:Motor(id, name, plateNumber, brand, pricePerDay)
      `
      )
      .eq("userId", parseInt(id))
      .order("createdAt", { ascending: false });

    return NextResponse.json({
      user: {
        ...user,
        bookings: bookings || [],
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role.toUpperCase();

    const { data: user, error } = await supabase.from("User").update(updateData).eq("id", parseInt(id)).select().single();

    if (error) {
      console.error("Update user error:", error);
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if user has active bookings
    const { data: activeBookings } = await supabase.from("Booking").select("id").eq("userId", parseInt(id)).in("status", ["Pending", "Active"]);

    if (activeBookings && activeBookings.length > 0) {
      return NextResponse.json({ error: "Cannot delete user with active bookings" }, { status: 400 });
    }

    // Get user email to delete from auth
    const { data: user } = await supabase.from("User").select("email").eq("id", parseInt(id)).single();

    // Delete user from database
    const { error: dbError } = await supabase.from("User").delete().eq("id", parseInt(id));

    if (dbError) {
      console.error("Delete user error:", dbError);
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }

    // Try to delete from auth (if exists)
    if (user?.email) {
      try {
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const authUser = authUsers.users.find((u) => u.email === user.email);
        if (authUser) {
          await supabase.auth.admin.deleteUser(authUser.id);
        }
      } catch (authError) {
        console.error("Failed to delete auth user:", authError);
        // Continue even if auth deletion fails
      }
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
