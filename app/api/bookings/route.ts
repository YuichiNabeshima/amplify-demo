import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const token = cookies().get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { id: string; type: string }

    if (decoded.type !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: decoded.id },
      include: {
        partner: {
          select: {
            companyName: true,
            address: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // 予約データを整形
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      companyName: booking.partner.companyName,
      servicePlan: booking.servicePlan,
      date: booking.date.toISOString(),
      status: booking.status,
      address: booking.partner.address,
      price: `$${booking.price}`,
      rating: booking.rating
    }))

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 