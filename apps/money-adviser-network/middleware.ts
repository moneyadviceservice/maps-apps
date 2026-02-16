import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { decrypt } from 'lib/token';
import { checkSessionValidity } from 'utils/session/checkSessionValidity';
import { endSession } from 'utils/session/endSession';
import { hasRefreshTimeExpired } from 'utils/session/hasRefreshTimeExpired';
import { hasSessionExpired } from 'utils/session/hasSessionExpired';
import { refreshSession } from 'utils/session/refreshSession';

/**
 * SESSION GATEKEEPER MIDDLEWARE
 * * 1. Scope: Intercepts protected UI routes (EN/CY) and specific mutation APIs.
 * 2. Validation: Decrypts session cookies and verifies integrity/validity.
 * 3. Enforcement:
 * - Redirects 'loggingIn' states to /login.
 * - Terminates sessions (endSession) if invalid or expired.
 * 4. Maintenance: Automatically triggers 'refreshSession' if the soft-expiry
 * (refresh time) has passed, ensuring continuous uptime for active users.
 */

const PROTECTED_API_PREFIXES = [
  '/api/submit-flow',
  '/api/submit-answer',
  '/api/change-answer',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  const isProtectedPage =
    /^\/(en|cy)\/(start|online|telephone|in-person)(\/.*)?$/.test(path);
  const isProtectedApi = PROTECTED_API_PREFIXES.some((p) => path.startsWith(p));

  if (!isProtectedPage && !isProtectedApi) {
    return response;
  }

  const sessionCookie = request.cookies.get('session');
  if (!sessionCookie) return endSession(request);

  const userSession = await decrypt(sessionCookie.value);

  const isLoggingIn = userSession?.payload?.loggingIn as boolean;
  if (isLoggingIn) {
    return NextResponse.redirect(
      new URL(`/${path.includes('cy') ? 'cy' : 'en'}/login`, request.url),
    );
  }

  const isSessionValid = await checkSessionValidity(userSession);
  if (!userSession || !isSessionValid) {
    console.error('userSession is invalid:', userSession);
    return endSession(request);
  }

  const sessionExpired = await hasSessionExpired(userSession);
  if (sessionExpired) {
    return endSession(request);
  }

  const sessionRefreshTimeExpired = await hasRefreshTimeExpired(userSession);
  if (sessionRefreshTimeExpired) {
    try {
      return await refreshSession(response, userSession);
    } catch (error) {
      console.error('Error refreshing session in middleware:', error);
      return endSession(request);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public, footer, icons (generally not required for these)
     * - .well-known (chrome noise)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public|.well-known|icons|footer).*)',
  ],
};
