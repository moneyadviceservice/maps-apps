import { redisRestGet } from '@maps-react/redis/rest-client';

import { Entry } from '../types';

/**
 * Retrieves a store entry from Redis by key.
 * @param key The key to retrieve the entry for.
 * @returns The Entry object.
 * @throws TypeError if the session data is not found.
 */
export async function getStoreEntry(key: string | null): Promise<Entry> {
  if (!key) {
    return {} as Entry;
  }
  const result = await redisRestGet(key);
  if (!result.success || !result.data?.value) {
    throw new TypeError('[getStoreEntry] Session data not found');
  }
  return JSON.parse(result.data.value) as Entry;
}
