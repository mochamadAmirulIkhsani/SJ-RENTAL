import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const motor = await prisma.motor.findUnique({
      where: { id: parseInt(id) },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!motor) {
      return NextResponse.json({ error: "Motor not found" }, { status: 404 });
    }

    return NextResponse.json({ motor });
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

    const motor = await prisma.motor.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(location && { location }),
        ...(pricePerDay && { pricePerDay: parseFloat(pricePerDay) }),
        ...(description && { description }),
        ...(color && { color }),
      },
    });

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
    const activeBookings = await prisma.booking.count({
      where: {
        motorId: parseInt(id),
        status: { in: ["Pending", "Active"] },
      },
    });

    if (activeBookings > 0) {
      return NextResponse.json({ error: "Cannot delete motor with active bookings" }, { status: 400 });
    }

    await prisma.motor.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Motor deleted successfully" });
  } catch (error) {
    console.error("Delete motor error:", error);
    return NextResponse.json({ error: "Failed to delete motor" }, { status: 500 });
  }
}
