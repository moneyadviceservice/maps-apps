import {
  extractPaginationParams,
  paginateItems,
  generatePageRange,
  validatePaginationParams,
} from './paginationUtils';

describe('paginateItems', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns first page with default params', () => {
    const result = paginateItems(items, {});
    expect(result.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.totalItems).toBe(10);
  });

  it('returns second page when page=2 and limit=3', () => {
    const result = paginateItems(items, { page: 2, limit: 3 });
    expect(result.items).toEqual([4, 5, 6]);
    expect(result.pagination.startIndex).toBe(3);
    expect(result.pagination.endIndex).toBe(6);
  });

  it('returns empty items for page beyond range', () => {
    const result = paginateItems(items, { page: 5, limit: 5 });
    expect(result.items).toEqual([]);
  });
});

describe('extractPaginationParams', () => {
  it('defaults to page 1 and limit 10 when no options', () => {
    expect(extractPaginationParams({})).toEqual({ page: 1, limit: 10 });
  });

  it('uses defaultLimit option', () => {
    expect(extractPaginationParams({}, { defaultLimit: 5 })).toEqual({
      page: 1,
      limit: 5,
    });
  });

  it('parses p and limit from query', () => {
    expect(extractPaginationParams({ p: '3', limit: '20' })).toEqual({
      page: 3,
      limit: 20,
    });
  });

  it('clamps limit to 100', () => {
    expect(extractPaginationParams({ limit: '200' }).limit).toBe(100);
  });

  it('floors invalid page to 1', () => {
    expect(extractPaginationParams({ p: '0' }).page).toBe(1);
  });

  it('uses defaultLimit when limit is missing', () => {
    expect(extractPaginationParams({ p: '1' })).toEqual({
      page: 1,
      limit: 10,
    });
  });
});

describe('generatePageRange', () => {
  it('returns full range when totalPages <= maxVisible', () => {
    expect(generatePageRange(1, 3, 5)).toEqual([1, 2, 3]);
  });

  it('returns sliding window for large total', () => {
    expect(generatePageRange(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
  });

  it('adjusts start when near end so visible count is maxVisible', () => {
    expect(generatePageRange(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
  });
});

describe('validatePaginationParams', () => {
  it('returns defaults for empty params', () => {
    expect(validatePaginationParams({})).toEqual({ page: 1, limit: 10 });
  });

  it('uses defaultLimit when provided', () => {
    expect(validatePaginationParams({}, 5)).toEqual({ page: 1, limit: 5 });
  });

  it('clamps limit to 100', () => {
    expect(validatePaginationParams({ page: 1, limit: 200 })).toEqual({
      page: 1,
      limit: 100,
    });
  });
});
