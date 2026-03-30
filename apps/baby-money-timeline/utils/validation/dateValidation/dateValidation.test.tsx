import { isValidDate, isBeforeMinDate } from './dateValidation';
import { subYears, startOfYear, addDays, subDays } from 'date-fns';

describe('dateValidation', () => {
  describe('isValidDate', () => {
    it('should return false for empty string', () => {
      expect(isValidDate('')).toBe(false);
    });

    it('should return false for string with too few parts', () => {
      expect(isValidDate('12-2025')).toBe(false); // Only two parts
    });

    it('should return false for string with too many parts', () => {
      expect(isValidDate('15-12-2025-extra')).toBe(false); // Four parts
    });

    it('should return false for string with wrong delimiter', () => {
      expect(isValidDate('15/12/2025')).toBe(false); // Uses '/' instead of '-'
    });
    it('should return true for valid date string', () => {
      expect(isValidDate('15-12-2025')).toBe(true);
    });

    it('should return false for invalid day in month', () => {
      expect(isValidDate('31-04-2025')).toBe(false); // April has 30 days
    });

    it('should return false for invalid month', () => {
      expect(isValidDate('15-13-2025')).toBe(false);
    });

    it('should return false for invalid year', () => {
      expect(isValidDate('15-12-202')).toBe(false);
    });

    it('should return false for non-existent date', () => {
      expect(isValidDate('29-02-2025')).toBe(false); // Not a leap year
    });
  });

  describe('isBeforeMinDate', () => {
    it('should return false for invalid date', () => {
      expect(isBeforeMinDate('32-13-2025')).toBe(false);
    });

    it('should return true for date more than 5 years ago', () => {
      const minDate = startOfYear(subYears(new Date(), 5));
      const dateWayBefore = subYears(minDate, 1);
      const dateString = dateWayBefore
        .toLocaleDateString('en-GB')
        .replace(/\//g, '-');
      expect(isBeforeMinDate(dateString)).toBe(true);
    });

    it('should return false for date less than 5 years ago', () => {
      const fourYearsAgo = subYears(new Date(), 4);
      const dateString = fourYearsAgo
        .toLocaleDateString('en-GB')
        .replace(/\//g, '-');
      expect(isBeforeMinDate(dateString)).toBe(false);
    });

    it('should return false for future date', () => {
      const futureDate = addDays(new Date(), 30);
      const dateString = futureDate
        .toLocaleDateString('en-GB')
        .replace(/\//g, '-');
      expect(isBeforeMinDate(dateString)).toBe(false);
    });

    it('should return true for exactly 5 years ago minus one day', () => {
      const minDate = startOfYear(subYears(new Date(), 5));
      const oneDayBefore = subDays(minDate, 1);
      const dateString = oneDayBefore
        .toLocaleDateString('en-GB')
        .replace(/\//g, '-');
      expect(isBeforeMinDate(dateString)).toBe(true);
    });

    it('should return false for exactly 5 years ago start of year', () => {
      const fiveYearsAgoStart = startOfYear(subYears(new Date(), 5));
      const dateString = fiveYearsAgoStart
        .toLocaleDateString('en-GB')
        .replace(/\//g, '-');
      expect(isBeforeMinDate(dateString)).toBe(false);
    });
  });
});
