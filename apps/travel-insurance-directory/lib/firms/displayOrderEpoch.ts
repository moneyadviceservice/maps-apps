/**
 * Tracks when display_order was last updated so we can refresh when the
 * time-based seed changes (e.g. new hour). Stored in Redis only (no Cosmos writes).
 */

import { generateSeed } from 'utils/shufflePACs';

import { redisRestGet, redisRestSet } from '@maps-react/redis/rest-client';

import { CACHE_CONFIG } from '../cache/cacheConfig';

/**
 * Returns the stored seed hour for the last display_order update, or null if missing/error.
 */
export async function getDisplayOrderEpoch(): Promise<number | null> {
  try {
    const response = await redisRestGet(CACHE_CONFIG.DISPLAY_ORDER_EPOCH_KEY);
    if (!response.success || response.data?.value == null) {
      return null;
    }
    const parsed = Number(response.data.value);
    return Number.isNaN(parsed) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Writes the current seed hour so future requests know display_order is up to date.
 */
export async function setDisplayOrderEpoch(seedHour: number): Promise<void> {
  const response = await redisRestSet(
    CACHE_CONFIG.DISPLAY_ORDER_EPOCH_KEY,
    String(seedHour),
    { ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL },
  );
  if (!response.success) {
    throw new Error(
      `Failed to set display order epoch in Redis: ${response.error}`,
    );
  }
}

/**
 * True if display_order has not been updated for the current hour (or never set).
 */
export async function isDisplayOrderExpired(): Promise<boolean> {
  const currentSeed = generateSeed(new Date());
  const stored = await getDisplayOrderEpoch();
  return stored === null || stored !== currentSeed;
}
