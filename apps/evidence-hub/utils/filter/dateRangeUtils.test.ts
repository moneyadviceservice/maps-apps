import {
  expectDateMatches,
  expectDateRange,
} from 'utils/fetch/__mocks__/testUtils';

import { getDateRange } from './dateRangeUtils';

import '@testing-library/jest-dom';

// Helper to test date range with non-null result and start date check
const expectDateRangeWithStartDate = (
  result: { startDate: Date; endDate: Date } | null,
  expectedStart: {
    year: number;
    month: number;
    day: number;
  },
): void => {
  expect(result).not.toBeNull();
  if (result) {
    expectDateMatches(result.startDate, expectedStart);
  }
};

describe('dateRangeUtils', () => {
  describe('getDateRange', () => {
    const currentYear = new Date().getFullYear();

    beforeEach(() => {
      // Mock Date if needed, but getFullYear should work fine
      jest.useFakeTimers();
      jest.setSystemTime(new Date(currentYear, 5, 15)); // Mid-year date
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it.each([
      { input: 'all', description: '"all" option' },
      { input: '', description: 'empty string' },
      { input: 'invalid-year', description: 'invalid year string' },
      { input: 'abc123', description: 'non-numeric string' },
      { input: 'not-a-number', description: 'NaN parsing result' },
      {
        input: undefined as unknown as string,
        description: 'undefined value',
      },
    ])('should return null for $description', ({ input }) => {
      const result = getDateRange(input);

      expect(result).toBeNull();
    });

    it('should return date range for "last-2" option', () => {
      const result = getDateRange('last-2');

      expectDateRange(
        result,
        {
          year: currentYear - 1,
          month: 0, // January
          day: 1,
        },
        {
          year: currentYear,
          month: 11, // December
          day: 31,
          hours: 23,
          minutes: 59,
          seconds: 59,
        },
      );
    });

    it('should return date range for "last-5" option', () => {
      const result = getDateRange('last-5');

      expectDateRange(
        result,
        {
          year: currentYear - 4,
          month: 0, // January
          day: 1,
        },
        {
          year: currentYear,
          month: 11, // December
          day: 31,
        },
      );
    });

    it('should return date range for "more-than-5" option', () => {
      const result = getDateRange('more-than-5');

      expectDateRange(
        result,
        {
          year: 1900,
          month: 0, // January
          day: 1,
        },
        {
          year: currentYear - 5,
          month: 11, // December
          day: 31,
          hours: 23,
          minutes: 59,
          seconds: 59,
        },
      );
    });

    it('should return date range for specific year string', () => {
      const year = '2020';
      const result = getDateRange(year);

      expectDateRange(
        result,
        {
          year: 2020,
          month: 0, // January
          day: 1,
        },
        {
          year: 2020,
          month: 11, // December
          day: 31,
          hours: 23,
          minutes: 59,
          seconds: 59,
        },
      );
    });

    describe('edge cases', () => {
      it('should handle year string with whitespace', () => {
        const result = getDateRange('  2020  ');

        expectDateRangeWithStartDate(result, {
          year: 2020,
          month: 0,
          day: 1,
        });
      });

      it('should handle very old year', () => {
        const result = getDateRange('1900');

        expectDateRangeWithStartDate(result, {
          year: 1900,
          month: 0,
          day: 1,
        });
      });

      it('should handle future year', () => {
        const futureYear = (currentYear + 10).toString();
        const result = getDateRange(futureYear);

        expect(result).not.toBeNull();
        expect(result?.startDate.getFullYear()).toBe(currentYear + 10);
      });
    });
  });
});
