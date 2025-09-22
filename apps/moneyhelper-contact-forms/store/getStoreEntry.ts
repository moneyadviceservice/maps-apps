import { redisGet } from '@maps-react/redis/helpers';

import { Entry } from '../lib/types';

/**
 * Retrieve the entry in Redis using the provided session ID.
 * @param key - The session ID used to identify the stored records which can be null.
 * @returns A promise that resolves to the entry object. Or an empty object if the key is null.
 * @throws An error if the records cannot be retrieved or are missing.
 */
export async function getStoreEntry(key: string | null): Promise<Entry> {
  if (!key) {
    return {} as Entry;
  }
  const entryJson = await redisGet(key);
  if (!entryJson) {
    throw new Error('[getStoreEntry] Session data not found');
  }
  return JSON.parse(entryJson) as Entry;
}
