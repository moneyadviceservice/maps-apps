import { NextRequest } from 'next/server';

import { setCSPScriptException } from '@maps-react/csp-policy/lib/utils/cspHelper';
import {
  CSP_HEADERS,
  setCSPHeaders,
} from '@maps-react/csp-policy/lib/utils/setCSPHeaders';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = setCSPScriptException({
    urlExceptions: {
      'script-src': `'nonce-${nonce}'`,
    },
  });

  return setCSPHeaders(request, CSP_HEADERS.REQUEST_ONLY, cspHeader, nonce);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - prevent requests with query parameter `isEmbedded=true` to invoke middleware and apply CSP
     */
    {
      source:
        '/((?!api|_next/static|_next/image|icons|footer|plain-language-commission.jpg|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'query', key: 'isEmbedded', value: 'true' },
      ],
    },
  ],
};
