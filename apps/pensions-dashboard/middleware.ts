import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/loading')) {
    const code = request.nextUrl.searchParams.get('code');

    if (code) {
      const response = NextResponse.next();
      // Temporary test cookie 'mhpdtest' for MHPD React app.
      // Used during during alpha development before test harness was fully available
      // to return test scenario data. Can be removed when no longer needed.
      response.cookies.set('mhpdtest', code.replace('testScenario', ''), {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      response.cookies.set('authorizationCode', code, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });
      return response;
    }
  }
  return NextResponse.next();
}
