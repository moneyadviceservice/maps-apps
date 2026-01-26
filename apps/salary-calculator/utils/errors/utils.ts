import { FieldError } from 'utils/validation';

import useTranslation from '@maps-react/hooks/useTranslation';

import { idMap } from './idmap';
import { errorMessages } from './messages';

export const parseErrors = (
  errors: string | null | undefined,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  try {
    if (errors) {
      const parsedFieldErrors = JSON.parse(errors) as FieldError[];
      const result = {} as Record<string, (string | undefined)[]>;

      if (Array.isArray(parsedFieldErrors)) {
        for (const error of parsedFieldErrors) {
          // Only add valid errors (they exist in the idMap and have an error message)
          if (
            Object.hasOwn(idMap, error.field) &&
            Object.hasOwn(errorMessages, error.type)
          ) {
            result[idMap[error.field]] = [z(errorMessages[error.type])];
          }
        }
      }

      return result;
    }
  } catch (e) {
    // If there are any errors parsing the string then just return undefined and let user handle
    console.warn('Invalid error string', e);
  }

  return undefined;
};
