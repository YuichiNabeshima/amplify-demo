import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  const token = request.cookies.get('token')?.value;
  console.log('Token present:', !!token);

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('Checking dashboard access');
    if (!token) {
      console.log('No token found, redirecting to auth page');
      return NextResponse.redirect(new URL('/auth/customer', request.url));
    }

    // トークンが存在する場合はアクセスを許可
    console.log('Access granted to dashboard');
    return NextResponse.next();
  }

  // 認証済みユーザーが認証ページにアクセスした場合の処理
  if (request.nextUrl.pathname.startsWith('/auth')) {
    console.log('Checking auth page access');
    if (token) {
      // トークンが存在する場合はダッシュボードにリダイレクト
      console.log('Token found, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}; 