import { convertStringToNumber } from './convertStringToNumber';

describe('convertStringToNumber', () => {
  it('should convert a valid string number with commas to a numeric value', () => {
    const result = convertStringToNumber('1,234,567.89');
    expect(result).toBe(1234567.89);
  });

  it('should convert a valid string number without commas to a numeric value', () => {
    const result = convertStringToNumber('1234567.89');
    expect(result).toBe(1234567.89);
  });

  it('should return 0 for an empty string', () => {
    const result = convertStringToNumber('');
    expect(result).toBe(0);
  });

  it('should return 0 for a string with a zero value', () => {
    const result = convertStringToNumber('0');
    expect(result).toBe(0);
  });

  it('should handle negative numbers correctly', () => {
    const result = convertStringToNumber('-12345.67');
    expect(result).toBe(-12345.67);
  });
});
