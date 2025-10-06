import { NextRequest, NextResponse } from 'next/server';

export enum CSP_HEADERS {
  REQUEST_ONLY = 'Content-Security-Policy-Report-Only',
  CSP = 'Content-Security-Policy',
}

export const setCSPHeaders = (
  request: NextRequest,
  policy: CSP_HEADERS,
  csp: string,
  nonce?: string,
  cspEndpoint?: string,
) => {
  const requestHeaders = new Headers(request.headers);

  if (nonce) requestHeaders.set('x-nonce', nonce);

  requestHeaders.set(policy, csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (cspEndpoint)
    response.headers.set('Reporting-Endpoints', `csp-endpoint=${cspEndpoint}`);

  response.headers.set(policy, csp);

  return response;
};
