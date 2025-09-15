import { getErrors, addError } from './getErrors';
import { ErrorType } from '@maps-react/form/types';
import { useTranslation } from '@maps-react/hooks/useTranslation';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    z: jest.fn((key) => key),
  })),
}));

jest.mock('../../data/form-content/errors/errors', () => ({
  fieldErrorMessages: jest.fn((z) => ({
    day: 'Day is required',
    month: 'Month is required',
    year: 'Year is required',
    daymonth: 'Day and month are required',
    daymonthyear: 'Day, month and year are required',
    invalidDate: 'Invalid date',
    dueDateMin: 'Date is too far in the past',
  })),
}));

describe('getErrors', () => {
  const { z } = useTranslation();

  it('returns error for missing day', () => {
    const result = getErrors({ day: true }, z, false, false);
    expect(result.errors[0].message).toBe('Day is required');
  });

  it('returns error for missing month', () => {
    const result = getErrors({ month: true }, z, false, false);
    expect(result.errors[0].message).toBe('Month is required');
  });

  it('returns error for missing year', () => {
    const result = getErrors({ year: true }, z, false, false);
    expect(result.errors[0].message).toBe('Year is required');
  });

  it('returns error for missing day and month', () => {
    const result = getErrors({ day: true, month: true }, z, false, false);
    expect(result.errors[0].message).toBe('Day and month are required');
  });

  it('returns error for missing all fields', () => {
    const result = getErrors(
      { day: true, month: true, year: true },
      z,
      false,
      false,
    );
    expect(result.errors[0].message).toBe('Day, month and year are required');
  });

  it('returns error for invalid date', () => {
    const result = getErrors(
      { day: false, month: false, year: false },
      z,
      true,
      false,
    );
    expect(result.errors[0].message).toBe('Invalid date');
  });

  it('returns error for date before minimum', () => {
    const result = getErrors(
      { day: false, month: false, year: false },
      z,
      false,
      true,
    );
    expect(result.errors[0].message).toBe('Date is too far in the past');
  });

  it('returns no error for valid input', () => {
    const result = getErrors(
      { day: false, month: false, year: false },
      z,
      false,
      false,
    );
    expect(result.errors).toHaveLength(0);
  });
  it('adds error if not present', () => {
    const errorObj: { errors: ErrorType[] } = { errors: [] };
    addError(errorObj, 'Test error');
    expect(errorObj.errors.length).toBe(1);
    expect(errorObj.errors[0].message).toBe('Test error');
  });

  it('does not add duplicate error', () => {
    const errorObj: { errors: ErrorType[] } = {
      errors: [{ message: 'Test error', field: '', question: '' }],
    };
    addError(errorObj, 'Test error');
    expect(errorObj.errors.length).toBe(1);
  });

  it('does not add error if message is undefined', () => {
    jest.resetModules();
    jest.doMock('../../data/form-content/errors/errors', () => ({
      fieldErrorMessages: jest.fn((z) => ({})),
    }));

    const { getErrors } = require('./getErrors');
    const { z } = require('@maps-react/hooks/useTranslation').useTranslation();
    const result = getErrors({ day: true }, z, false, false);
    expect(result.errors.length).toBe(0);
  });

  it('does not add invalidDate error if fieldErrors.invalidDate is missing', () => {
    jest.resetModules();
    jest.doMock('../../data/form-content/errors/errors', () => ({
      fieldErrorMessages: jest.fn((z) => ({
        day: 'Day is required',
        dueDateMin: 'Date is too far in the past',
      })),
    }));

    const { getErrors } = require('./getErrors');
    const { z } = useTranslation();
    const result = getErrors(
      { day: false, month: false, year: false },
      z,
      true,
      false,
    );
    expect(result.errors.length).toBe(0);
  });
});
