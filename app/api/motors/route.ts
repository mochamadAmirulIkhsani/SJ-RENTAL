import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    // Build query
    let query = supabase.from("Motor").select("*");

    // Apply filters
    if (status && status !== "all") {
      const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);
      query = query.eq("status", statusCapitalized);
    }

    if (location && location !== "all") {
      query = query.ilike("location", `%${location}%`);
    }

    if (type && type !== "all") {
      const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
      query = query.eq("type", typeCapitalized);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,plateNumber.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    // Get motors with filters
    const { data: motors, error: motorsError } = await query.order("createdAt", { ascending: false });

    if (motorsError) {
      console.error("Motors query error:", motorsError);
      return NextResponse.json({ error: "Failed to fetch motors" }, { status: 500 });
    }

    // Get statistics
    const { data: allMotors, error: statsError } = await supabase.from("Motor").select("status");

    if (statsError) {
      console.error("Stats query error:", statsError);
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    const totalFleet = allMotors?.length || 0;
    const available = allMotors?.filter((m) => m.status === "Available").length || 0;
    const rented = allMotors?.filter((m) => m.status === "Rented").length || 0;
    const maintenance = allMotors?.filter((m) => m.status === "Maintenance").length || 0;

    return NextResponse.json({
      motors: motors || [],
      stats: {
        totalFleet,
        available,
        rented,
        maintenance,
      },
    });
  } catch (error) {
    console.error("Get motors error:", error);
    return NextResponse.json({ error: "Failed to fetch motors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, plateNumber, type, cc, brand, model, year, color, pricePerDay, location, description, image } = body;

    // Validasi input
    if (!name || !plateNumber || !type || !cc || !brand || !model || !year || !pricePerDay) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Cek apakah plate number sudah ada
    const { data: existing } = await supabase.from("Motor").select("id").eq("plateNumber", plateNumber).single();

    if (existing) {
      return NextResponse.json({ error: "Plate number already exists" }, { status: 400 });
    }

    // Buat motor baru
    const { data: motor, error } = await supabase
      .from("Motor")
      .insert({
        name,
        plateNumber,
        type,
        cc,
        brand,
        model,
        year: parseInt(year),
        color,
        pricePerDay: parseFloat(pricePerDay),
        location: location || "Central Office",
        description,
        image,
        status: "Available",
      })
      .select()
      .single();

    if (error) {
      console.error("Create motor error:", error);
      return NextResponse.json({ error: "Failed to create motor" }, { status: 500 });
    }

    return NextResponse.json({ message: "Motor created successfully", motor }, { status: 201 });
  } catch (error) {
    console.error("Create motor error:", error);
    return NextResponse.json({ error: "Failed to create motor" }, { status: 500 });
  }
}
