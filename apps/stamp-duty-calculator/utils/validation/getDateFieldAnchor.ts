import { DateFieldErrors } from './types';

/**
 * Determine which field ID to link to based on field errors
 * @param fieldErrors - The field-specific errors for the date
 * @returns The ID of the field to focus on
 */
export const getDateFieldAnchor = (fieldErrors?: DateFieldErrors): string => {
  if (!fieldErrors) {
    return 'day';
  }

  const errorCount = [
    fieldErrors.day,
    fieldErrors.month,
    fieldErrors.year,
  ].filter(Boolean).length;

  // If only one field has an error, link directly to it
  if (errorCount === 1) {
    if (fieldErrors.day) return 'day';
    if (fieldErrors.month) return 'month';
    if (fieldErrors.year) return 'year';
  }

  // For multiple errors, link to the first error field in logical order
  if (fieldErrors.day) return 'day';
  if (fieldErrors.month) return 'month';
  if (fieldErrors.year) return 'year';

  // Default to day if no specific errors (shouldn't happen)
  return 'day';
};

/**
 * Transform errors object to use appropriate field IDs for date fields
 * This ensures the error summary links to the correct input fields
 */
export const transformErrorsForSummary = (
  errors: Record<string, string[]>,
  fieldErrors?: { purchaseDate?: DateFieldErrors },
): Record<string, string[]> => {
  const transformed = { ...errors };

  // If there's a purchaseDate error, determine which field to link to
  if (errors.purchaseDate && errors.purchaseDate.length > 0) {
    const anchor = getDateFieldAnchor(fieldErrors?.purchaseDate);
    delete transformed.purchaseDate;
    if (!transformed[anchor]) {
      transformed[anchor] = errors.purchaseDate;
    }
  }

  return transformed;
};
