import { getStore, Store } from '@netlify/blobs';

import { Entry } from '../lib/types';
import { loadEnv } from '../lib/utils/loadEnv';

/**
 * Retrieve the entry in the store using the provided session ID.
 * @param key - The session ID used to identify the stored records which can be null.
 * @returns A promise that resolves to an object containing the entry and store. Or an empty object if the key is null.
 * @throws An error if the records cannot be retrieved or are missing.
 */
export async function getStoreEntry(
  key: string | null,
): Promise<{ entry: Entry; store: Store }> {
  if (!key) {
    return { entry: {} as Entry, store: {} as Store };
  }
  const { name } = loadEnv();
  const store = getStore({ name: name, consistency: 'strong' });
  const entry: Entry = await store.get(key, { type: 'json' });

  if (!entry) {
    throw new Error('Session data not found in getStoreEntry()');
  }

  return { entry, store };
}
