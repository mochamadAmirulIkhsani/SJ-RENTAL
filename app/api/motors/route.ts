import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    // Build filter query
    const where: any = {};

    if (status && status !== "all") {
      where.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    if (location && location !== "all") {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (type && type !== "all") {
      where.type = type.charAt(0).toUpperCase() + type.slice(1);
    }

    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }, { plateNumber: { contains: search, mode: "insensitive" } }, { brand: { contains: search, mode: "insensitive" } }];
    }

    // Get motors with filters
    const motors = await prisma.motor.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    // Get statistics
    const stats = await prisma.motor.groupBy({
      by: ["status"],
      _count: true,
    });

    const totalFleet = await prisma.motor.count();
    const available = stats.find((s) => s.status === "Available")?._count || 0;
    const rented = stats.find((s) => s.status === "Rented")?._count || 0;
    const maintenance = stats.find((s) => s.status === "Maintenance")?._count || 0;

    return NextResponse.json({
      motors,
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
    const existing = await prisma.motor.findUnique({
      where: { plateNumber },
    });

    if (existing) {
      return NextResponse.json({ error: "Plate number already exists" }, { status: 400 });
    }

    // Buat motor baru
    const motor = await prisma.motor.create({
      data: {
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
      },
    });

    return NextResponse.json({ message: "Motor created successfully", motor }, { status: 201 });
  } catch (error) {
    console.error("Create motor error:", error);
    return NextResponse.json({ error: "Failed to create motor" }, { status: 500 });
  }
}
