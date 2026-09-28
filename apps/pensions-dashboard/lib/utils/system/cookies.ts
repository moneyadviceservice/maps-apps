/**
 * Drop-in replacement for the cookies package that patches the request for proxy
 * environments (e.g. Netlify). Use this instead of 'cookies' so secure cookies work
 * when X-Forwarded-Proto is https.
 *
 * Fixes pen test issue #37357
 */
import OriginalCookies from 'cookies';
import type { IncomingMessage, ServerResponse } from 'node:http';

const Cookies = function (
  req: IncomingMessage,
  res: ServerResponse,
  options?: Parameters<typeof OriginalCookies>[2],
) {
  if (req.headers?.['x-forwarded-proto'] === 'https') {
    (req as { protocol?: string }).protocol = 'https';
  }
  return options === undefined
    ? new OriginalCookies(req, res)
    : new OriginalCookies(req, res, options);
} as typeof OriginalCookies;

export default Cookies;
export type CookiesInstance = InstanceType<typeof OriginalCookies>;
