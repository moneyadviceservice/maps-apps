import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { decrypt } from 'lib/token';
import { endSession } from 'utils/session/endSession';
import { hasRefreshTimeExpired } from 'utils/session/hasRefreshTimeExpired';
import { hasSessionExpired } from 'utils/session/hasSessionExpired';
import { refreshSession } from 'utils/session/refreshSession';

/**
 * Middleware function to handle session logic.
 *
 * This middleware checks for the presence of `session` cookie.
 * If it is missing, the request proceeds without modification.
 * If present, it decrypts the session and checks for expiration.
 * If the session has expired, it ends the session and redirects to home.
 * If the session is valid but the refresh time has expired, it refreshes the session.
 * Otherwise, it allows the request to proceed unchanged.
 */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie) return response;

  const userSession = await decrypt(sessionCookie.value);

  if (!userSession) {
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
