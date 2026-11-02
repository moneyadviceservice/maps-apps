import { FormError } from '../types';

/**
 * Retrieves the first error message for a specific field in the error object.
 * @param errors
 * @param field
 * @returns
 */
export const getFieldError = (
  field: string,
  errors?: FormError,
): string | undefined => {
  if (!errors?.[field] || errors[field].length === 0) return undefined;
  return errors[field][0];
};
