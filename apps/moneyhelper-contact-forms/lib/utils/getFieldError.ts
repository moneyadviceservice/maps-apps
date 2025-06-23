import { FormError } from '../types';

/**
 * Retrieves the errors for a specific field in the form.
 * @param errors - The array of form errors.
 * @param field - The field to retrieve errors for.
 * @returns {FormError[] | undefined} - The errors for the field, or undefined if no errors exist.
 */
export const getFieldError = (
  errors: FormError[] | undefined,
  field: string,
): FormError[] | undefined => {
  const fieldErrors = errors?.filter((error) => error.field === field);
  return fieldErrors && fieldErrors.length > 0 ? fieldErrors : undefined;
};
