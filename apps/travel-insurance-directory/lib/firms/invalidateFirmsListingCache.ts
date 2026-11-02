import { redisRestDel } from '@maps-react/redis/rest-client';

import { CACHE_CONFIG } from '../cache/cacheConfig';

const LISTING_CACHE_KEYS = [
  CACHE_CONFIG.DISPLAY_ORDER_EPOCH_KEY,
  CACHE_CONFIG.ALL_FIRMS_KEY,
] as const;

/**
 * Drops Redis listing cache after admin directory status changes.
 * Rebuild runs lazily on the next getFirmsPaginated request
 */
export async function invalidateFirmsListingCache(): Promise<void> {
  const results = await Promise.all(
    LISTING_CACHE_KEYS.map((key) => redisRestDel(key)),
  );

  const failures = results.flatMap((result, index) =>
    result.success
      ? []
      : [{ key: LISTING_CACHE_KEYS[index], error: result.error }],
  );

  if (failures.length > 0) {
    console.warn(
      'Failed to invalidate firms listing cache in Redis:',
      failures,
    );
  }
}
