import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/customer', request.url));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-type', decoded.type);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/customer', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/bookings/:path*',
    '/profile/:path*',
  ],
}; 