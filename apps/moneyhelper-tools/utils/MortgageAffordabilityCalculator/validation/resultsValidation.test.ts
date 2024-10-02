import { ResultFieldKeys } from 'data/mortgage-affordability/results';
import { validationFunctions } from './resultsValidation';

jest.mock('utils/replacePlaceholder', () => ({
  replacePlaceholder: jest.fn((placeholder, value, message) =>
    message.replace(`{${placeholder}}`, value),
  ),
}));

const MAC_REPAYMENT_TERM_MIN = 5;
const MAC_REPAYMENT_TERM_MAX = 40;
const MAC_MIN_INTEREST = 1;
const MAC_MAX_INTEREST = 15;

jest.mock('data/mortgage-affordability/results', () => {
  const ResultFieldKeys = {
    BORROW_AMOUNT: 'borrow-amount',
    TERM: 'term',
    INTEREST: 'interest',
  };
  const resultErrors = {
    en: {
      [ResultFieldKeys.BORROW_AMOUNT]:
        'Borrow amount must be between {lowerBound} and {upperBound}.',
      [ResultFieldKeys.TERM]: `Term must be between 5 and 40 years.`,
      [ResultFieldKeys.INTEREST]: `Interest rate must be between 1% and 15%.`,
    },
    cy: {
      [ResultFieldKeys.BORROW_AMOUNT]:
        'Mae swm y benthyciad rhaid bod rhwng {lowerBound} a {upperBound}.',
      [ResultFieldKeys.TERM]: `Rhaid i'r tymor fod rhwng 5 a 40 o flynyddoedd.`,
      [ResultFieldKeys.INTEREST]: `Rhaid i gyfradd llog fod rhwng 1% a 15%.`,
    },
  };

  return {
    ResultFieldKeys,
    resultErrors,
  };
});

describe('Validation Functions', () => {
  describe('borrowAmountValidation', () => {
    it('should return an empty string for a valid value', () => {
      const result = validationFunctions[ResultFieldKeys.BORROW_AMOUNT](
        150,
        ResultFieldKeys.BORROW_AMOUNT,
        'en',
        { lower: 100, upper: 300 },
      );
      expect(result).toBe('');
    });

    it('should return an error message for an invalid value', () => {
      const result = validationFunctions[ResultFieldKeys.BORROW_AMOUNT](
        50,
        ResultFieldKeys.BORROW_AMOUNT,
        'en',
        { lower: 100, upper: 300 },
      );
      expect(result).toBe('Borrow amount must be between £100 and £300.');
    });
  });

  describe('termValidation', () => {
    it('should return an empty string for a valid value', () => {
      const result = validationFunctions[ResultFieldKeys.TERM](
        24,
        ResultFieldKeys.TERM,
        'en',
      );
      expect(result).toBe('');
    });

    it('should return an error message for an invalid value', () => {
      const result = validationFunctions[ResultFieldKeys.TERM](
        120,
        ResultFieldKeys.TERM,
        'en',
      );
      expect(result).toBe(
        `Term must be between ${MAC_REPAYMENT_TERM_MIN} and ${MAC_REPAYMENT_TERM_MAX} years.`,
      );
    });
  });

  describe('interestValidation', () => {
    it('should return an empty string for a valid value', () => {
      const result = validationFunctions[ResultFieldKeys.INTEREST](
        5,
        ResultFieldKeys.INTEREST,
        'en',
      );
      expect(result).toBe('');
    });

    it('should return an error message for an invalid value', () => {
      const result = validationFunctions[ResultFieldKeys.INTEREST](
        19,
        ResultFieldKeys.INTEREST,
        'en',
      );
      expect(result).toBe(
        `Interest rate must be between ${MAC_MIN_INTEREST}% and ${MAC_MAX_INTEREST}%.`,
      );
    });
  });
});

describe('validationFunctions', () => {
  it('should validate borrow amount correctly', () => {
    const validationFunction =
      validationFunctions[ResultFieldKeys.BORROW_AMOUNT];
    const result = validationFunction(
      150,
      ResultFieldKeys.BORROW_AMOUNT,
      'en',
      { lower: 100, upper: 300 },
    );
    expect(result).toBe('');
  });

  it('should validate term correctly', () => {
    const validationFunction = validationFunctions[ResultFieldKeys.TERM];
    const result = validationFunction(24, ResultFieldKeys.TERM, 'en');
    expect(result).toBe('');
  });

  it('should validate interest correctly', () => {
    const validationFunction = validationFunctions[ResultFieldKeys.INTEREST];
    const result = validationFunction(5, ResultFieldKeys.INTEREST, 'en');
    expect(result).toBe('');
  });
});
