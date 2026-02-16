import { getFirmsPaginated } from './getFirmsPaginated';

const mockEnsureDisplayOrderUpdated = jest.fn();
const mockQuery = jest.fn();

jest.mock('../../scripts/updateDisplayOrder', () => ({
  ensureDisplayOrderUpdated: () => mockEnsureDisplayOrderUpdated(),
}));

jest.mock('../database/dbConnect', () => ({
  dbConnect: () =>
    Promise.resolve({
      container: { items: { query: mockQuery } },
    }),
}));

const twoFirms = [
  { id: 'a', status: 'active' },
  { id: 'b', status: 'active' },
];

describe('getFirmsPaginated', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnsureDisplayOrderUpdated.mockResolvedValue(undefined);
    mockQuery.mockImplementation((spec: { query?: string }) => {
      const isCount = spec?.query?.includes('COUNT');
      return {
        fetchAll: () =>
          Promise.resolve({
            resources: isCount ? [7] : twoFirms,
          }),
      };
    });
  });

  it('calls ensureDisplayOrderUpdated then queries with buildListingsQuery and count', async () => {
    const result = await getFirmsPaginated({}, 1, 5);
    expect(mockEnsureDisplayOrderUpdated).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(result.firms).toHaveLength(2);
    expect(result.pagination).toEqual({
      page: 1,
      totalPages: 2,
      totalItems: 7,
      itemsPerPage: 5,
      hasNextPage: true,
      hasPreviousPage: false,
      startIndex: 0,
      endIndex: 5,
    });
  });

  it('returns hasPreviousPage true on page 2', async () => {
    mockQuery.mockImplementation((spec: { query?: string }) => {
      const isCount = spec?.query?.includes('COUNT');
      return {
        fetchAll: () =>
          Promise.resolve({
            resources: isCount ? [10] : [],
          }),
      };
    });
    const result = await getFirmsPaginated({}, 2, 5);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.hasPreviousPage).toBe(true);
  });

  it('returns totalPages 1 and endIndex 0 when totalItems is 0', async () => {
    mockQuery.mockImplementation((spec: { query?: string }) => {
      const isCount = spec?.query?.includes('COUNT');
      return {
        fetchAll: () =>
          Promise.resolve({
            resources: isCount ? [0] : [],
          }),
      };
    });
    const result = await getFirmsPaginated({}, 1, 5);
    expect(result.pagination.totalPages).toBe(1);
    expect(result.pagination.totalItems).toBe(0);
    expect(result.pagination.endIndex).toBe(0);
  });
});
