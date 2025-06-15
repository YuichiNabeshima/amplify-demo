import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      type: 'customer' | 'partner';
    };

    let user;
    if (decoded.type === 'customer') {
      user = await prisma.customer.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      user = await prisma.partner.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          companyName: true,
          businessPhone: true,
          address: true,
          images: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 