import { GetServerSidePropsContext } from 'next';

import { redisRestDel } from '@maps-react/redis/rest-client';

import { getSessionId } from '../utils';

/**
 * Delete the entry in Redis using the session ID from context.
 * @param context - The Next.js server-side context.
 */
export async function deleteStoreEntry(
  context: GetServerSidePropsContext,
): Promise<void> {
  const key = getSessionId(context);
  if (!key) {
    throw new TypeError('[deleteStoreEntry] No session key found in context');
  }
  const result = await redisRestDel(key);
  if (!result.success) {
    throw new TypeError(
      `[deleteStoreEntry] Failed to delete entry: ${result.error}`,
    );
  }
}
