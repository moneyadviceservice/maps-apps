import { isAfter, isEqual, isValid, parse } from 'date-fns';
import { z } from 'zod';

import {
  getDateFieldErrors,
  getMissingDateComponents,
  isValidCalendarDate,
  parseDateString,
} from './dateFieldValidation';
import {
  DateComponents,
  DateFieldErrors,
  PurchaseDateErrorMessages,
} from './types';

/**
 * Minimum allowed purchase date: 06/04/2023
 */
const MIN_PURCHASE_DATE = new Date(2023, 3, 6); // April 6, 2023 (month is 0-indexed)

/**
 * Parses a date string in "day-month-year" format using date-fns
 * @param dateString - Date string in format "day-month-year"
 * @returns Parsed Date object or null if invalid
 */
const parseDateStringToDate = (dateString: string): Date | null => {
  try {
    const parsedDate = parse(dateString, 'd-M-yyyy', new Date());

    if (!isValid(parsedDate)) {
      return null;
    }

    return parsedDate;
  } catch {
    return null;
  }
};

/**
 * Checks if a date is on or after the minimum purchase date
 * @param date - Date to check
 * @returns true if date is valid and on/after minimum date
 */
const isDateOnOrAfterMinimum = (date: Date): boolean => {
  return isAfter(date, MIN_PURCHASE_DATE) || isEqual(date, MIN_PURCHASE_DATE);
};

/**
 * Validates a purchase date string in format "day-month-year"
 */
export const purchaseDateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(
    (value) => {
      const parsedDate = parseDateStringToDate(value);
      if (!parsedDate) {
        return false;
      }
      return isDateOnOrAfterMinimum(parsedDate);
    },
    {
      message:
        'Enter a valid date on or after 06/04/2023 in the format day-month-year',
    },
  );

/**
 * Checks for missing date components and returns appropriate error message
 */
const getMissingComponentsError = (
  missingDay: boolean,
  missingMonth: boolean,
  missingYear: boolean,
  errorMessages: PurchaseDateErrorMessages,
): string | undefined => {
  if (missingDay && missingMonth && missingYear) {
    return errorMessages.required;
  }
  if (missingDay && missingMonth) {
    return errorMessages.missingDayMonth;
  }
  if (missingDay && missingYear) {
    return errorMessages.missingDayYear;
  }
  if (missingMonth && missingYear) {
    return errorMessages.missingMonthYear;
  }
  if (missingDay) {
    return errorMessages.missingDay;
  }
  if (missingMonth) {
    return errorMessages.missingMonth;
  }
  if (missingYear) {
    return errorMessages.missingYear;
  }
  return undefined;
};

/**
 * Validates the parsed date components
 */
const validateParsedDate = (
  components: DateComponents,
  errorMessages: PurchaseDateErrorMessages,
): string | undefined => {
  const { day, month, year } = components;

  if (!isValidCalendarDate(day, month, year)) {
    return errorMessages.invalid;
  }

  const parsedDateObj = parse(
    `${day}-${month}-${year}`,
    'd-M-yyyy',
    new Date(),
  );

  if (!parsedDateObj || !isValid(parsedDateObj)) {
    return errorMessages.invalid;
  }

  if (!isDateOnOrAfterMinimum(parsedDateObj)) {
    return errorMessages.tooEarly;
  }

  return undefined;
};

/**
 * Analyses partial date input and generates dynamic error messages
 */
export const validatePurchaseDateDynamic = (
  value: string,
  errorMessages: PurchaseDateErrorMessages,
): string | undefined => {
  if (!value || value.trim() === '' || value === '--') {
    return errorMessages.required;
  }

  const { missingDay, missingMonth, missingYear } =
    getMissingDateComponents(value);

  const missingError = getMissingComponentsError(
    missingDay,
    missingMonth,
    missingYear,
    errorMessages,
  );
  if (missingError) {
    return missingError;
  }

  const components = parseDateString(value);
  if (!components) {
    return errorMessages.invalid;
  }

  return validateParsedDate(components, errorMessages);
};

/**
 * Validates purchase date and returns both error message and field-specific errors
 * @param value - Date string in format "day-month-year"
 * @param errorMessages - Object containing error messages for different scenarios
 * @returns Object containing error message and field-specific errors
 */
export const validatePurchaseDateWithFieldErrors = (
  value: string,
  errorMessages: PurchaseDateErrorMessages,
): { error?: string; fieldErrors?: DateFieldErrors } => {
  const error = validatePurchaseDateDynamic(value, errorMessages);

  if (!error) {
    return {};
  }

  // Get field-specific errors
  const fieldErrors = getDateFieldErrors(value);

  return {
    error,
    fieldErrors,
  };
};
