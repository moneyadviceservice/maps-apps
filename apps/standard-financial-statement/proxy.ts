import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split('/');
  const isV3Route = segments.includes('v3');

  if (isV3Route) {
    const isV3Enabled = process.env.SFS_V3_ENABLED === 'true';

    if (!isV3Enabled) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
