import { getPrefix } from 'utils/getPrefix';

import { ErrorDetails } from '@maps-react/hooks/useAnalytics';
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
import { FORM_FIELDS, QuestionData } from '../../data/questions/types';
import { getInputType } from '../getInputType';
import { FLOW } from '../getQuestions';

type Translation = ReturnType<typeof useTranslation>['z'];

export const getErrorKey = (
  question: QuestionData | undefined,
  defaultKey: string,
) => {
  if (question?.isRadio) {
    const firstNonDisabledAnswerIndex = question?.answers.findIndex(
      (answer) => !answer.disabled,
    );
    return firstNonDisabledAnswerIndex === -1
      ? `${defaultKey}-group`
      : `id-${firstNonDisabledAnswerIndex}`;
  }
  return defaultKey;
};

export const getErrors = (
  flow: FLOW,
  hasErrors: Record<string, boolean>,
  z: Translation,
  currentStep: number,
  hasError: boolean,
  question?: QuestionData,
): {
  errors: ErrorType[];
  pageErrors: PageErrors;
  acdlErrors: ErrorDetails[];
} => {
  const errorObj = {
    errors: [] as ErrorType[],
    pageErrors: {} as PageErrors,
    acdlErrors: [] as ErrorDetails[],
  };

  if (!hasError) {
    return errorObj;
  }

  const getFieldErrors = () => {
    const fieldErrors = [] as ErrorType[];
    const acdlErrors = [] as ErrorDetails[];
    const pageErrors = Object.keys(hasErrors).reduce((errors, field) => {
      if (hasErrors[field]) {
        const errMessages = fieldErrorMessages(z);
        let message =
          errMessages[field as keyof typeof FORM_FIELDS] ?? errMessages.default;
        if (field === FORM_FIELDS.postcode && hasErrors['postcode-format']) {
          message = formatErrors(z)['postcode-format'] ?? '';
        }
        if (message) {
          errors[getErrorKey(question, field)] = [message];
          fieldErrors.push({ question: field, message });
          acdlErrors.push({
            fieldType: getInputType(field),
            fieldName: field,
            errorMessage: message,
          });
        }
      }
      return errors;
    }, {} as PageErrors);

    return { fieldErrors, pageErrors, acdlErrors };
  };

  const getGenericError = (
    errorMessagesFn: (z: Translation) => ErrorType[],
  ) => {
    const errMessages = errorMessagesFn(z);
    const errorObject =
      errMessages.find((error) => error.question === currentStep) ||
      errMessages.find((error) => error.question === 0);
    const prefix = getPrefix(flow);

    return {
      errors: errMessages,
      pageErrors: errorObject?.message
        ? {
            [getErrorKey(question, `${prefix}${currentStep}`)]: [
              errorObject.message,
            ],
          }
        : {},
      acdlErrors: [
        {
          fieldType: getInputType(`${currentStep}`),
          fieldName: question?.title,
          errorMessage: errorObject?.message,
        },
      ],
    };
  };

  switch (flow) {
    case FLOW.START: {
      const errorMessagesFn = errorMessages;
      const { errors, pageErrors, acdlErrors } =
        getGenericError(errorMessagesFn);
      errorObj.errors = errors;
      errorObj.pageErrors = pageErrors;
      errorObj.acdlErrors = acdlErrors;

      break;
    }
    case FLOW.ONLINE:
    case FLOW.TELEPHONE: {
      if (Object.keys(hasErrors).length) {
        const { fieldErrors, pageErrors, acdlErrors } = getFieldErrors();

        errorObj.errors = fieldErrors;
        errorObj.pageErrors = pageErrors;
        errorObj.acdlErrors = acdlErrors;
      } else {
        const genErrorMessages =
          flow === FLOW.ONLINE
            ? onlineGenErrorMessages
            : telephoneGenErrorMessages;
        const { errors, pageErrors, acdlErrors } =
          getGenericError(genErrorMessages);
        errorObj.errors = errors;
        errorObj.pageErrors = pageErrors;
        errorObj.acdlErrors = acdlErrors;
      }

      break;
    }
  }
  return errorObj;
};
