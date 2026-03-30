import {
  generateQueryKey,
  getQueryValue,
  parseQueryParam,
} from './queryHelpers';

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
