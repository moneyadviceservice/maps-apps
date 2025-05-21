import { ErrorType } from '@maps-react/common/components/Errors';

import { FormError } from '../types';

/**
 * Checks if an errors exist in the store.
 * Returns an array with an object of type ErrorType if errors exist.
 * If no errors exist, returns an empty array.
 * This is required to satisfy the type requirements of the shared/ui Error component.
 * @param errors - The array of form errors.
 * @param field - The field to check for errors.
 * @returns {Array<ErrorType>}
 */
export const hasFieldError = (
  errors: FormError[] | undefined,
  field: string,
): Array<ErrorType> => {
  const fieldHasError = errors?.some((error) => error.field === field);
  return fieldHasError ? [{} as ErrorType] : [];
};
