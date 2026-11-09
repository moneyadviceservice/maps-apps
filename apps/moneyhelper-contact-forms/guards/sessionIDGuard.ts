import { GetServerSidePropsContext } from 'next';

import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import { getSessionId } from '@maps-react/mhf/utils/';

import { GUID_REGEX } from '../lib/constants';

/**
 * Guard to capture and persist the MHPD external session ID from the query string.
 * Only runs on the MHPD journey. If a `sessionID` query parameter is present it is
 * written into the session store so downstream steps can access it without relying
 * on query params remaining in the URL.
 * @param {GetServerSidePropsContext} context - The Next.js server-side props context.
 * @returns {Promise<void>} A promise that resolves when the guard has completed its work.
 */
export async function sessionIDGuard(
  context: GetServerSidePropsContext,
): Promise<void> {
  const { query } = context;
  const sessionID = Array.isArray(query.sessionID)
    ? query.sessionID[0]
    : query.sessionID;

  if (!sessionID || !GUID_REGEX.test(String(sessionID))) {
    return;
  }

  const key = getSessionId(context);
  if (!key) {
    return;
  }

  const entry = await getStoreEntry(key);
  if (!entry) {
    return;
  }

  // Only store sessionID if it is not already stored - prevents overwriting via manulipulation of query params after initial capture
  if (!entry.data?.sessionID) {
    await setStoreEntry(key, {
      ...entry,
      data: {
        ...entry.data,
        sessionID,
      },
    });
  }
}
