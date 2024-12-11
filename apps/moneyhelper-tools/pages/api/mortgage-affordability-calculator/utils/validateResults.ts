import {
  ResultFieldKeys,
  resultPrefix,
} from 'data/mortgage-affordability/results';
import { convertStringToNumber } from 'utils/convertStringToNumber';
import { validationFunctions } from 'utils/MortgageAffordabilityCalculator/validation';

const resultsFields = [
  ResultFieldKeys.BORROW_AMOUNT,
  ResultFieldKeys.TERM,
  ResultFieldKeys.INTEREST,
];

export const validateResults = (
  formData: Record<string, string>,
  lang: 'en' | 'cy',
  validation: { bounds: { lower: number; upper: number } },
) => {
  const errors: { [key: string]: string } = {};

  for (const field of resultsFields) {
    const valueToValidate = formData[`${resultPrefix}${field}`];
    const validationFunction = validationFunctions[field];

    if (validationFunction) {
      const hasError = validationFunction(
        convertStringToNumber(valueToValidate),
        field,
        lang,
        validation.bounds,
      );

      if (hasError) {
        errors[field] = 'condition';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
