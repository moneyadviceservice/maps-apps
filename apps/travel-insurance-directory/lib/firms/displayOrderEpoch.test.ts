import { generateSeed } from 'utils/shufflePACs';

import { CACHE_CONFIG } from '../cache/cacheConfig';
import {
  getDisplayOrderEpoch,
  isDisplayOrderExpired,
  setDisplayOrderEpoch,
} from './displayOrderEpoch';

const mockRedisRestGet = jest.fn();
const mockRedisRestSet = jest.fn();

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: (...args: unknown[]) => mockRedisRestGet(...args),
  redisRestSet: (...args: unknown[]) => mockRedisRestSet(...args),
}));

jest.mock('utils/shufflePACs', () => ({
  generateSeed: jest.fn(() => 12345),
}));

describe('displayOrderEpoch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDisplayOrderEpoch', () => {
    it('returns seed_hour when Redis has value', async () => {
      mockRedisRestGet.mockResolvedValue({
        success: true,
        data: { value: '999' },
      });
      await expect(getDisplayOrderEpoch()).resolves.toBe(999);
    });

    it('returns null when Redis get fails', async () => {
      mockRedisRestGet.mockRejectedValue(new Error('Redis error'));
      await expect(getDisplayOrderEpoch()).resolves.toBeNull();
    });

    it('returns null when success is false', async () => {
      mockRedisRestGet.mockResolvedValue({ success: false });
      await expect(getDisplayOrderEpoch()).resolves.toBeNull();
    });

    it('returns null when value is null', async () => {
      mockRedisRestGet.mockResolvedValue({
        success: true,
        data: { value: null },
      });
      await expect(getDisplayOrderEpoch()).resolves.toBeNull();
    });

    it('returns null when value is not a number', async () => {
      mockRedisRestGet.mockResolvedValue({
        success: true,
        data: { value: 'not-a-number' },
      });
      await expect(getDisplayOrderEpoch()).resolves.toBeNull();
    });
  });

  describe('setDisplayOrderEpoch', () => {
    it('calls redisRestSet with key and string value', async () => {
      mockRedisRestSet.mockResolvedValue({ success: true });
      await setDisplayOrderEpoch(42);
      expect(mockRedisRestSet).toHaveBeenCalledWith(
        'travel-directory:display-order-epoch',
        '42',
        expect.objectContaining({ ttlSeconds: CACHE_CONFIG.HOURLY_CACHE_TTL }),
      );
    });

    it('throws when redisRestSet returns success false', async () => {
      mockRedisRestSet.mockResolvedValue({
        success: false,
        error: 'Write failed',
      });
      await expect(setDisplayOrderEpoch(42)).rejects.toThrow(
        'Failed to set display order epoch',
      );
    });
  });

  describe('isDisplayOrderExpired', () => {
    it('returns true when stored is null', async () => {
      mockRedisRestGet.mockResolvedValue({
        success: true,
        data: { value: null },
      });
      await expect(isDisplayOrderExpired()).resolves.toBe(true);
    });

    it('returns true when stored seed differs from current', async () => {
      (generateSeed as jest.Mock).mockReturnValue(111);
      mockRedisRestGet.mockResolvedValue({
        success: true,
        data: { value: '222' },
      });
      await expect(isDisplayOrderExpired()).resolves.toBe(true);
    });

    it('returns false when stored seed matches current', async () => {
      (generateSeed as jest.Mock).mockReturnValue(12345);
      mockRedisRestGet.mockResolvedValue({
        success: true,
        data: { value: '12345' },
      });
      await expect(isDisplayOrderExpired()).resolves.toBe(false);
    });
  });
});
