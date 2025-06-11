import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { decrypt, encrypt, extractUserId } from 'lib/token';
import { refreshAccessToken } from 'lib/verifyCredentials';
import {
  COOKIE_OPTIONS,
  getExpireTimeDate,
} from 'utils/getCookieData/getCookieData';

/**
 * Middleware function to handle token validation and refresh logic.
 *
 * This middleware checks for the presence of `accessToken` and `refreshToken` cookies.
 * If both cookies are present, it validates the JWT tokens and checks their expiry times.
 * If the access token is close to expiring, it attempts to refresh the access token using the refresh token.
 * If the refresh is successful, it updates the cookies with the new tokens.
 * If the refresh fails, it deletes the cookies and redirects the user to the login page.
 */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const tokenCookie = request.cookies.get('accessToken');
  const refreshTokenCookie = request.cookies.get('refreshToken');

  try {
    if (tokenCookie && refreshTokenCookie) {
      // check cookie JWT is valid
      const tokenValid = await decrypt(tokenCookie.value);
      const refreshTokenValid = await decrypt(refreshTokenCookie.value);
      const currentTime = new Date();

      // compare date of expiry
      const tokenExpire = new Date(tokenValid?.payload?.expires as string);
      const expireConfig = tokenValid?.payload?.expireConfig as number;
      const remainingSessionTime = dateDiffInMinutes(currentTime, tokenExpire);
      const sessionRefreshTime = Number(process.env.ENTRA_EXPIRY_TIME) / 2;
      const refreshToken = refreshTokenValid.payload.refresh_token as string;

      if (remainingSessionTime < sessionRefreshTime) {
        const result = await refreshAccessToken(refreshToken);

        // if error, delete cookies and redirect to login
        if (result?.error) {
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          response.cookies.delete('userId');
          response.cookies.delete('csrfToken');

          return NextResponse.redirect('/', 302);
        }

        const expireTime = getExpireTimeDate(expireConfig);

        const newToken = await encrypt({
          token: result?.access_token,
          expires: expireTime,
        });

        const newRefreshToken = await encrypt({
          refresh_token: result?.refresh_token,
          expires: expireTime,
        });

        const userId = await extractUserId(result?.id_token);

        response.cookies.set('accessToken', newToken, {
          ...COOKIE_OPTIONS,
          expires: expireTime,
        });

        response.cookies.set('refreshToken', newRefreshToken, {
          ...COOKIE_OPTIONS,
          expires: expireTime,
        });

        if (userId) {
          response.cookies.set('userId', userId, {
            ...COOKIE_OPTIONS,
            expires: expireTime,
          });
        }
      }
    }
  } catch (error) {
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    response.cookies.delete('userId');
    response.cookies.delete('csrfToken');
    return response;
  }

  return response;
}

function dateDiffInMinutes(startDate: Date, endDate: Date): number {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const diffMs = endTime - startTime;
  const diffMinutes = Math.floor(diffMs / 60000);
  return diffMinutes;
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
