import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function proxy(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes for vendors
  if (pathname.startsWith('/vendor')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'vendor') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protected routes for customers
  if (pathname.startsWith('/customer')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'customer') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendor/:path*', '/customer/:path*']
};
