import { retirementGuidanceErrorMessages } from 'data/errors';

import { ErrorType } from '@maps-react/form/types';
type ErrorObject = {
  errors: ErrorType[];
  errorFields?: string[];
};
export const getError = (questionNumber: number, hasError: boolean) => {
  const errorObj: ErrorObject = { errors: [] };
  if (!hasError) return errorObj;
  const currentError = retirementGuidanceErrorMessages(questionNumber);
  errorObj.errors.push(...currentError);
  return errorObj;
};
