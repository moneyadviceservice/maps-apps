import { validatePostCode } from './validatePostCode';

describe('validatePostCode', () => {
  it('should return valid for an empty value', () => {
    const result = validatePostCode('');
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for undefined', () => {
    const result = validatePostCode(undefined);
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for a valid UK postcode', () => {
    const result = validatePostCode('SW1A 1AA');
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for a valid international postcode', () => {
    const result = validatePostCode('75008');
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for a postcode with a dash', () => {
    const result = validatePostCode('123-456');
    expect(result).toEqual({ isValid: true });
  });

  it('should return invalid for a postcode that is too short', () => {
    const result = validatePostCode('12');
    expect(result).toEqual({ isValid: false });
  });

  it('should return invalid for a postcode with invalid characters', () => {
    const result = validatePostCode('123@456');
    expect(result).toEqual({ isValid: false });
  });

  it('should return invalid for a postcode that is too long', () => {
    const result = validatePostCode('12345678901');
    expect(result).toEqual({ isValid: false });
  });
});
