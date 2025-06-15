import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Protected paths that require authentication
  const protectedPaths = ['/dashboard', '/partner/dashboard', '/partner/settings'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Authentication page paths
  const authPaths = ['/auth', '/auth/partner'];
  const isAuthPath = authPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath) {
    if (!token) {
      // Redirect to auth page if no token is present
      const redirectUrl = request.nextUrl.pathname.startsWith('/partner')
        ? '/auth/partner'
        : '/auth/customer';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    try {
      const payload = await verify(token);
      if (!payload || !payload.isAuthenticated) {
        throw new Error('Invalid token');
      }

      // Restrict access to partner routes to partner users only
      if (request.nextUrl.pathname.startsWith('/partner') && payload.userType !== 'partner') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Restrict access to customer dashboard to customer users only
      if (request.nextUrl.pathname.startsWith('/dashboard') && payload.userType !== 'customer') {
        return NextResponse.redirect(new URL('/partner/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Redirect to auth page if token is invalid
      const redirectUrl = request.nextUrl.pathname.startsWith('/partner')
        ? '/auth/partner'
        : '/auth/customer';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  if (isAuthPath && token) {
    try {
      const payload = await verify(token);
      if (payload && payload.isAuthenticated) {
        // Redirect to appropriate dashboard if authenticated
        const redirectUrl = payload.userType === 'partner' ? '/partner/dashboard' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } catch (error) {
      // Continue to auth page if token is invalid
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith("/partner")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/partner", request.url))
    }

    try {
      const payload = await verify(token)
      if (!payload || payload.type !== "partner") {
        return NextResponse.redirect(new URL("/auth/partner", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/partner", request.url))
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/partner/:path*', '/auth/:path*'],
}; 