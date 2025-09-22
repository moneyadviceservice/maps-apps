import { getErrors, addError } from './getErrors';
import { ErrorType } from '@maps-react/form/types';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn(),
  }),
}));

jest.mock('../../data/form-content/errors/errors', () => ({
  fieldErrorMessages: jest.fn(() => ({
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
  const { z } = jest
    .requireMock('@maps-react/hooks/useTranslation')
    .useTranslation();

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
      fieldErrorMessages: jest.fn(() => ({})),
    }));

    const { getErrors } = require('./getErrors');
    const result = getErrors({ day: true }, z, false, false);
    expect(result.errors.length).toBe(0);
  });

  it('does not add invalidDate error if fieldErrors.invalidDate is missing', () => {
    jest.resetModules();
    jest.doMock('../../data/form-content/errors/errors', () => ({
      fieldErrorMessages: jest.fn(() => ({
        day: 'Day is required',
        dueDateMin: 'Date is too far in the past',
      })),
    }));

    const { getErrors } = require('./getErrors');
    const result = getErrors(
      { day: false, month: false, year: false },
      z,
      true,
      false,
    );
    expect(result.errors.length).toBe(0);
  });
});
