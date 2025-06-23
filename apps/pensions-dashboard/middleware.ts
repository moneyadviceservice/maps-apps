import { NextRequest, NextResponse } from 'next/server';

import { validateAccessToken } from './lib/fetch';

export async function middleware(request: NextRequest) {
  // Skip authentication if Secure Beta Access feature is disabled
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Skip authentication for specific file extensions and link-access-error paths
  if (
    /\.(png|jpe?g|webp|svg|gif|ico|txt|pdf|js|css|json|map)$/i.test(pathname) ||
    /^\/(en|cy)\/link-access-error$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const ERROR = '/en/link-access-error';

  // Check if the request has an access token cookie
  const token = request.cookies.get('beaconId')?.value;
  if (!token) {
    return NextResponse.redirect(new URL(ERROR, request.url));
  }

  // Validate the access token
  try {
    await validateAccessToken(token);
    const cleanedUrl = request.nextUrl.clone();
    cleanedUrl.searchParams.delete('token');

    // Remove the token from the URL to prevent it from being passed around
    if (cleanedUrl.toString() !== request.url.toString()) {
      return NextResponse.redirect(cleanedUrl);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(ERROR, request.url));
  }
}

// Match all paths except for Next.js internals and API routes
export const config = {
  matcher: ['/((?!_next|api).*)'],
};
