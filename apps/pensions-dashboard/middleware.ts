import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip authentication if Secure Beta Access feature is disabled
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    if (searchParams.has('ticket')) {
      const cleanedUrl = request.nextUrl.clone();
      cleanedUrl.searchParams.delete('ticket');
      cleanedUrl.searchParams.delete('state');
      return NextResponse.redirect(cleanedUrl);
    }
    return NextResponse.next();
  }

  // Skip authentication for specific file extensions and link-access-error paths
  if (
    /\.(png|jpe?g|webp|svg|gif|ico|txt|pdf|js|css|json|map)$/i.test(pathname) ||
    /^\/(en|cy)\/link-access-error$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('beaconId')?.value;
  const errorUrl = new URL('/en/link-access-error', request.url);

  if (!token) {
    console.error('No token found, redirecting to error page');
    return NextResponse.redirect(errorUrl);
  }

  // Validate the access token
  try {
    const response = await fetch(
      new URL('/.netlify/functions/validate-token', request.url),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      },
    );

    if (!response.ok) {
      return NextResponse.redirect(errorUrl);
    }

    // Clean up URL parameters and redirect if needed
    if (searchParams.has('linkId')) {
      const cleanedUrl = request.nextUrl.clone();
      cleanedUrl.searchParams.delete('linkId');
      return NextResponse.redirect(cleanedUrl);
    }

    if (searchParams.has('ticket')) {
      const cleanedUrl = request.nextUrl.clone();
      cleanedUrl.searchParams.delete('ticket');
      cleanedUrl.searchParams.delete('state');
      return NextResponse.redirect(cleanedUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Token validation failed', error);
    return NextResponse.redirect(errorUrl);
  }
}

export const config = {
  matcher: ['/((?!_next|api|\\.netlify).*)'],
};
