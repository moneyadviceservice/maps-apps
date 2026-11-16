import { getAllFilteredFirms, getFirmsPaginated } from './getFirmsPaginated';

const mockEnsureFirmsCacheUpdated = jest.fn();
const mockRefreshFirmsCacheIfNeeded = jest.fn();
const mockRedisRestGet = jest.fn();
const mockQuery = jest.fn();
const mockIsCompressed = jest.fn();
const mockUncompress = jest.fn();

jest.mock('./refreshFirmsCache', () => ({
  ensureFirmsCacheUpdated: () => mockEnsureFirmsCacheUpdated(),
  refreshFirmsCacheIfNeeded: () => mockRefreshFirmsCacheIfNeeded(),
}));

jest.mock('@maps-react/redis/rest-client', () => ({
  redisRestGet: (...args: unknown[]) => mockRedisRestGet(...args),
}));

jest.mock('../database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: { items: { query: mockQuery } },
    }),
}));

jest.mock('@maps-react/utils/compress', () => ({
  isCompressed: (...args: unknown[]) => mockIsCompressed(...args),
  uncompress: (...args: unknown[]) => mockUncompress(...args),
}));

const twoFirms = [
  { id: 'a', status: 'active', fca_number: 1 },
  { id: 'b', status: 'active', fca_number: 2 },
];

describe('getFirmsPaginated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnsureFirmsCacheUpdated.mockResolvedValue(undefined);
    mockRefreshFirmsCacheIfNeeded.mockResolvedValue(undefined);
    mockRedisRestGet.mockResolvedValue({
      success: true,
      data: { value: JSON.stringify(twoFirms) },
    });
    mockQuery.mockImplementation(() => ({
      fetchAll: () =>
        Promise.resolve({
          resources: twoFirms,
        }),
    }));
    mockIsCompressed.mockReturnValue(false);
  });

  it('prefers Redis: calls ensureFirmsCacheUpdated and redisRestGet, returns filtered page', async () => {
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockEnsureFirmsCacheUpdated).toHaveBeenCalled();
    expect(mockRedisRestGet).toHaveBeenCalled();
    expect(mockQuery).not.toHaveBeenCalled();
    expect(result.firms).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(2);
    expect(result.pagination.totalPages).toBe(1);
    expect(result.pagination.page).toBe(1);
  });

  it('paginates from Redis when many firms', async () => {
    const ten = Array.from({ length: 10 }, (_, i) => ({
      id: `id-${i}`,
      status: 'active',
      fca_number: i,
    }));
    mockRedisRestGet.mockResolvedValue({
      success: true,
      data: { value: JSON.stringify(ten) },
    });
    const result = await getFirmsPaginated({}, 2, 3);
    expect(result.firms).toHaveLength(3);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.totalItems).toBe(10);
    expect(result.pagination.totalPages).toBe(4);
    expect(result.pagination.startIndex).toBe(3);
    expect(result.pagination.endIndex).toBe(6);
  });

  it('falls back to Cosmos when Redis get fails', async () => {
    mockRedisRestGet.mockRejectedValue(new Error('Redis unavailable'));
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.firms).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(2);
  });

  it('retries Redis after refreshFirmsCacheIfNeeded when first call returns null value', async () => {
    mockRedisRestGet
      .mockResolvedValueOnce({ success: true, data: { value: null } })
      .mockResolvedValueOnce({
        success: true,
        data: { value: JSON.stringify(twoFirms) },
      });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockRefreshFirmsCacheIfNeeded).toHaveBeenCalled();
    expect(mockRedisRestGet).toHaveBeenCalledTimes(2);
    expect(mockQuery).not.toHaveBeenCalled();
    expect(result.firms).toHaveLength(2);
  });

  it('falls back to Cosmos when Redis retry also returns null', async () => {
    mockRedisRestGet
      .mockResolvedValueOnce({ success: true, data: { value: null } })
      .mockResolvedValueOnce({ success: true, data: { value: null } });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockRefreshFirmsCacheIfNeeded).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.firms).toHaveLength(2);
  });

  it('handles compressed Redis data by calling uncompress', async () => {
    const compressedValue = 'compressed-blob';
    mockIsCompressed.mockReturnValue(true);
    mockUncompress.mockResolvedValue(JSON.stringify(twoFirms));
    mockRedisRestGet.mockResolvedValue({
      success: true,
      data: { value: compressedValue },
    });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockIsCompressed).toHaveBeenCalledWith(compressedValue);
    expect(mockUncompress).toHaveBeenCalledWith(compressedValue);
    expect(result.firms).toHaveLength(2);
  });

  it('treats non-array parsed Redis data as an empty array', async () => {
    mockRedisRestGet.mockResolvedValue({
      success: true,
      data: { value: JSON.stringify({ not: 'an array' }) },
    });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(result.firms).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
  });

  it('falls back to Cosmos when Redis data cannot be parsed', async () => {
    mockRedisRestGet.mockResolvedValue({
      success: true,
      data: { value: 'invalid-json{{{' },
    });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.firms).toHaveLength(2);
  });

  it('getAllFilteredFirms returns all matching firms without pagination', async () => {
    const result = await getAllFilteredFirms({});
    expect(result).toHaveLength(2);
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
