import { getStore, Store } from '@netlify/blobs';

import { Entry } from '../../lib/types';
import { loadEnv } from '../loadEnv';

/**
 * Retrieve the entry in the store using the provided session ID.
 * @param key - The session ID used to identify the stored records.
 * @returns A promise that resolves to the StoreEntry.
 * @throws An error if the records cannot be retrieved or are missing.
 */
export async function getStoreEntry(
  key: string,
): Promise<{ entry: Entry; store: Store }> {
  const { storeName } = loadEnv();
  const store = getStore({ name: storeName, consistency: 'strong' });
  const entry: Entry = await store.get(key, { type: 'json' });
  if (!entry) {
    throw new Error('store data not found');
  }

  return { entry, store };
}
