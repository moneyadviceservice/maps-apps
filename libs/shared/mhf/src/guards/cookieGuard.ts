import { GetServerSidePropsContext } from 'next';

import { getSessionId } from '../utils';

/**
 * Guard to check if the session cookie is present.
 * @param context - The server-side props context.
 * @returns {Promise<void>} - Resolves if the session cookie is present, otherwise throws an error.
 */
export async function cookieGuard(
  context: GetServerSidePropsContext,
): Promise<void> {
  const key = getSessionId(context);

  if (!key) {
    throw new TypeError('[cookieGuard] Session ID is missing');
  }
}
