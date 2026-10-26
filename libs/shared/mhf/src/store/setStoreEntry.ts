import { redisRestSet } from '@maps-react/redis/rest-client';

import { SESSION_TTL_SECONDS } from '../constants';
import { Entry } from '../types';

export async function setStoreEntry(
  key: string | null,
  entry: Entry,
): Promise<void> {
  if (!key) {
    throw new TypeError('[setStoreEntry] No session key provided');
  }
  const result = await redisRestSet(key, JSON.stringify(entry), {
    ttlSeconds: SESSION_TTL_SECONDS,
  });
  if (!result.success) {
    throw new TypeError(`[setStoreEntry] Failed to set entry: ${result.error}`);
  }
}
