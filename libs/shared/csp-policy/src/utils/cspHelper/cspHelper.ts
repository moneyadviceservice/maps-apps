import { defaultCspHeader } from '../../data/cspHeader';

/**
 * Generates a Content Security Policy (CSP) script exception string.
 * This function allows for the inclusion of a nonce, inline eval, and URL exceptions.
 *
 * @param {Object} options - Options for generating the CSP script exception.
 * @param {string} [options.nonce] - The nonce to be included in the CSP header for 'script-src'.
 * @param {boolean} [options.inlineEval=false] - Whether to allow inline eval in the CSP header 'script-src'.
 * @param {Record<CSPDirectives, string>} [options.urlExceptions] - Additional URL exceptions to be included in the CSP header.
 * @returns {string} The generated CSP default header with additional exceptions and nonce and 'unsafe-eval' for 'script-src'.
 */

type CSPDirectives =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'connect-src'
  | 'frame-src'
  | 'font-src'
  | 'object-src'
  | 'base-uri'
  | 'form-action'
  | 'frame-ancestors'
  | 'report-to'
  | 'report-uri';

export type CSPOptions = Record<CSPDirectives, string>;

export const setCSPScriptException = ({
  urlExceptions,
}: {
  urlExceptions?: Partial<CSPOptions>;
}): string => {
  const cspHeader = { ...defaultCspHeader };

  if (urlExceptions && Object.keys(urlExceptions).length > 0) {
    Object.entries(urlExceptions).forEach(([key, value]) => {
      if (value.length === 0) return;
      if (cspHeader[key as keyof typeof cspHeader]) {
        cspHeader[key as keyof typeof cspHeader] += ` ${value}`;
      } else {
        cspHeader[key as keyof typeof cspHeader] = value;
      }
    });
  }

  return Object.entries(cspHeader)
    .map(([key, value]) => {
      return `${key} ${value}`;
    })
    .join('; ')
    .replace(/\s+/g, ' ');
};
