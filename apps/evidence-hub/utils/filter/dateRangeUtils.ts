/**
 * Utilities for date range filtering
 */

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type DateRangeOption = 'last-2' | 'last-5' | 'more-than-5' | 'all';

/**
 * Get date range from year value
 */
export function getDateRange(yearValue: string): DateRange | null {
  const currentYear = new Date().getFullYear();
  let startDate: Date | undefined;
  let endDate: Date | undefined;

  switch (yearValue) {
    case 'all':
      return null;
    case 'last-2':
      startDate = new Date(currentYear - 1, 0, 1);
      endDate = new Date(currentYear, 11, 31, 23, 59, 59);
      break;
    case 'last-5':
      startDate = new Date(currentYear - 4, 0, 1);
      endDate = new Date(currentYear, 11, 31, 23, 59, 59);
      break;
    case 'more-than-5':
      startDate = new Date(1900, 0, 1);
      endDate = new Date(currentYear - 5, 11, 31, 23, 59, 59);
      break;
    default: {
      const specificYear = Number.parseInt(yearValue, 10);
      if (!Number.isNaN(specificYear)) {
        startDate = new Date(specificYear, 0, 1);
        endDate = new Date(specificYear, 11, 31, 23, 59, 59);
      }
      break;
    }
  }

  return startDate && endDate ? { startDate, endDate } : null;
}
