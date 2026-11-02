import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { fieldErrorMessages } from '../../data/form-content/errors/errors';
import { FORM_FIELDS } from '../../types/types';
import { FieldValidation } from '../validation/fieldValidation/fieldValidation';

export const addError = (
  errorObj: { errors: ErrorType[] },
  message: string,
) => {
  if (!errorObj.errors.some((e) => e.message === message)) {
    errorObj.errors.push({ message, field: '', question: '' });
  }
};

export const getErrors = (
  inputFieldErrors: FieldValidation,
  z: ReturnType<typeof useTranslation>['z'],
  isInvalidDate: boolean,
  isBeforeMinDate: boolean,
): { errors: ErrorType[] } => {
  const errorObj = { errors: [] as ErrorType[] };
  const fieldErrors = fieldErrorMessages(z);

  const fieldsWithError: string[] = [];
  if (inputFieldErrors?.day) fieldsWithError.push(FORM_FIELDS.day);
  if (inputFieldErrors?.month) fieldsWithError.push(FORM_FIELDS.month);
  if (inputFieldErrors?.year) fieldsWithError.push(FORM_FIELDS.year);

  if (fieldsWithError.length > 0) {
    const key = fieldsWithError.join('');
    const message = (fieldErrors as Record<string, string>)[key];
    if (message) {
      addError(errorObj, message);
    }
    return errorObj;
  }

  if (isInvalidDate) {
    if (fieldErrors.invalidDate) {
      addError(errorObj, fieldErrors.invalidDate);
    }
    return errorObj;
  }

  if (isBeforeMinDate) {
    if (fieldErrors.dueDateMin) {
      addError(errorObj, fieldErrors.dueDateMin);
    }
  }

  return errorObj;
};
