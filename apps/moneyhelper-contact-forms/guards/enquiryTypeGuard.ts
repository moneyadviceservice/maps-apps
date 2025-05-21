import { GetServerSidePropsContext } from 'next';

import { getSessionId } from '../lib/utils';
import { getStoreEntry } from '../store';

/**
 * Guard to clear out the store data except for flow and lang.
 * This is used to prevent data from a previous flow from being used in the new flow (eg first-name)
 * @param context - The server-side props context.
 * @returns {Promise<void>} - Resolves if the store entry is reset.
 */
export async function enquiryTypeGuard(context: GetServerSidePropsContext) {
  const key = getSessionId(context);
  const { entry, store } = await getStoreEntry(key);

  // Only run if store exists and there are no errors
  if (key && entry && entry?.errors?.length === 0) {
    // Keep the flow and lang data, but clear out the rest of the data
    await store.setJSON(key, {
      ...entry,
      data: {
        flow: entry.data.flow,
        lang: entry.data.lang,
      },
    });
  }
}
