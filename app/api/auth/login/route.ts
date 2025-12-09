import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
    }

    const supabase = await createClient();

    // Login dengan Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    // Get user metadata from database
    const { data: userData, error: userError } = await supabase.from("User").select("id, email, name, role").eq("email", email).single();

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: userData || { email: data.user?.email, role: "CUSTOMER" },
        session: data.session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
