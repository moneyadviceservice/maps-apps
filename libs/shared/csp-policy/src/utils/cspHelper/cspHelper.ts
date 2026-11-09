import { defaultCspHeader } from '../../data';

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
  | 'report-uri'
  | 'custom-directive';

export type CSPOptions = Record<CSPDirectives, string>;

export const setCSPScriptException = ({
  nonce,
  urlExceptions,
}: {
  nonce?: string;
  urlExceptions?: Partial<CSPOptions>;
}): string => {
  const cspStrictDynamicEnabled =
    process.env.CSP_STRICT_DYNAMIC_ENABLED === 'true'; // allows gtm to be trusted to load child scripts safely

  if (cspStrictDynamicEnabled && !nonce) {
    console.warn('strict-dynamic requires a nonce');
  }

  const cspHeader = { ...defaultCspHeader };

  // merge and remove duplicates
  if (urlExceptions && Object.keys(urlExceptions).length > 0) {
    Object.entries(urlExceptions).forEach(([key, value]) => {
      if (value.length === 0) return;
      if (cspHeader[key as keyof typeof cspHeader]) {
        const existing = cspHeader[key as keyof typeof cspHeader].split(' ');
        const additions = value.split(' ');
        const merged = Array.from(new Set([...existing, ...additions]));
        cspHeader[key as keyof typeof cspHeader] = merged.join(' ');
      } else {
        cspHeader[key as keyof typeof cspHeader] = value;
      }
    });
  }

  cspHeader['script-src'] = cspStrictDynamicEnabled
    ? "'self' 'strict-dynamic' 'unsafe-eval'"
    : cspHeader['script-src'] || '';

  if (nonce) {
    cspHeader['script-src'] = `${cspHeader['script-src']} 'nonce-${nonce}'`;
  }

  return Object.entries(cspHeader)
    .map(([key, value]) => {
      return `${key} ${value}`;
    })
    .join('; ')
    .replace(/\s+/g, ' ');
};
