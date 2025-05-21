import { GetServerSidePropsContext } from 'next';

import { getSessionId } from '../lib/utils/getSessionId';
import { getStoreEntry } from './getStoreEntry';

export async function getStoreFlow(
  context: GetServerSidePropsContext,
): Promise<string | null> {
  const key = getSessionId(context);
  const { entry } = await getStoreEntry(key);

  // Return entry.data.flow if it exists, otherwise return null
  return entry.data?.flow || null;
}
