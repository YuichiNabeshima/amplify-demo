import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { Customer, Partner } from '@prisma/client';

type User = Customer | Partner;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Try to find customer
    let user: User | null = await prisma.customer.findUnique({ where: { email } });
    let userType = 'customer';

    // If not found, try to find partner
    if (!user) {
      user = await prisma.partner.findUnique({ where: { email } });
      userType = 'partner';
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = sign(
      { id: user.id, email: user.email, type: userType },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Create response with user data
    const response = NextResponse.json({
      user: { ...user, password: undefined },
      token,
      userType,
      message: 'Sign in successful'
    });

    // Set token in cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
} 