import { CACHE_CONFIG } from '../cache/cacheConfig';
import { invalidateFirmsListingCache } from './invalidateFirmsListingCache';

const mockRedisRestDel = jest.fn();
jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestDel: (...args: unknown[]) => mockRedisRestDel(...args),
}));

describe('invalidateFirmsListingCache', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedisRestDel.mockResolvedValue({ success: true });
  });

  afterAll(() => {
    warnSpy.mockRestore();
  });

  it('deletes display-order epoch and all-firms keys in parallel', async () => {
    await invalidateFirmsListingCache();

    expect(mockRedisRestDel).toHaveBeenCalledTimes(2);
    expect(mockRedisRestDel).toHaveBeenCalledWith(
      CACHE_CONFIG.DISPLAY_ORDER_EPOCH_KEY,
    );
    expect(mockRedisRestDel).toHaveBeenCalledWith(CACHE_CONFIG.ALL_FIRMS_KEY);
  });

  it('does not throw when a delete fails', async () => {
    mockRedisRestDel
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false, error: 'Redis unavailable' });

    await expect(invalidateFirmsListingCache()).resolves.toBeUndefined();

    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to invalidate firms listing cache in Redis:',
      expect.arrayContaining([
        expect.objectContaining({
          key: CACHE_CONFIG.ALL_FIRMS_KEY,
          error: 'Redis unavailable',
        }),
      ]),
    );
  });
});
