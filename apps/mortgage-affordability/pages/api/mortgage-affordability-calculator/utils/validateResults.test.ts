import {
  ResultFieldKeys,
  resultPrefix,
} from 'data/mortgage-affordability/results';
import { validationFunctions } from 'utils/MortgageAffordabilityCalculator/validation';

import { validateResults } from './validateResults';

jest.mock('utils/MortgageAffordabilityCalculator/validation');

describe('validateResults', () => {
  const lang = 'en';
  const validation = { bounds: { lower: 0, upper: 1000000 } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid when there are no validation errors', () => {
    const formData = {
      [`${resultPrefix}${ResultFieldKeys.BORROW_AMOUNT}`]: '500000',
      [`${resultPrefix}${ResultFieldKeys.TERM}`]: '25',
      [`${resultPrefix}${ResultFieldKeys.INTEREST}`]: '3.5',
    };

    validationFunctions[ResultFieldKeys.BORROW_AMOUNT] = jest
      .fn()
      .mockReturnValue(null);
    validationFunctions[ResultFieldKeys.TERM] = jest.fn().mockReturnValue(null);
    validationFunctions[ResultFieldKeys.INTEREST] = jest
      .fn()
      .mockReturnValue(null);

    const result = validateResults(formData, lang, validation);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(
      validationFunctions[ResultFieldKeys.BORROW_AMOUNT],
    ).toHaveBeenCalledWith(
      500000,
      ResultFieldKeys.BORROW_AMOUNT,
      lang,
      validation.bounds,
    );
    expect(validationFunctions[ResultFieldKeys.TERM]).toHaveBeenCalledWith(
      25,
      ResultFieldKeys.TERM,
      lang,
      validation.bounds,
    );
    expect(validationFunctions[ResultFieldKeys.INTEREST]).toHaveBeenCalledWith(
      3.5,
      ResultFieldKeys.INTEREST,
      lang,
      validation.bounds,
    );
  });

  it('should return errors when there are validation errors', () => {
    const formData = {
      [`${resultPrefix}${ResultFieldKeys.BORROW_AMOUNT}`]: '1500000',
      [`${resultPrefix}${ResultFieldKeys.TERM}`]: '35',
      [`${resultPrefix}${ResultFieldKeys.INTEREST}`]: '5.5',
    };

    validationFunctions[ResultFieldKeys.BORROW_AMOUNT] = jest
      .fn()
      .mockReturnValue('Borrow amount too high');
    validationFunctions[ResultFieldKeys.TERM] = jest.fn().mockReturnValue(null);
    validationFunctions[ResultFieldKeys.INTEREST] = jest
      .fn()
      .mockReturnValue('Interest rate too high');

    const result = validateResults(formData, lang, validation);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      [`${ResultFieldKeys.BORROW_AMOUNT}`]: 'condition',
      [`${ResultFieldKeys.INTEREST}`]: 'condition',
    });
    expect(
      validationFunctions[ResultFieldKeys.BORROW_AMOUNT],
    ).toHaveBeenCalledWith(
      1500000,
      ResultFieldKeys.BORROW_AMOUNT,
      lang,
      validation.bounds,
    );
    expect(validationFunctions[ResultFieldKeys.TERM]).toHaveBeenCalledWith(
      35,
      ResultFieldKeys.TERM,
      lang,
      validation.bounds,
    );
    expect(validationFunctions[ResultFieldKeys.INTEREST]).toHaveBeenCalledWith(
      5.5,
      ResultFieldKeys.INTEREST,
      lang,
      validation.bounds,
    );
  });

  it('should not validate fields that do not have a validation function', () => {
    const formData = {
      [`${resultPrefix}${ResultFieldKeys.BORROW_AMOUNT}`]: '250000',
      [`${resultPrefix}${ResultFieldKeys.TERM}`]: '30',
      [`${resultPrefix}${ResultFieldKeys.INTEREST}`]: '4.0',
    };

    delete validationFunctions[ResultFieldKeys.BORROW_AMOUNT];
    validationFunctions[ResultFieldKeys.TERM] = jest.fn().mockReturnValue(null);
    validationFunctions[ResultFieldKeys.INTEREST] = jest
      .fn()
      .mockReturnValue(null);

    const result = validateResults(formData, lang, validation);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(validationFunctions[ResultFieldKeys.TERM]).toHaveBeenCalledWith(
      30,
      ResultFieldKeys.TERM,
      lang,
      validation.bounds,
    );
    expect(validationFunctions[ResultFieldKeys.INTEREST]).toHaveBeenCalledWith(
      4.0,
      ResultFieldKeys.INTEREST,
      lang,
      validation.bounds,
    );
  });

  it('should handle empty formData gracefully', () => {
    const formData = {};

    validationFunctions[ResultFieldKeys.BORROW_AMOUNT] = jest
      .fn()
      .mockReturnValue('Field is required');
    validationFunctions[ResultFieldKeys.TERM] = jest
      .fn()
      .mockReturnValue('Field is required');
    validationFunctions[ResultFieldKeys.INTEREST] = jest
      .fn()
      .mockReturnValue('Field is required');

    const result = validateResults(formData, lang, validation);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      [`${ResultFieldKeys.BORROW_AMOUNT}`]: 'condition',
      [`${ResultFieldKeys.TERM}`]: 'condition',
      [`${ResultFieldKeys.INTEREST}`]: 'condition',
    });
  });
});
