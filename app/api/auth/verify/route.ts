import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from '@/lib/jwt';

export async function GET() {
  try {
    console.log("Verifying authentication...");
    const token = cookies().get('token')?.value;
    console.log("Token present:", !!token);

    if (!token) {
      console.log("No token found");
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    const payload = await verify(token);
    console.log("Verification payload:", payload);
    
    if (!payload) {
      console.log("Invalid payload");
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    console.log("Authentication successful");
    return NextResponse.json({
      isAuthenticated: true,
      userType: payload.userType,
      email: payload.email
    });
  } catch (error) {
    console.error('Auth verification failed:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
  }
} 