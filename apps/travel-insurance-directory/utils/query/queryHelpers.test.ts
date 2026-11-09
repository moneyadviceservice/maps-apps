import {
  firstQueryStringParam,
  generateQueryKey,
  getQueryValue,
  parseAdminDashboardListQuery,
  parseAdminDashboardSortParams,
  parseQueryParam,
} from './queryHelpers';

describe('firstQueryStringParam', () => {
  it('returns string value as-is', () => {
    expect(firstQueryStringParam('beta')).toBe('beta');
  });

  it('returns first element when value is string[]', () => {
    expect(firstQueryStringParam(['first', 'second'])).toBe('first');
  });

  it('returns empty string for undefined, empty string, or empty array', () => {
    expect(firstQueryStringParam(undefined)).toBe('');
    expect(firstQueryStringParam('')).toBe('');
    expect(firstQueryStringParam([])).toBe('');
  });
});

describe('getQueryValue', () => {
  it('returns value for direct key', () => {
    expect(getQueryValue({ status: 'active' }, 'status')).toBe('active');
  });

  it('returns value for key[] notation', () => {
    expect(getQueryValue({ 'status[]': 'a' }, 'status')).toBe('a');
  });

  it('returns undefined when key missing', () => {
    expect(getQueryValue({}, 'status')).toBeUndefined();
  });
});

describe('generateQueryKey', () => {
  it('returns stable string with keys sorted', () => {
    const key1 = generateQueryKey({ b: '1', a: '2' });
    const key2 = generateQueryKey({ a: '2', b: '1' });
    expect(key1).toBe(key2);
  });
});

describe('parseQueryParam', () => {
  it('returns empty array for undefined or empty', () => {
    expect(parseQueryParam(undefined)).toEqual([]);
    expect(parseQueryParam('')).toEqual([]);
  });

  it('splits comma string and trims', () => {
    expect(parseQueryParam(' a , b ')).toEqual(['a', 'b']);
  });

  it('handles array value', () => {
    expect(parseQueryParam(['x', 'y'])).toEqual(['x', 'y']);
  });
});

describe('parseAdminDashboardSortParams', () => {
  it('returns null sortBy and desc when sort params omitted', () => {
    expect(parseAdminDashboardSortParams({})).toEqual({
      sortBy: null,
      sortDir: 'desc',
    });
  });

  it('defaults sortDir to asc when sortBy is set and sortDir omitted', () => {
    expect(parseAdminDashboardSortParams({ sortBy: 'firmName' })).toEqual({
      sortBy: 'firmName',
      sortDir: 'asc',
    });
  });

  it('respects explicit sortDir desc and asc', () => {
    expect(
      parseAdminDashboardSortParams({
        sortBy: 'firmName',
        sortDir: 'desc',
      }),
    ).toEqual({ sortBy: 'firmName', sortDir: 'desc' });

    expect(
      parseAdminDashboardSortParams({
        sortBy: 'firmName',
        sortDir: 'asc',
      }),
    ).toEqual({ sortBy: 'firmName', sortDir: 'asc' });
  });

  it('treats whitespace-only sortBy as null and sortDir desc', () => {
    expect(parseAdminDashboardSortParams({ sortBy: '   ' })).toEqual({
      sortBy: null,
      sortDir: 'desc',
    });
  });

  it('trims sortBy', () => {
    expect(parseAdminDashboardSortParams({ sortBy: '  firmName  ' })).toEqual({
      sortBy: 'firmName',
      sortDir: 'asc',
    });
  });

  it('uses first element when sortBy is string[]', () => {
    expect(
      parseAdminDashboardSortParams({ sortBy: ['firmName', 'other'] }),
    ).toEqual({
      sortBy: 'firmName',
      sortDir: 'asc',
    });
  });

  it('uses first element when sortDir is string[]', () => {
    expect(
      parseAdminDashboardSortParams({
        sortBy: 'firmName',
        sortDir: ['desc', 'asc'],
      }),
    ).toEqual({ sortBy: 'firmName', sortDir: 'desc' });
  });
});

describe('parseAdminDashboardListQuery', () => {
  it('parses search fields and defaults page to 1', () => {
    expect(parseAdminDashboardListQuery({})).toEqual({
      search: {
        principalName: null,
        fcaNumber: null,
        firmName: null,
        sortBy: null,
        sortDir: 'desc',
      },
      page: 1,
    });
  });

  it('parses string search params and page', () => {
    expect(
      parseAdminDashboardListQuery({
        principalName: 'Amy',
        fcaNumber: '610',
        firmName: 'alpha',
        p: '3',
        sortBy: 'fcaNumber',
        sortDir: 'desc',
      }),
    ).toEqual({
      search: {
        principalName: 'Amy',
        fcaNumber: '610',
        firmName: 'alpha',
        sortBy: 'fcaNumber',
        sortDir: 'desc',
      },
      page: 3,
    });
  });

  it('uses first p when p is string[]', () => {
    expect(parseAdminDashboardListQuery({ p: ['2', '9'] }).page).toBe(2);
  });

  it('defaults invalid page to 1', () => {
    expect(parseAdminDashboardListQuery({ p: 'x' }).page).toBe(1);
  });
});
