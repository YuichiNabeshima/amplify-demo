import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, userType, companyName, businessPhone, address } = body;

    // Check if user already exists
    const existingCustomer = await prisma.customer.findUnique({ where: { email } });
    const existingPartner = await prisma.partner.findUnique({ where: { email } });

    if (existingCustomer || existingPartner) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);
    let user;
    console.log('user type: ', userType);

    if (userType === 'customer') {
      user = await prisma.customer.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: body.phone,
          address: body.address
        }
      });
    } else if (userType === 'partner') {
      user = await prisma.partner.create({
        data: {
          email,
          password: hashedPassword,
          companyName,
          businessPhone,
          address,
          images: '' // 初期値として空文字列を設定
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    const token = sign(
      { id: user.id, email: user.email, type: userType },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Set token in cookie
    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Sign up successful'
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    );
  }
} 