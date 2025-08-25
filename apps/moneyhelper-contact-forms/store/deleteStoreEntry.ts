import { GetServerSidePropsContext } from 'next';

import { redisDel } from '@maps-react/redis/helpers';

import { getSessionId } from '../lib/utils';

/**
 * Delete the entry in Redis using the session ID from context.
 * @param context - The Next.js server-side context.
 */
export async function deleteStoreEntry(
  context: GetServerSidePropsContext,
): Promise<void> {
  const key = getSessionId(context);
  if (!key) {
    throw new Error('[deleteStoreEntry] No session key found in context');
  }
  await redisDel(key);
}
