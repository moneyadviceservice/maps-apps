import { parseNumberFromString } from './parseNumberFromString';

describe('parseNumberFromString utility', () => {
  it('should parse number from string correctly', () => {
    expect(parseNumberFromString('1234')).toBe(1234);
    expect(parseNumberFromString('1234.56')).toBe(1234.56);
    expect(parseNumberFromString('1,234.56')).toBe(1234.56);
    expect(parseNumberFromString('£1,234.56')).toBe(1234.56);
    expect(parseNumberFromString('Number value = £1,234.56.')).toBe(1234.56);
    expect(parseNumberFromString('£123 and £456')).toBe(123456);
    expect(parseNumberFromString('-£1,234.56')).toBe(-1234.56);
    expect(parseNumberFromString(' 1 , 2 3 4 . 5 6 ')).toBe(1234.56);
    expect(parseNumberFromString('654-321')).toBe(654);
    expect(parseNumberFromString('abc')).toBe(0);
    expect(parseNumberFromString('')).toBe(0);
  });
});
