import { compress, isCompressed, uncompress } from './compress';

describe('compress', () => {
  it('returns base64-encoded compressed string', async () => {
    const input = 'hello world';
    const result = await compress(input);
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(result.length).toBeLessThanOrEqual(input.length + 20);
  });
});

describe('uncompress', () => {
  it('round-trips with compress', async () => {
    const input = '{"firms":["a","b","c"]}';
    const compressed = await compress(input);
    const output = await uncompress(compressed);
    expect(output).toBe(input);
  });

  it('decompresses valid base64 deflate data', async () => {
    const input = 'test data';
    const compressed = await compress(input);
    const result = await uncompress(compressed);
    expect(result).toBe(input);
  });
});

describe('isCompressed', () => {
  it('returns false for short strings', () => {
    expect(isCompressed('')).toBe(false);
    expect(isCompressed('short')).toBe(false);
    expect(isCompressed('a'.repeat(19))).toBe(false);
  });

  it('returns false when length is 20 but base64 pattern', () => {
    expect(isCompressed('a'.repeat(20))).toBe(false);
  });

  it('returns false for non-base64 characters', () => {
    expect(isCompressed('!!!' + 'a'.repeat(60))).toBe(false);
  });

  it('returns true for base64-like string longer than 50', () => {
    const base64 = 'ABCDefgh0123456789+/='.repeat(3);
    expect(base64.length).toBeGreaterThan(50);
    expect(isCompressed(base64)).toBe(true);
  });

  it('returns false for base64 string of length 50 or less', () => {
    const base64 = 'ABCDefgh0123456789+/=';
    expect(base64.length).toBeLessThanOrEqual(50);
    expect(isCompressed(base64)).toBe(false);
  });
});
