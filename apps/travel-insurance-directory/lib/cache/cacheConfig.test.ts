import { CACHE_CONFIG, getFilterResultsCacheKey } from './cacheConfig';

describe('cacheConfig', () => {
  describe('CACHE_CONFIG', () => {
    it('has expected key names and TTL', () => {
      expect(CACHE_CONFIG.ALL_FIRMS_KEY).toBe('travel-directory:all-firms');
      expect(CACHE_CONFIG.DISPLAY_ORDER_EPOCH_KEY).toBe(
        'travel-directory:display-order-epoch',
      );
      expect(CACHE_CONFIG.FILTER_RESULTS_PREFIX).toBe(
        'travel-directory:filter-results',
      );
      expect(CACHE_CONFIG.REGISTRY_KEY).toBe('travel-directory:registry');
      expect(CACHE_CONFIG.HOURLY_CACHE_TTL).toBe(3600);
    });
  });

  describe('getFilterResultsCacheKey', () => {
    it('returns key with epoch and query hash', () => {
      expect(getFilterResultsCacheKey(12345, 'abc123')).toBe(
        'travel-directory:filter-results:12345:abc123',
      );
    });

    it('uses different epoch and hash', () => {
      expect(getFilterResultsCacheKey(0, '')).toBe(
        'travel-directory:filter-results:0:',
      );
    });
  });
});
