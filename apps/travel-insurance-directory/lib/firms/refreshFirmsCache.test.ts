import {
  ensureFirmsCacheUpdated,
  refreshFirmsCacheIfNeeded,
} from './refreshFirmsCache';

const mockGetDisplayOrderEpoch = jest.fn();
const mockSetDisplayOrderEpoch = jest.fn();
const mockRedisRestSet = jest.fn();
const mockCompress = jest.fn();
const mockShuffleWithSeed = jest.fn();
const mockGenerateSeed = jest.fn();

jest.mock('./displayOrderEpoch', () => ({
  getDisplayOrderEpoch: () => mockGetDisplayOrderEpoch(),
  setDisplayOrderEpoch: (...args: unknown[]) =>
    mockSetDisplayOrderEpoch(...args),
}));

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestSet: (...args: unknown[]) => mockRedisRestSet(...args),
}));

jest.mock('@maps-react/utils/compress', () => ({
  compress: (s: string) => mockCompress(s),
}));

jest.mock('../../utils/shufflePACs', () => ({
  generateSeed: (...args: unknown[]) => mockGenerateSeed(...args),
  shuffleWithSeed: (...args: unknown[]) => mockShuffleWithSeed(...args),
}));

const mockFetchAll = jest.fn();
jest.mock('../database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: {
        items: {
          query: () => ({ fetchAll: () => mockFetchAll() }),
        },
      },
    }),
}));

describe('refreshFirmsCache', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateSeed.mockReturnValue(12345);
    mockSetDisplayOrderEpoch.mockResolvedValue(undefined);
    mockCompress.mockImplementation((s: string) =>
      Promise.resolve(Buffer.from(s).toString('base64')),
    );
  });

  describe('refreshFirmsCacheIfNeeded', () => {
    it('returns refreshed: false when stored epoch equals current seed', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(12345);
      const result = await refreshFirmsCacheIfNeeded();
      expect(result).toEqual({ refreshed: false, firmsCount: 0 });
      expect(mockFetchAll).not.toHaveBeenCalled();
    });

    it('fetches from Cosmos, shuffles, compresses and writes when epoch differs', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(99999);
      const firms = [
        { id: 'id-1', status: 'active' },
        { id: 'id-2', status: 'active' },
      ];
      mockFetchAll.mockResolvedValue({ resources: firms });
      mockShuffleWithSeed.mockImplementation((ids: string[]) =>
        [...ids].reverse(),
      );
      mockRedisRestSet.mockResolvedValue({ success: true });

      const result = await refreshFirmsCacheIfNeeded();

      expect(result).toEqual({ refreshed: true, firmsCount: 2 });
      expect(mockShuffleWithSeed).toHaveBeenCalledWith(['id-1', 'id-2'], 12345);
      expect(mockCompress).toHaveBeenCalled();
      expect(mockSetDisplayOrderEpoch).toHaveBeenCalledWith(12345);
    });

    it('when firms are empty, sets epoch and writes empty compressed list', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(null);
      mockFetchAll.mockResolvedValue({ resources: [] });
      mockRedisRestSet.mockResolvedValue({ success: true });

      const result = await refreshFirmsCacheIfNeeded();

      expect(result).toEqual({ refreshed: true, firmsCount: 0 });
      expect(mockCompress).toHaveBeenCalledWith(JSON.stringify([]));
      expect(mockSetDisplayOrderEpoch).toHaveBeenCalledWith(12345);
    });

    it('returns error when Redis set fails for empty list', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(null);
      mockFetchAll.mockResolvedValue({ resources: [] });
      mockRedisRestSet.mockResolvedValue({
        success: false,
        error: 'Redis error',
      });

      const result = await refreshFirmsCacheIfNeeded();

      expect(result).toEqual({
        refreshed: true,
        firmsCount: 0,
        error: 'Redis error',
      });
    });

    it('returns error when Redis set fails for firms list', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(null);
      mockFetchAll.mockResolvedValue({
        resources: [{ id: 'id-1', status: 'active' }],
      });
      mockShuffleWithSeed.mockImplementation((a: unknown[]) => a);
      mockRedisRestSet.mockResolvedValue({
        success: false,
        error: 'Write failed',
      });

      const result = await refreshFirmsCacheIfNeeded();

      expect(result).toEqual({
        refreshed: true,
        firmsCount: 1,
        error: 'Write failed',
      });
      expect(mockSetDisplayOrderEpoch).not.toHaveBeenCalled();
    });
  });

  describe('ensureFirmsCacheUpdated', () => {
    it('returns without calling refresh when epoch matches current seed', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(12345);
      await ensureFirmsCacheUpdated();
      expect(mockFetchAll).not.toHaveBeenCalled();
    });

    it('calls refreshFirmsCacheIfNeeded when epoch differs', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(99999);
      mockFetchAll.mockResolvedValue({ resources: [] });
      mockRedisRestSet.mockResolvedValue({ success: true });
      mockCompress.mockResolvedValue('e30=');

      await ensureFirmsCacheUpdated();

      expect(mockFetchAll).toHaveBeenCalled();
    });

    it('calls refresh when epoch is null', async () => {
      mockGetDisplayOrderEpoch.mockResolvedValue(null);
      mockFetchAll.mockResolvedValue({ resources: [] });
      mockRedisRestSet.mockResolvedValue({ success: true });
      mockCompress.mockResolvedValue('e30=');

      await ensureFirmsCacheUpdated();

      expect(mockFetchAll).toHaveBeenCalled();
    });
  });
});
