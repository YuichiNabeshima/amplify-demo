import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = await AuthService.verifyToken(token);
    let user;

    if (decoded.type === 'customer') {
      user = await prisma.customer.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
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
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ ...user, type: decoded.type });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
} 