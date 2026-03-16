import { getFirmsPaginated } from './getFirmsPaginated';

const mockEnsureFirmsCacheUpdated = jest.fn();
const mockRedisRestGet = jest.fn();
const mockQuery = jest.fn();

jest.mock('./refreshFirmsCache', () => ({
  ensureFirmsCacheUpdated: () => mockEnsureFirmsCacheUpdated(),
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

const twoFirms = [
  { id: 'a', status: 'active', fca_number: 1 },
  { id: 'b', status: 'active', fca_number: 2 },
];

describe('getFirmsPaginated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnsureFirmsCacheUpdated.mockResolvedValue(undefined);
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

  it('falls back to Cosmos when Redis returns null', async () => {
    mockRedisRestGet.mockResolvedValue({
      success: true,
      data: { value: null },
    });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.firms).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(2);
  });

  it('falls back to Cosmos when Redis get fails', async () => {
    mockRedisRestGet.mockRejectedValue(new Error('Redis unavailable'));
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.firms).toHaveLength(2);
    expect(result.pagination.totalItems).toBe(2);
  });
});
