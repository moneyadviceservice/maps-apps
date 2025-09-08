import { getStore } from '@netlify/blobs';

import { loadEnv } from '../loadEnv';

/**
 * Retrieve the entry in the store using the provided session ID.
 * @param key - The session ID used to identify the stored records.
 * @returns A promise that resolves to the StoreEntry.
 * @throws An error if the records cannot be retrieved or are missing.
 */
export async function deleteStoreEntry(key: string) {
  const { storeName } = loadEnv();
  const store = getStore({ name: storeName, consistency: 'strong' });

  try {
    await store.delete(key);
  } catch (error) {
    console.error('Error deleting store entry:', error);
  }
}
