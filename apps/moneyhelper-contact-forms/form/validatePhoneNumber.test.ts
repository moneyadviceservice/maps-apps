import { validatePhoneNumber } from './validatePhoneNumber';

describe('validatePhoneNumber', () => {
  it('should return valid for an empty value', () => {
    const result = validatePhoneNumber('');
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for undefined', () => {
    const result = validatePhoneNumber(undefined);
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for a valid phone number', () => {
    const result = validatePhoneNumber('+44 1234567890');
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for a valid phone number without country code', () => {
    const result = validatePhoneNumber('1234567890');
    expect(result).toEqual({ isValid: true });
  });

  it('should return valid for a valid phone number with spaces', () => {
    const result = validatePhoneNumber('123 456 7890');
    expect(result).toEqual({ isValid: true });
  });

  it('should return invalid for an invalid phone number', () => {
    const result = validatePhoneNumber('invalid-phone');
    expect(result).toEqual({ isValid: false });
  });

  it('should return invalid for a phone number that is too short', () => {
    const result = validatePhoneNumber('123');
    expect(result).toEqual({ isValid: false });
  });

  it('should return invalid for a phone number with invalid characters', () => {
    const result = validatePhoneNumber('1234567890@');
    expect(result).toEqual({ isValid: false });
  });
});
