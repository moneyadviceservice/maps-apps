import { NextRequest, NextResponse } from 'next/server';

export const endSession = (request: NextRequest): NextResponse => {
  const redirectResponse = NextResponse.redirect(
    new URL(`/`, request.url),
    302,
  );

  redirectResponse.cookies.delete('session');

  if (request.cookies.get('csrfToken')) {
    redirectResponse.cookies.delete('csrfToken');
  }

  return redirectResponse;
};
