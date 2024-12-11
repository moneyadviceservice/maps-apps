import {
  MAC_MAX_INTEREST,
  MAC_MIN_INTEREST,
  MAC_REPAYMENT_TERM_MAX,
  MAC_REPAYMENT_TERM_MIN,
} from 'data/mortgage-affordability/CONSTANTS';
import {
  resultErrors,
  ResultFieldKeys,
} from 'data/mortgage-affordability/results';
import { formatCurrency } from 'utils/formatCurrency';
import { replacePlaceholder } from 'utils/replacePlaceholder';

const borrowAmountValidation = (
  value: number,
  field: ResultFieldKeys,
  lang: 'en' | 'cy',
  bounds?: { lower: number; upper: number },
) => {
  let errorMessage = '';

  if (bounds) {
    const isValid =
      bounds.lower &&
      value >= bounds.lower &&
      bounds.upper &&
      value <= bounds.upper;
    if (!isValid) {
      errorMessage = replacePlaceholder(
        'lowerBound',
        formatCurrency(bounds.lower, 0),
        resultErrors[lang][field],
      );
      errorMessage = replacePlaceholder(
        'upperBound',
        formatCurrency(bounds.upper, 0),
        errorMessage,
      );
    }
  }

  return errorMessage;
};

const termValidation = (
  value: number,
  field: ResultFieldKeys,
  lang: 'en' | 'cy',
) => {
  const isValid =
    value >= MAC_REPAYMENT_TERM_MIN && value <= MAC_REPAYMENT_TERM_MAX;
  if (!isValid) {
    return `${resultErrors[lang][field]}`;
  }
  return '';
};

const interestValidation = (
  value: number,
  field: ResultFieldKeys,
  lang: 'en' | 'cy',
) => {
  const isValid = value >= MAC_MIN_INTEREST && value <= MAC_MAX_INTEREST;
  if (!isValid) {
    return `${resultErrors[lang][field]}`;
  }
  return '';
};

export const validationFunctions: {
  [key: string]: (
    value: number,
    field: ResultFieldKeys,
    lang: 'en' | 'cy',
    bounds?: { lower: number; upper: number },
  ) => string;
} = {
  [ResultFieldKeys.BORROW_AMOUNT]: borrowAmountValidation,
  [ResultFieldKeys.INTEREST]: interestValidation,
  [ResultFieldKeys.TERM]: termValidation,
};
