import { GetServerSidePropsContext } from 'next';

import { FormError } from '../lib/types';
import { getSessionId } from '../lib/utils/getSessionId';
import { getStoreEntry } from './getStoreEntry';

/**
 * Retrieves the form errors from the store using the provided context.
 * @param context - The server-side props context.
 * @returns {Promise<FormError[]>} - A promise that resolves to an array of form errors. Or an empty array if no session ID is found.
 * @throws {Error} - If the entry is not found in the store.
 */
export async function getStoreErrors(
  context: GetServerSidePropsContext,
): Promise<FormError[]> {
  const key = getSessionId(context);
  if (!key) {
    return [];
  }

  const { entry } = await getStoreEntry(key);

  if (!entry) {
    throw new Error('Session data not found');
  }

  return entry.errors;
}
