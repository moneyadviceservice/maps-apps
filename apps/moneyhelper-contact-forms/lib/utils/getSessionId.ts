import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

/**
 * Retrieves the session ID from the request context.
 * @param context - The server-side props context.
 * @returns {string} - The session ID or null if not found.
 */
export function getSessionId(
  context: GetServerSidePropsContext,
): string | null {
  const { req, res } = context;
  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');

  return sessionId ?? null;
}
