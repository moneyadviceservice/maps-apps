import { useTranslation } from '@maps-react/hooks/useTranslation';

import {
  errorMessages,
  ErrorType,
  fieldErrorMessages,
  formatErrors,
  onlineGenErrorMessages,
  PageErrors,
  telephoneGenErrorMessages,
} from '../../data/errors';
import { FORM_FIELDS } from '../../data/questions/types';
import { FLOW } from '../getQuestions';

type Translation = ReturnType<typeof useTranslation>['z'];

export const getErrors = (
  flow: FLOW,
  hasErrors: Record<string, boolean>,
  z: Translation,
  currentStep: number,
  hasError: boolean,
): {
  errors: ErrorType[];
  pageErrors: PageErrors;
} => {
  const errorObj = {
    errors: [] as ErrorType[],
    pageErrors: {} as PageErrors,
  };

  if (!hasError) {
    return errorObj;
  }

  const getFieldErrors = () => {
    const fieldErrors = [] as ErrorType[];
    const pageErrors = Object.keys(hasErrors).reduce((errors, field) => {
      if (hasErrors[field]) {
        const errMessages = fieldErrorMessages(z);
        let message =
          errMessages[field as keyof typeof FORM_FIELDS] ?? errMessages.default;
        if (field === FORM_FIELDS.postcode && hasErrors['postcode-format']) {
          message = formatErrors(z)['postcode-format'] ?? '';
        }
        if (message) {
          errors[field] = [message];
          fieldErrors.push({ question: field, message });
        }
      }
      return errors;
    }, {} as PageErrors);

    return { fieldErrors, pageErrors };
  };

  const getGenericError = (
    errorMessagesFn: (z: Translation) => ErrorType[],
  ) => {
    const errMessages = errorMessagesFn(z);
    const errorObject =
      errMessages.find((error) => error.question === currentStep) ||
      errMessages.find((error) => error.question === 0);

    return {
      errors: errMessages,
      pageErrors: errorObject?.message
        ? { [currentStep]: [errorObject.message] }
        : {},
    };
  };

  switch (flow) {
    case FLOW.START: {
      const errorMessagesFn = errorMessages;
      const { errors, pageErrors } = getGenericError(errorMessagesFn);
      errorObj.errors = errors;
      errorObj.pageErrors = pageErrors;

      break;
    }
    case FLOW.ONLINE:
    case FLOW.TELEPHONE: {
      if (Object.keys(hasErrors).length) {
        const { fieldErrors, pageErrors } = getFieldErrors();

        errorObj.errors = fieldErrors;
        errorObj.pageErrors = pageErrors;
      } else {
        const genErrorMessages =
          flow === FLOW.ONLINE
            ? onlineGenErrorMessages
            : telephoneGenErrorMessages;
        const { errors, pageErrors } = getGenericError(genErrorMessages);
        errorObj.errors = errors;
        errorObj.pageErrors = pageErrors;
      }

      break;
    }
  }
  return errorObj;
};
