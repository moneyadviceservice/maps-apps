import { DateComponents, DateFieldErrors } from './types';

const DATE_CONSTRAINTS = {
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  year: { minLength: 4, maxLength: 4 },
} as const;

/**
 * Validates a numeric date component within specified bounds
 */
const isValidDateComponent = (
  value: string,
  min: number,
  max: number,
): boolean => {
  const num = Number.parseInt(value, 10);
  return !Number.isNaN(num) && num >= min && num <= max;
};

/**
 * Validates if a day value is valid (1-31)
 */
export const isValidDay = (day: string): boolean =>
  isValidDateComponent(day, DATE_CONSTRAINTS.day.min, DATE_CONSTRAINTS.day.max);

/**
 * Validates if a month value is valid (1-12)
 */
export const isValidMonth = (month: string): boolean =>
  isValidDateComponent(
    month,
    DATE_CONSTRAINTS.month.min,
    DATE_CONSTRAINTS.month.max,
  );

/**
 * Validates if a year value is valid (4 digits)
 */
export const isValidYear = (year: string): boolean => {
  if (year.length !== DATE_CONSTRAINTS.year.minLength) {
    return false;
  }
  const yearNum = Number.parseInt(year, 10);
  return (
    !Number.isNaN(yearNum) && year.length === DATE_CONSTRAINTS.year.minLength
  );
};

/**
 * Parses a date string into components
 */
export const parseDateString = (dateString: string): DateComponents => {
  const parts = dateString.split('-');
  return {
    day: parts[0]?.trim() || '',
    month: parts[1]?.trim() || '',
    year: parts[2]?.trim() || '',
  };
};

/**
 * Checks if a date component is present and non-empty
 */
const hasValue = (value: string): boolean => value !== '';

/**
 * Unified date field validation
 *
 * @param dateString - Date string in format "day-month-year"
 * @returns Object indicating which fields have errors
 */
export const getDateFieldErrors = (dateString: string): DateFieldErrors => {
  // Handle empty or invalid input
  if (!dateString || dateString.trim() === '' || dateString === '--') {
    return { day: true, month: true, year: true };
  }

  const { day, month, year } = parseDateString(dateString);
  const errors: DateFieldErrors = {};

  // Validate day
  if (!hasValue(day) || !isValidDay(day)) {
    errors.day = true;
  }

  // Validate month
  if (!hasValue(month) || !isValidMonth(month)) {
    errors.month = true;
  }

  // Validate year
  if (!hasValue(year) || !isValidYear(year)) {
    errors.year = true;
  }

  return errors;
};

/**
 * Determines which date components are missing
 * Used for generating specific error messages
 */
export const getMissingDateComponents = (
  dateString: string,
): {
  missingDay: boolean;
  missingMonth: boolean;
  missingYear: boolean;
} => {
  const { day, month, year } = parseDateString(dateString);

  return {
    missingDay: !hasValue(day),
    missingMonth: !hasValue(month),
    missingYear: !hasValue(year),
  };
};

/**
 * Checks if a date string has all components present (even if invalid)
 */
export const hasAllDateComponents = (dateString: string): boolean => {
  const { day, month, year } = parseDateString(dateString);
  return hasValue(day) && hasValue(month) && hasValue(year);
};

export const isValidCalendarDate = (
  day: string,
  month: string,
  year: string,
): boolean => {
  const dayNum = Number.parseInt(day, 10);
  const monthNum = Number.parseInt(month, 10);
  const yearNum = Number.parseInt(year, 10);

  if (Number.isNaN(dayNum) || Number.isNaN(monthNum) || Number.isNaN(yearNum)) {
    return false;
  }

  const date = new Date(yearNum, monthNum - 1, dayNum);
  return (
    date.getDate() === dayNum &&
    date.getMonth() === monthNum - 1 &&
    date.getFullYear() === yearNum
  );
};
