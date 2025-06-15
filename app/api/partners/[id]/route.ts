import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const partner = await prisma.partner.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        companyName: true,
        address: true,
        businessPhone: true,
        email: true,
        images: true,
      },
    });

    if (!partner) {
      return NextResponse.json(
        { error: "Partner not found" },
        { status: 404 }
      );
    }

    // 仮のデータ（後で実際のデータに置き換え）
    const mockData = {
      rating: 4.9,
      reviewCount: 127,
      description: "Professional painting services with over 15 years of experience. We specialize in both residential and commercial projects, delivering exceptional quality in just one day.",
      specialties: ["Interior Painting", "Exterior Painting", "Commercial Projects", "Color Consultation"],
      servicePlans: [
        { id: "basic", name: "Basic Paint Job", price: "$299", description: "Single room, standard paint" },
        { id: "premium", name: "Premium Service", price: "$499", description: "Multiple rooms, premium paint, prep work" },
        { id: "deluxe", name: "Deluxe Package", price: "$799", description: "Full house, premium materials, detailed prep" },
      ],
    };

    return NextResponse.json({
      ...partner,
      ...mockData,
    });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner details" },
      { status: 500 }
    );
  }
} 