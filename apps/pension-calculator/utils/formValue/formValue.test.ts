import { asString, firstString } from './formValue';

describe('formValue', () => {
  it('reads the first array item as a string', () => {
    expect(asString(['abc'])).toBe('abc');
    expect(asString('abc')).toBe('abc');
    expect(asString(undefined)).toBe('');
    expect(asString(null)).toBe('');
  });

  it('returns undefined for blank firstString values', () => {
    expect(firstString('abc')).toBe('abc');
    expect(firstString('')).toBeUndefined();
    expect(firstString([''])).toBeUndefined();
    expect(firstString(undefined)).toBeUndefined();
  });
});
