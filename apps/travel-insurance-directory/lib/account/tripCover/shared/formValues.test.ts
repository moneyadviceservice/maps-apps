import { formatYesNoToFormValue, parseYesNoFromFormValue } from './formValues';

describe('formValues', () => {
  describe('formatYesNoToFormValue', () => {
    it('maps booleans to yes/no', () => {
      expect(formatYesNoToFormValue(true)).toBe('yes');
      expect(formatYesNoToFormValue(false)).toBe('no');
    });

    it('accepts legacy yes/no strings', () => {
      expect(formatYesNoToFormValue('yes')).toBe('yes');
      expect(formatYesNoToFormValue('NO')).toBe('no');
    });

    it('returns empty string for null or unknown values', () => {
      expect(formatYesNoToFormValue(null)).toBe('');
      expect(formatYesNoToFormValue('maybe')).toBe('');
    });
  });

  describe('parseYesNoFromFormValue', () => {
    it('parses yes/no to booleans', () => {
      expect(parseYesNoFromFormValue('yes')).toBe(true);
      expect(parseYesNoFromFormValue('no')).toBe(false);
    });

    it('returns null for missing or invalid values', () => {
      expect(parseYesNoFromFormValue('')).toBeNull();
      expect(parseYesNoFromFormValue(undefined)).toBeNull();
    });
  });
});
