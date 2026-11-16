import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Defense in depth: never touch API / Netlify function requests.
  // OAuth claims callback is `/api/post-pensions-data-retrieval?ticket=…`.
  // If proxy runs on that path (matcher quirks under Next 16) and strips
  // `ticket`, MHPD returns non-202 and every e2e scenario fails setup.
  if (pathname.startsWith('/api/') || pathname.startsWith('/.netlify')) {
    return NextResponse.next();
  }

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

  const hasBeaconId = request.cookies.has('beaconId');
  const isTakingPartPath = /^\/(en|cy)\/taking-part(\/.*)?$/.test(pathname);

  // Redirect existing users from the taking-part route to the home page
  if (isTakingPartPath && hasBeaconId) {
    const language = pathname.split('/')[1] || 'en';

    return NextResponse.redirect(new URL(`/${language}`, request.url));
  }

  // Skip authentication for static files and pages that must be reachable
  // without a secure beta session (including the public privacy notice).
  if (
    /\.(png|jpe?g|webp|svg|gif|ico|txt|pdf|js|css|json|map)$/i.test(pathname) ||
    /^\/(en|cy)\/dashboard-privacy-notice$/.test(pathname) ||
    isTakingPartPath
  ) {
    return NextResponse.next();
  }

  if (!hasBeaconId) {
    console.warn('No beaconId found, redirecting to research page');
    return NextResponse.redirect(
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-dashboard/research-panel',
    );
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
}

export const config = {
  // Keep in sync with the early `/api/` + `/.netlify` guard above.
  // Plain string required: Next statically parses matcher and rejects String.raw / tagged templates.
  matcher: ['/((?!_next|api|\\.netlify).*)'],
};
