import { NextRequest, NextResponse } from 'next/server';

import { setCSPScriptException } from './utils/cspHelper';

/**
 * Higher-Order Component pattern for adding CSP headers to any NextResponse
 *
 * Environment Variables:
 * - CSP_CONSOLE_LOGGING_ENABLED: 'true' to enable CSP violation logging via Report-Only header
 *
 * CSP Behavior:
 * - CSP_CONSOLE_LOGGING_ENABLED=true: Report-Only CSP (logs violations to console, doesn't block)
 * - CSP_CONSOLE_LOGGING_ENABLED=false: No CSP headers (no logging or blocking)
 *
 * @param response - The NextResponse to enhance with CSP headers
 * @param request - The NextRequest to extract host and generate nonce from
 * @param options - Optional CSP configuration overrides
 * @returns The same response with CSP headers added
 *
 * @example
 * ```typescript
 * // Continue with environment-controlled CSP logging
 * return withCSP(NextResponse.next(), request);
 *
 * // Redirect with CSP
 * return withCSP(NextResponse.redirect(cleanedUrl), request);
 *
 * // Enable CSP violation reporting to Netlify function
 * return withCSP(NextResponse.next(), request, {
 *   'report-uri': '/.netlify/functions/saveCSPViolationsDetails'
 * });
 *
 * // Custom CSP options with form-action
 * return withCSP(NextResponse.next(), request, {
 *   'form-action': 'https://staging.example.com'
 * });
 * ```
 */
export const withCSP = (
  response: NextResponse,
  request: NextRequest,
  customOptions?: Record<string, string | undefined>,
): NextResponse => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const host = request.headers.get('host');
  const localHostStrings = host?.includes('localhost') ? `'unsafe-eval'` : '';
  const localhostOptions = {
    'script-src': localHostStrings,
    'style-src': localHostStrings,
  };

  // Determine if CSP violation logging should be enabled
  const cspLoggingEnabled = process.env.CSP_CONSOLE_LOGGING_ENABLED === 'true';

  const cspOptions = { ...localhostOptions, ...customOptions };

  // Filter out undefined values
  const filteredOptions = Object.entries(cspOptions).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const cspHeader = setCSPScriptException({
    nonce,
    urlExceptions: filteredOptions,
  });

  // Set appropriate CSP header based on environment
  if (cspLoggingEnabled) {
    response.headers.set('Content-Security-Policy-Report-Only', cspHeader);
  }
  // When CSP_CONSOLE_LOGGING_ENABLED=false, no CSP headers are set

  response.headers.set('X-Nonce', nonce);
  return response;
};
