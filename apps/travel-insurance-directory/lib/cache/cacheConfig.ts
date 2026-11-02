/**
 * Redis cache key layout and TTL for travel-insurance-directory.
 * State is checked in Redis first; Cosmos is called only when the hour has passed.
 */

export const CACHE_CONFIG = {
  /** Ordered list of all active firms (current hour seed). */
  ALL_FIRMS_KEY: 'travel-directory:all-firms',
  /** Current seed hour (number) for cache validity. */
  DISPLAY_ORDER_EPOCH_KEY: 'travel-directory:display-order-epoch',
  /** Filter result IDs key prefix: travel-directory:filter-results:{epoch}:{hash}. */
  FILTER_RESULTS_PREFIX: 'travel-directory:filter-results',
  /** Registry of all TAD cache keys for clear-on-refresh. */
  REGISTRY_KEY: 'travel-directory:registry',
  /** TTL for cache keys: 1 hour. Aligns with hourly refresh; Redis eviction is a safety net if refresh stops. */
  HOURLY_CACHE_TTL: 3600,
} as const;

export function getFilterResultsCacheKey(
  epoch: number,
  queryHash: string,
): string {
  return `${CACHE_CONFIG.FILTER_RESULTS_PREFIX}:${epoch}:${queryHash}`;
}
