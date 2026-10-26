import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const hiddenRoutesEnv = process.env.HIDDEN_ROUTES || '';
  const hasHiddenRoutes = !!hiddenRoutesEnv.trim();

  if (hasHiddenRoutes) {
    const hiddenRoutes = hiddenRoutesEnv
      ?.split(',')
      .map((route) => route.trim());

    const { pathname } = request.nextUrl;

    const isHidden = hiddenRoutes?.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (isHidden) {
      const url = request.nextUrl.clone();
      url.pathname = '/404';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
