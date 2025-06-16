import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    isAuthenticated: true,
    userType: 'customer',
    email: 'test@example.com'
  });
} 