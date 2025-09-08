/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { CSP_HEADERS, setCSPHeaders } from '.';

describe('Set CSP Headers function', () => {
  it('should set CSP in request and response', () => {
    const request = new NextRequest('https://localhost:4300');
    const response = setCSPHeaders(request, CSP_HEADERS.CSP, 'The csp headers');
    expect(response.headers.get(CSP_HEADERS.CSP)).toBe('The csp headers');
  });

  it('should set nonce to the CSP', () => {
    const request = new NextRequest('https://localhost:4300');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.REQUEST_ONLY,
      `script-src: 'self'`,
      `'nonce-12345'`,
    );

    expect(response.headers.get('x-middleware-request-x-nonce')).toBe(
      `'nonce-12345'`,
    );
  });

  it('should set api endpoint to the CSP request only policy', () => {
    const request = new NextRequest('https://localhost:4300');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.REQUEST_ONLY,
      `script-src: 'self'`,
      `'nonce-12345'`,
      'http://locahost/api/save',
    );

    expect(response.headers.get('Reporting-Endpoints')).toBe(
      `csp-endpoint=http://locahost/api/save`,
    );
  });
});
