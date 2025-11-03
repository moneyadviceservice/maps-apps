import { NextRequest, NextResponse } from 'next/server';

import { withCSP } from '@maps-react/csp-policy/withCSP';

import { validateAccessToken } from './lib/api/beta-access-control-service';

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const cspReportUri = '/.netlify/functions/saveCSPViolationsDetails';

  // Skip authentication if Secure Beta Access feature is disabled
  if (process.env.MHPD_SECURE_BETA_ENABLED !== 'true') {
    if (searchParams.has('ticket')) {
      const cleanedUrl = request.nextUrl.clone();
      cleanedUrl.searchParams.delete('ticket');
      cleanedUrl.searchParams.delete('state');
      return withCSP(NextResponse.redirect(cleanedUrl), request, {
        'report-uri': cspReportUri,
      });
    }
    return withCSP(NextResponse.next(), request, {
      'report-uri': cspReportUri,
    });
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
    await validateAccessToken(token);

    if (searchParams.has('linkId')) {
      const cleanedUrl = request.nextUrl.clone();
      cleanedUrl.searchParams.delete('linkId');
      return withCSP(NextResponse.redirect(cleanedUrl), request, {
        'report-uri': cspReportUri,
      });
    }

    if (searchParams.has('ticket')) {
      const cleanedUrl = request.nextUrl.clone();
      cleanedUrl.searchParams.delete('ticket');
      cleanedUrl.searchParams.delete('state');
      return withCSP(NextResponse.redirect(cleanedUrl), request, {
        'report-uri': cspReportUri,
      });
    }

    return withCSP(NextResponse.next(), request, {
      'report-uri': cspReportUri,
    });
  } catch (error) {
    console.error('Token validation failed', error);
    return NextResponse.redirect(errorUrl);
  }
}

export const config = {
  matcher: ['/((?!_next|api).*)'],
};
