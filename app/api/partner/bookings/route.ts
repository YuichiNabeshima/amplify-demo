import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get("token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Verify token and get partner ID
    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string; type: string }
    
    if (decoded.type !== "partner") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      )
    }

    // Fetch bookings for the partner
    const bookings = await prisma.booking.findMany({
      where: {
        partnerId: decoded.id,
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    // Transform the data to match the frontend format
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      customerName: booking.customer.name || "Anonymous",
      customerEmail: booking.customer.email,
      customerPhone: booking.customer.phone || "Not provided",
      servicePlan: booking.servicePlan,
      date: booking.date.toISOString().split("T")[0],
      time: booking.date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      status: booking.status,
      address: booking.notes || "Address not provided",
      price: `$${booking.price.toFixed(2)}`,
      notes: booking.notes,
    }))

    return NextResponse.json(formattedBookings)
  } catch (error: any) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
} 