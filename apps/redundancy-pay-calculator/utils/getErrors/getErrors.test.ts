import { getErrors } from '.';
import { useTranslation } from '../../../../libs/shared/hooks';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key),
  })),
}));

jest.mock('../../data/form-content/errors', () => ({
  fieldErrorMessages: jest.fn((z) => ({
    day: 'Enter a valid day',
    month: 'Enter a valid month',
    year: 'Enter a valid year',
    daymonth: 'Enter a valid day and month',
    dayyear: 'Enter a valid day and year',
    monthyear: 'Enter a valid month and year',
    daymonthyear: 'Enter a valid day, month, and year',
    userAtLeast15YearsOld:
      'Your employment must have started when you were at least 15 years old',
    employmentStartDateAfterRedundancyDate:
      'Employment start date cannot be after redundancy date',
    employmentStartDateInFuture:
      'Employment start date cannot be in the future',
    salary: 'Error for salary',
    additionalRedundancyPay: 'Error for additional redundancy pay',
    underAge:
      'Your employment must have started when you were at least 15 years old',
  })),
  radioInputsErrorMessages: jest.fn(() => [
    { question: 1, message: 'Select where you live in the UK' },
    { question: 6, message: 'Choose an option' },
  ]),
}));

describe('getErrors', () => {
  const { z } = useTranslation();

  it('should return day error when missing day for question 2', () => {
    const inputFieldErrors = { day: true };
    const result = getErrors(2, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid day');
  });

  it('should return month error when missing month for question 2', () => {
    const inputFieldErrors = { month: true };
    const result = getErrors(2, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid month');
  });

  it('should return year error when missing year for question 2', () => {
    const inputFieldErrors = { year: true };
    const result = getErrors(2, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid year');
  });

  it('should return date error when invalid day and year for question 2', () => {
    const inputFieldErrors = { day: true, year: true };
    const result = getErrors(2, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid day and year');
  });

  it('should return date error when invalid month and year for question 2', () => {
    const inputFieldErrors = { month: true, year: true };
    const result = getErrors(2, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid month and year');
  });

  it('should return date error when invalid day, month and year for question 2', () => {
    const inputFieldErrors = { day: true, month: true, year: true };
    const result = getErrors(2, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid day, month, and year');
  });

  it('should return date error when invalid month and year for question 3', () => {
    const inputFieldErrors = { month: true, year: true };
    const result = getErrors(3, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid month and year');
  });

  it('should return date error when invalid month and year for question 4', () => {
    const inputFieldErrors = { month: true, year: true };
    const result = getErrors(4, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe('Enter a valid month and year');
  });

  it('should return multiple errors for question 4 if has future start date', () => {
    const inputFieldErrors = {
      employmentStartDateInFuture: true,
    };
    const result = getErrors(4, inputFieldErrors, true, z);

    expect(result.errors[0].message).toBe(
      'Employment start date cannot be in the future',
    );
  });

  it('should return error if user less than 15 years old', () => {
    const inputFieldErrors = {
      userAtLeast15YearsOld: true,
    };
    const result = getErrors(4, inputFieldErrors, true, z);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe(
      'Your employment must have started when you were at least 15 years old',
    );
  });

  it('should return salary error for question 5', () => {
    const inputFieldErrors = { salary: true };
    const result = getErrors(5, inputFieldErrors, true, z);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('Error for salary');
  });

  it('should return error when radio input is missing for question 1', () => {
    const inputFieldErrors = { error: true };
    const result = getErrors(1, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toBe('Select where you live in the UK');
  });

  it('should return error when radio input is missing for question 6', () => {
    const inputFieldErrors = { error: true };
    const result = getErrors(6, inputFieldErrors, true, z);

    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toBe('Choose an option');
  });

  it('should return redundancy pay error for question 7', () => {
    const inputFieldErrors = { additionalRedundancyPay: true };
    const result = getErrors(7, inputFieldErrors, true, z);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe(
      'Error for additional redundancy pay',
    );
  });
});
