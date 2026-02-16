import {
  buildListingsSearchParams,
  getLimit,
  removeFilterHref,
  setLimitHref,
} from './listingsPageFilters';

describe('getLimit', () => {
  it('returns 5 when limit missing', () => {
    expect(getLimit({})).toBe(5);
  });

  it('parses string limit', () => {
    expect(getLimit({ limit: '20' })).toBe(20);
  });

  it('clamps over 100 to 5 (invalid)', () => {
    expect(getLimit({ limit: '999' })).toBe(5);
  });

  it('returns 5 for invalid value', () => {
    expect(getLimit({ limit: 'x' })).toBe(5);
  });

  it('accepts limit 1 and 100 as boundaries', () => {
    expect(getLimit({ limit: '1' })).toBe(1);
    expect(getLimit({ limit: '100' })).toBe(100);
  });
});

describe('buildListingsSearchParams', () => {
  it('omits empty values', () => {
    const params = buildListingsSearchParams({ a: '', b: 'x' });
    expect(params.get('b')).toBe('x');
    expect(params.has('a')).toBe(false);
  });

  it('joins array values with comma', () => {
    const params = buildListingsSearchParams({ topic: ['a', 'b'] });
    expect(params.get('topic')).toBe('a,b');
  });

  it('omits array when all items empty after trim', () => {
    const params = buildListingsSearchParams({ topic: ['  ', ''] });
    expect(params.has('topic')).toBe(false);
  });
});

describe('removeFilterHref', () => {
  it('returns query string without param and p=1', () => {
    const href = removeFilterHref({ status: 'active', p: '2' }, 'status');
    expect(href).toContain('p=1');
    expect(href).not.toContain('status');
  });
});

describe('setLimitHref', () => {
  it('returns query string with limit and p=1', () => {
    const href = setLimitHref({}, 10);
    expect(href).toMatch(/limit=10|p=1/);
  });
});
