import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple API protection middleware
export function middleware(request: NextRequest) {
  // Only protect API routes (excluding public ones if needed)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // For now, we'll rely on frontend authentication
    // In production, you might want to implement JWT token validation here
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
