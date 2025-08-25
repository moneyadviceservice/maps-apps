import { toLowerCaseFirstChar } from './toLowerCaseFirstChar';

describe('toLowerCaseFirstChar', () => {
  it('should convert the first letter to lowercase', () => {
    expect(toLowerCaseFirstChar('Hello')).toBe('hello');
  });

  it('should return the same string if the first letter is already lowercase', () => {
    expect(toLowerCaseFirstChar('hello')).toBe('hello');
  });

  it('should handle empty strings', () => {
    expect(toLowerCaseFirstChar('')).toBe('');
  });

  it('should handle single character strings', () => {
    expect(toLowerCaseFirstChar('H')).toBe('h');
    expect(toLowerCaseFirstChar('h')).toBe('h');
  });

  it('should handle null and undefined', () => {
    expect(toLowerCaseFirstChar(null as any)).toBe(null);
    expect(toLowerCaseFirstChar(undefined as any)).toBe(undefined);
  });
});
