import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    // Build query
    let query = supabase.from("User").select("*");

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role && role !== "all") {
      query = query.eq("role", role.toUpperCase());
    }

    // Get users
    const { data: users, error: usersError } = await query.order("createdAt", { ascending: false });

    if (usersError) {
      console.error("Users query error:", usersError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Get booking counts for each customer
    const customerUsers = users?.filter((u) => u.role === "CUSTOMER") || [];
    const userBookings = await Promise.all(
      customerUsers.map(async (user) => {
        const { data: bookings } = await supabase.from("Booking").select("id, status").eq("userId", user.id);

        return {
          userId: user.id,
          totalBookings: bookings?.length || 0,
          activeBookings: bookings?.filter((b) => b.status === "Active").length || 0,
        };
      })
    );

    // Merge booking data with users
    const usersWithBookings = users?.map((user) => {
      const bookingData = userBookings.find((ub) => ub.userId === user.id);
      return {
        ...user,
        totalBookings: bookingData?.totalBookings || 0,
        activeBookings: bookingData?.activeBookings || 0,
      };
    });

    // Get statistics
    const totalCustomers = users?.filter((u) => u.role === "CUSTOMER").length || 0;
    const activeCustomers = usersWithBookings?.filter((u) => u.role === "CUSTOMER" && u.activeBookings > 0).length || 0;
    const totalAdmins = users?.filter((u) => u.role === "ADMIN").length || 0;

    return NextResponse.json({
      users: usersWithBookings || [],
      stats: {
        totalCustomers,
        activeCustomers,
        totalAdmins,
        totalUsers: users?.length || 0,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    // Validasi input
    if (!email || !name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required" }, { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("User").select("id").eq("email", email).single();

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Generate random password
    const randomPassword = Math.random().toString(36).slice(-8);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        name,
        role: role.toUpperCase(),
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user in database
    const { data: userData, error: dbError } = await supabase
      .from("User")
      .insert({
        email,
        name,
        role: role.toUpperCase(),
        password: "",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Rollback: delete auth user
      if (authData.user) {
        await supabase.auth.admin.deleteUser(authData.user.id);
      }
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userData,
        temporaryPassword: randomPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
