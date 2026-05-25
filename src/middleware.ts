import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const esRutaAuth = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/registro');

  if (!token && !esRutaAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && esRutaAuth) {
    return NextResponse.redirect(new URL('/ordenes', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};