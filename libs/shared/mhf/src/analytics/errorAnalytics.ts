import {
  AnalyticsData,
  EventErrorDetails,
} from '@maps-react/hooks/useAnalytics';

import { FormError } from '../types';

export type BuildErrorDetailsArgs = {
  errors?: FormError;
  step: string;
  tEn: (key: string) => string;
  errorStepName: string;
};

/**
 * Builds an array of error details for analytics based on the provided errors and step.
 * @param {Record<string, string[]>} errors - An object containing form errors.
 * @param {string} step - The current step in the form.
 * @param {function} tEn - Translation function for English.
 * @param {string} errorStepName - The name of the error step. (see constants.ts in the app using this)
 * @return {EventErrorDetails[]} An array of error details for analytics.
 */
export const buildErrorDetails = ({
  errors,
  step,
  tEn,
  errorStepName,
}: BuildErrorDetailsArgs): EventErrorDetails[] => {
  if (!errors || Object.keys(errors).length === 0) return [];

  if (step === errorStepName) {
    const errorMsg = errors['error-page']?.[0] ?? '';
    return [
      {
        reactCompType: tEn(`components.${step}.title`),
        reactCompName: 'error-page',
        errorMessage: errorMsg,
      },
    ];
  }

  return Object.entries(errors).flatMap(([field, errorKeys]) =>
    errorKeys.map((errorKey) => ({
      reactCompType: tEn(`components.${step}.title`),
      reactCompName: field,
      errorMessage: tEn(`components.${step}.form.${errorKey}.error`),
    })),
  );
};

export const emitErrorEventIfAny = (
  addEvent: (data: AnalyticsData) => void,
  errorDetails: EventErrorDetails[],
) => {
  if (!errorDetails.length) return;
  addEvent({
    event: 'errorMessage',
    eventInfo: { errorDetails },
  });
};
