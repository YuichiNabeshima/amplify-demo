import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const getRandomMockImage = () => {
  const mockImages = Array.from({ length: 6 }, (_, i) => `/img/common/mock_${String(i + 1).padStart(2, '0')}.jpg`);
  return mockImages[Math.floor(Math.random() * mockImages.length)];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const search = searchParams.get("search") || "";
    const specialty = searchParams.get("specialty") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.PartnerWhereInput = search
      ? {
          OR: [
            { companyName: { contains: search } },
            { address: { contains: search } },
          ],
        }
      : {};

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        select: {
          id: true,
          companyName: true,
          address: true,
          businessPhone: true,
          email: true,
          images: true,
        },
        skip,
        take: limit,
      }),
      prisma.partner.count({ where }),
    ]);

    return NextResponse.json({
      partners: partners.map((partner) => ({
        id: partner.id,
        name: partner.companyName,
        location: partner.address,
        rating: 4.5, // 仮の評価
        reviewCount: 10, // 仮のレビュー数
        image: partner.images || getRandomMockImage(),
        specialties: ["Interior", "Exterior"], // 仮の専門分野
        price: "$500 - $1500", // 仮の価格帯
      })),
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
} 