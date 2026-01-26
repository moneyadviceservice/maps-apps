import { redisSet } from '@maps-react/redis/helpers';

import { Entry } from '../types';

export async function setStoreEntry(
  key: string | null,
  entry: Entry,
): Promise<void> {
  if (!key) {
    throw new TypeError('[setStoreEntry] No session key provided');
  }
  await redisSet(key, JSON.stringify(entry));
}
