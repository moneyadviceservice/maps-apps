import { asString, asStringArray } from './entryValueHelpers';

describe('entryValueHelpers', () => {
  describe('asString', () => {
    it('returns the same value when input is a string', () => {
      expect(asString('email')).toBe('email');
    });

    it('returns first value when input is a string array', () => {
      expect(asString(['text-message', 'email'])).toBe('text-message');
    });

    it('returns empty string when input is an empty array', () => {
      expect(asString([])).toBe('');
    });

    it('returns empty string when input is undefined', () => {
      expect(asString(undefined)).toBe('');
    });
  });

  describe('asStringArray', () => {
    it('wraps a string input in an array', () => {
      expect(asStringArray('email')).toEqual(['email']);
    });

    it('returns the same array when input is already a string array', () => {
      expect(asStringArray(['text-message', 'email'])).toEqual([
        'text-message',
        'email',
      ]);
    });

    it('returns an empty array when input is undefined', () => {
      expect(asStringArray(undefined)).toEqual([]);
    });
  });
});
