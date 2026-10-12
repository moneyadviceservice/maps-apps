import { isBeforeMinDate, isValidDate } from '../dateValidation/dateValidation';
import {
  FieldValidation,
  fieldValidation,
} from '../fieldValidation/fieldValidation';

export type ValidationResult = {
  fieldErrors: FieldValidation;
  isInvalidDate: boolean;
  isBeforeMinDate: boolean;
};

export const validateDueDate = (values: {
  day?: string;
  month?: string;
  year?: string;
}): ValidationResult => {
  // Check for empty inputs
  const fieldErrors = fieldValidation(values);

  // Initialize other validation flags
  const result: ValidationResult = {
    fieldErrors,
    isInvalidDate: false,
    isBeforeMinDate: false,
  };

  // Only check full date if we have all fields
  if (!fieldErrors.day && !fieldErrors.month && !fieldErrors.year) {
    const dateString = `${values.day}-${values.month}-${values.year}`;

    // Check if date is valid (e.g., not 31-04-2026)
    result.isInvalidDate = !isValidDate(dateString);

    // Check if date is before minimum allowed (if date is valid)

    if (!result.isInvalidDate) {
      const dateString = `${values.day}-${values.month}-${values.year}`;
      result.isBeforeMinDate = isBeforeMinDate(dateString);
    }
  }

  return result;
};
