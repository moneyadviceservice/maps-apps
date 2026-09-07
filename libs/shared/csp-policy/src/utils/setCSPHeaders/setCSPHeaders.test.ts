/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

import { CSP_HEADERS, setCSPHeaders } from '.';

describe('Set CSP Headers function', () => {
  it('should set CSP in request and response', () => {
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(request, CSP_HEADERS.CSP, 'The csp headers');
    expect(response.headers.get(CSP_HEADERS.CSP)).toBe('The csp headers');
  });

  it('should set nonce to the CSP', () => {
    const request = new NextRequest('http://localhost:3000');
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
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.REQUEST_ONLY,
      `script-src: 'self'`,
      `'nonce-12345'`,
      'test-api-endpoint',
    );

    expect(response.headers.get('Reporting-Endpoints')).toBe(
      `csp-endpoint=test-api-endpoint`,
    );
  });

  it('should handle CSP report-only headers', () => {
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.CSP_REPORT_ONLY,
      'script-src test-policy',
      'test-nonce-123',
      'test-csp-report',
    );

    expect(response.headers.get(CSP_HEADERS.CSP_REPORT_ONLY)).toBe(
      'script-src test-policy',
    );
    expect(response.headers.get('x-middleware-request-x-nonce')).toBe(
      'test-nonce-123',
    );
    expect(response.headers.get('Reporting-Endpoints')).toBe(
      'csp-endpoint=test-csp-report',
    );
  });

  it('should not set nonce header when nonce is not provided', () => {
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.CSP,
      `script-src: 'self'`,
    );

    expect(response.headers.get('x-middleware-request-x-nonce')).toBeNull();
  });

  it('should not set reporting endpoints when reportUri is not provided', () => {
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.CSP,
      `script-src: 'self'`,
      `'nonce-12345'`,
    );

    expect(response.headers.get('Reporting-Endpoints')).toBeNull();
  });

  it('should handle empty CSP policy string', () => {
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(request, CSP_HEADERS.CSP, '');

    expect(response.headers.get(CSP_HEADERS.CSP)).toBe('');
  });

  it('should set multiple headers correctly when all parameters provided', () => {
    const request = new NextRequest('http://localhost:3000');
    const response = setCSPHeaders(
      request,
      CSP_HEADERS.CSP_REPORT_ONLY,
      `script-src 'self'; style-src 'unsafe-inline'`,
      `'nonce-67890'`,
      'test-csp-endpoint',
    );

    expect(response.headers.get(CSP_HEADERS.CSP_REPORT_ONLY)).toBe(
      `script-src 'self'; style-src 'unsafe-inline'`,
    );
    expect(response.headers.get('x-middleware-request-x-nonce')).toBe(
      `'nonce-67890'`,
    );
    expect(response.headers.get('Reporting-Endpoints')).toBe(
      `csp-endpoint=test-csp-endpoint`,
    );
  });
});
