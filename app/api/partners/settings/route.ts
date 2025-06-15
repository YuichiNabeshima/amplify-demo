import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { verify } from "@/lib/jwt"

export async function GET() {
  try {
    const token = cookies().get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verify(token)
    if (!payload || payload.type !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const partner = await prisma.partner.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        companyName: true,
        businessPhone: true,
        address: true,
        email: true,
        images: true,
        specialties: true,
        servicePlans: true,
        description: true,
      },
    })

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error fetching partner settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch partner settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const token = cookies().get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verify(token)
    if (!payload || payload.type !== "partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      companyName,
      businessPhone,
      address,
      email,
      images,
      specialties,
      servicePlans,
      description,
    } = data

    const partner = await prisma.partner.update({
      where: { id: payload.id },
      data: {
        companyName,
        businessPhone,
        address,
        email,
        images,
        specialties,
        servicePlans,
        description,
      },
    })

    return NextResponse.json(partner)
  } catch (error) {
    console.error("Error updating partner settings:", error)
    return NextResponse.json(
      { error: "Failed to update partner settings" },
      { status: 500 }
    )
  }
} 