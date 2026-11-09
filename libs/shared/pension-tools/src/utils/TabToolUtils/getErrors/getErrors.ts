import { useTranslation } from '@maps-react/hooks/useTranslation';

import { ErrorMessageFunc, Errors } from '../../../types/forms';

type ErrorObj = {
  fieldErrors: Record<string, string[]>;
  pageErrors: Record<string, string[]>;
  acdlErrors: Record<string, string[]>;
};

export const getErrors = <T extends string>(
  errors: Record<string, string>,
  z: ReturnType<typeof useTranslation>['z'],
  errorMessages: Partial<Record<T, ErrorMessageFunc>>,
): ErrorObj => {
  const fieldErrors: Errors = {};
  const pageErrors: Errors = {};
  const acdlErrors: Errors = {};

  const processError = (
    key: string,
    errorType: string,
    errorObj?: ErrorMessageFunc,
  ) => {
    const messages = errorObj?.(z);
    const required = messages?.required;
    const condition = messages?.condition;

    switch (errorType) {
      case 'required':
        fieldErrors[key] = [required?.field ?? ''];
        pageErrors[key] = [required?.page ?? ''];
        acdlErrors[key] = [required?.acdlMessage ?? ''];
        break;
      case 'condition':
        fieldErrors[key] = [condition?.field ?? ''];
        pageErrors[key] = condition?.page ? [condition.page] : [];
        acdlErrors[key] = [condition?.acdlMessage ?? ''];
        break;
      case 'no-message':
        fieldErrors[key] = [''];
        break;
    }
  };

  errors &&
    Object.keys(errors).forEach((key) => {
      if (Object.hasOwn(errors, key)) {
        const errorType = errors[key];
        const errorObj = errorMessages[key as T];
        processError(key, errorType, errorObj);
      }
    });

  return { fieldErrors, pageErrors, acdlErrors };
};
