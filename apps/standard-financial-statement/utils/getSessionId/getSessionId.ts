import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

/**
 * Retrieves the Cookie ID from the request context.
 * @param context - The server-side props context.
 * @returns {string} - The Cookie ID.
 * @throws {Error} - If the Cookie ID is missing
 */
export function getSessionId(context: GetServerSidePropsContext): string {
  const { req, res } = context;
  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');

  if (!sessionId) {
    throw new Error('Cookie ID is missing');
  }

  return sessionId;
}
