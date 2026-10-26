import {
  isValidDay,
  isValidMonth,
  isValidYear,
  parseDateString,
  getDateFieldErrors,
  getMissingDateComponents,
  hasAllDateComponents,
  isValidCalendarDate,
} from './dateFieldValidation';

describe('dateFieldValidation', () => {
  describe('isValidDay', () => {
    it('should return true for valid days', () => {
      expect(isValidDay('1')).toBe(true);
      expect(isValidDay('15')).toBe(true);
      expect(isValidDay('31')).toBe(true);
    });

    it('should return false for invalid days', () => {
      expect(isValidDay('0')).toBe(false);
      expect(isValidDay('32')).toBe(false);
      expect(isValidDay('-1')).toBe(false);
      expect(isValidDay('abc')).toBe(false);
      expect(isValidDay('')).toBe(false);
    });
  });

  describe('isValidMonth', () => {
    it('should return true for valid months', () => {
      expect(isValidMonth('1')).toBe(true);
      expect(isValidMonth('6')).toBe(true);
      expect(isValidMonth('12')).toBe(true);
    });

    it('should return false for invalid months', () => {
      expect(isValidMonth('0')).toBe(false);
      expect(isValidMonth('13')).toBe(false);
      expect(isValidMonth('-1')).toBe(false);
      expect(isValidMonth('abc')).toBe(false);
      expect(isValidMonth('')).toBe(false);
    });
  });

  describe('isValidYear', () => {
    it('should return true for valid 4-digit years', () => {
      expect(isValidYear('2023')).toBe(true);
      expect(isValidYear('2026')).toBe(true);
      expect(isValidYear('1999')).toBe(true);
    });

    it('should return false for invalid years', () => {
      expect(isValidYear('23')).toBe(false);
      expect(isValidYear('202')).toBe(false);
      expect(isValidYear('20233')).toBe(false);
      expect(isValidYear('abcd')).toBe(false);
      expect(isValidYear('')).toBe(false);
    });
  });

  describe('parseDateString', () => {
    it('should parse complete date strings', () => {
      expect(parseDateString('6-4-2023')).toEqual({
        day: '6',
        month: '4',
        year: '2023',
      });
    });

    it('should handle dates with spaces', () => {
      expect(parseDateString(' 6 - 4 - 2023 ')).toEqual({
        day: '6',
        month: '4',
        year: '2023',
      });
    });

    it('should handle partial dates', () => {
      expect(parseDateString('-4-2023')).toEqual({
        day: '',
        month: '4',
        year: '2023',
      });
      expect(parseDateString('6--2023')).toEqual({
        day: '6',
        month: '',
        year: '2023',
      });
      expect(parseDateString('6-4-')).toEqual({
        day: '6',
        month: '4',
        year: '',
      });
    });

    it('should handle empty string', () => {
      expect(parseDateString('')).toEqual({
        day: '',
        month: '',
        year: '',
      });
    });
  });

  describe('getDateFieldErrors', () => {
    it('should return all fields as errors for empty string', () => {
      expect(getDateFieldErrors('')).toEqual({
        day: true,
        month: true,
        year: true,
      });
    });

    it('should return all fields as errors for "--"', () => {
      expect(getDateFieldErrors('--')).toEqual({
        day: true,
        month: true,
        year: true,
      });
    });

    it('should return no errors for valid dates', () => {
      expect(getDateFieldErrors('6-4-2023')).toEqual({});
      expect(getDateFieldErrors('31-12-2025')).toEqual({});
    });

    it('should return day error for invalid day', () => {
      expect(getDateFieldErrors('32-4-2023')).toEqual({
        day: true,
      });
      expect(getDateFieldErrors('0-4-2023')).toEqual({
        day: true,
      });
    });

    it('should return month error for invalid month', () => {
      expect(getDateFieldErrors('6-13-2023')).toEqual({
        month: true,
      });
      expect(getDateFieldErrors('6-0-2023')).toEqual({
        month: true,
      });
    });

    it('should return year error for invalid year', () => {
      expect(getDateFieldErrors('6-4-23')).toEqual({
        year: true,
      });
      expect(getDateFieldErrors('6-4-20233')).toEqual({
        year: true,
      });
    });

    it('should return day error for missing day', () => {
      expect(getDateFieldErrors('-4-2023')).toEqual({
        day: true,
      });
    });

    it('should return month error for missing month', () => {
      expect(getDateFieldErrors('6--2023')).toEqual({
        month: true,
      });
    });

    it('should return year error for missing year', () => {
      expect(getDateFieldErrors('6-4-')).toEqual({
        year: true,
      });
    });

    it('should return multiple errors for multiple invalid fields', () => {
      expect(getDateFieldErrors('32-13-23')).toEqual({
        day: true,
        month: true,
        year: true,
      });
    });
  });

  describe('getMissingDateComponents', () => {
    it('should identify missing day', () => {
      expect(getMissingDateComponents('-4-2023')).toEqual({
        missingDay: true,
        missingMonth: false,
        missingYear: false,
      });
    });

    it('should identify missing month', () => {
      expect(getMissingDateComponents('6--2023')).toEqual({
        missingDay: false,
        missingMonth: true,
        missingYear: false,
      });
    });

    it('should identify missing year', () => {
      expect(getMissingDateComponents('6-4-')).toEqual({
        missingDay: false,
        missingMonth: false,
        missingYear: true,
      });
    });

    it('should identify multiple missing components', () => {
      expect(getMissingDateComponents('--2023')).toEqual({
        missingDay: true,
        missingMonth: true,
        missingYear: false,
      });
    });

    it('should identify all components present', () => {
      expect(getMissingDateComponents('6-4-2023')).toEqual({
        missingDay: false,
        missingMonth: false,
        missingYear: false,
      });
    });
  });

  describe('hasAllDateComponents', () => {
    it('should return true when all components present', () => {
      expect(hasAllDateComponents('6-4-2023')).toBe(true);
      expect(hasAllDateComponents('32-13-2023')).toBe(true); // Even if invalid
    });

    it('should return false when day is missing', () => {
      expect(hasAllDateComponents('-4-2023')).toBe(false);
    });

    it('should return false when month is missing', () => {
      expect(hasAllDateComponents('6--2023')).toBe(false);
    });

    it('should return false when year is missing', () => {
      expect(hasAllDateComponents('6-4-')).toBe(false);
    });

    it('should return false when multiple components missing', () => {
      expect(hasAllDateComponents('--')).toBe(false);
      expect(hasAllDateComponents('')).toBe(false);
    });
  });

  describe('isValidCalendarDate', () => {
    it('should return true for valid calendar dates', () => {
      expect(isValidCalendarDate('6', '4', '2023')).toBe(true);
      expect(isValidCalendarDate('31', '12', '2023')).toBe(true);
      expect(isValidCalendarDate('29', '2', '2024')).toBe(true); // Leap year
    });

    it('should return false for invalid calendar dates', () => {
      expect(isValidCalendarDate('31', '2', '2023')).toBe(false); // Feb has 28/29 days
      expect(isValidCalendarDate('31', '4', '2023')).toBe(false); // April has 30 days
      expect(isValidCalendarDate('29', '2', '2023')).toBe(false); // Not a leap year
    });

    it('should return false for invalid number formats', () => {
      expect(isValidCalendarDate('abc', '4', '2023')).toBe(false);
      expect(isValidCalendarDate('6', 'abc', '2023')).toBe(false);
      expect(isValidCalendarDate('6', '4', 'abcd')).toBe(false);
    });
  });
});
