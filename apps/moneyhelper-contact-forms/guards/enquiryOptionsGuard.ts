import { GetServerSidePropsContext } from 'next';

import { SUB_TO_PARENT_FLOW_MAP } from '../lib/constants';
import { getSessionId } from '../lib/utils';
import { getStoreEntry } from '../store';

/**
 * Guard to clear out the store data except for flow and lang.
 * This is used to prevent data from a previous sub-flow from being used in the new sub-flow (eg first-name)
 * It also ensures that the flow is set to the parent flow (eg insurance-other -> insurance) to ensure the correct content is shown.
 * @param context - The server-side props context.
 * @returns {Promise<void>} - Resolves if the store entry is reset.
 */
export async function enquiryOptionsGuard(context: GetServerSidePropsContext) {
  const key = getSessionId(context);
  const { entry, store } = await getStoreEntry(key);

  // Only run if store exists and there are no errors
  if (key && entry && entry?.errors?.length === 0) {
    let { flow } = entry.data;

    // Use the map to get the sub flow if it exists, otherwise keep the original flow
    flow = SUB_TO_PARENT_FLOW_MAP[flow] || flow;

    // Keep the flow and lang data, but clear out the rest of the data
    await store.setJSON(key, {
      ...entry,
      data: {
        flow,
        lang: entry.data.lang,
      },
    });
  }
}
