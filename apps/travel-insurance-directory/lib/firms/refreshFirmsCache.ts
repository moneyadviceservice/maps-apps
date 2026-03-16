/**
 * Refresh firms cache in Redis: check Redis for hour passed, then call Cosmos and set order in Redis.
 * No Cosmos writes. Used by hourly cron and by read path when epoch is expired.
 */

import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { redisRestSet } from '@maps-react/redis/rest-client';
import { compress } from '@maps-react/utils/compress';

import { generateSeed, shuffleWithSeed } from '../../utils/shufflePACs';
import { CACHE_CONFIG } from '../cache/cacheConfig';
import { dbConnect } from '../database/dbConnect';
import {
  getDisplayOrderEpoch,
  setDisplayOrderEpoch,
} from './displayOrderEpoch';

const ACTIVE_STATUS = 'active';

export type RefreshFirmsCacheResult = {
  refreshed: boolean;
  firmsCount: number;
  error?: string;
};

/**
 * Checks Redis for current epoch. If the hour has passed (or Redis is empty),
 * fetches active firms from Cosmos, computes order in memory, writes ordered
 * firms and epoch to Redis. Otherwise skips Cosmos.
 */
export async function refreshFirmsCacheIfNeeded(): Promise<RefreshFirmsCacheResult> {
  const currentSeed = generateSeed(new Date());
  const storedEpoch = await getDisplayOrderEpoch();

  if (storedEpoch !== null && storedEpoch === currentSeed) {
    return { refreshed: false, firmsCount: 0 };
  }

  const { container } = await dbConnect();
  const querySpec = {
    query: `SELECT * FROM c WHERE c.status = @status`,
    parameters: [{ name: '@status', value: ACTIVE_STATUS }],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  const firms = resources as (TravelInsuranceFirmDocument & { id: string })[];
  const ids = firms.map((f) => f.id);

  if (ids.length === 0) {
    await setDisplayOrderEpoch(currentSeed);
    const emptyCompressed = await compress(JSON.stringify([]));
    const setResponse = await redisRestSet(
      CACHE_CONFIG.ALL_FIRMS_KEY,
      emptyCompressed,
      { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL },
    );
    if (!setResponse.success) {
      return {
        refreshed: true,
        firmsCount: 0,
        error: setResponse.error,
      };
    }
    return { refreshed: true, firmsCount: 0 };
  }

  const shuffledIds = shuffleWithSeed(ids, currentSeed);
  const idToFirm = new Map(firms.map((f) => [f.id, f]));
  const orderedFirms = shuffledIds
    .map((id) => idToFirm.get(id))
    .filter((f): f is TravelInsuranceFirmDocument & { id: string } => f != null)
    .map((f, i) => ({ ...f, display_order: i }));

  const jsonString = JSON.stringify(orderedFirms);
  const compressed = await compress(jsonString);
  const setFirmsResponse = await redisRestSet(
    CACHE_CONFIG.ALL_FIRMS_KEY,
    compressed,
    { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL },
  );
  if (!setFirmsResponse.success) {
    return {
      refreshed: true,
      firmsCount: orderedFirms.length,
      error: setFirmsResponse.error,
    };
  }

  await setDisplayOrderEpoch(currentSeed);
  return { refreshed: true, firmsCount: orderedFirms.length };
}

let ensurePromise: Promise<RefreshFirmsCacheResult> | null = null;

/**
 * If the cache is expired (e.g. new hour), runs refresh once. Concurrent callers share the same run.
 * Call this before reading firms so Redis has the current hour's ordered list.
 */
export async function ensureFirmsCacheUpdated(): Promise<void> {
  const storedEpoch = await getDisplayOrderEpoch();
  const currentSeed = generateSeed(new Date());
  if (storedEpoch !== null && storedEpoch === currentSeed) {
    return;
  }

  ensurePromise ??= refreshFirmsCacheIfNeeded().finally(() => {
    ensurePromise = null;
  });
  await ensurePromise;
}
