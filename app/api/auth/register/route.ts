import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
    }

    // Use service role key to bypass RLS
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Check if user already exists in database
    const { data: existingUser } = await supabase.from("User").select("email").eq("email", email).single();

    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Register dengan Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || null,
        role: role || "CUSTOMER",
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // Simpan data user ke database custom table (without id field, let it auto-increment)
    const { data: userData, error: dbError } = await supabase
      .from("User")
      .insert({
        email,
        name: name || null,
        role: role || "CUSTOMER",
        password: "", // Password managed by Supabase Auth
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Rollback: delete auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: "Failed to create user record: " + dbError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Registrasi berhasil. Anda dapat login sekarang.",
        user: userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
