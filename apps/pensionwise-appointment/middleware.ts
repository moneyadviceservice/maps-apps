import { NextRequest, NextResponse } from 'next/server';

import { withCSP } from '@maps-react/csp-policy/withCSP';

export function middleware(request: NextRequest) {
  return withCSP(NextResponse.next(), request, {
    'form-action': 'https://staging-embedded-journeys.moneyhelper.org.uk/',
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|icons|footer|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
