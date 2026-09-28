import {
  getDateFieldAnchor,
  transformErrorsForSummary,
} from './getDateFieldAnchor';
import { DateFieldErrors } from './types';

describe('getDateFieldAnchor', () => {
  it('returns day when no field errors provided', () => {
    expect(getDateFieldAnchor()).toBe('day');
  });

  it('returns specific field when only one field has error', () => {
    expect(getDateFieldAnchor({ day: true })).toBe('day');
    expect(getDateFieldAnchor({ month: true })).toBe('month');
    expect(getDateFieldAnchor({ year: true })).toBe('year');
  });

  it('returns first error field in logical order when multiple fields have errors', () => {
    expect(getDateFieldAnchor({ day: true, month: true })).toBe('day');
    expect(getDateFieldAnchor({ month: true, year: true })).toBe('month');
    expect(getDateFieldAnchor({ day: true, year: true })).toBe('day');
    expect(getDateFieldAnchor({ day: true, month: true, year: true })).toBe(
      'day',
    );
  });
});

describe('transformErrorsForSummary', () => {
  it('returns errors unchanged when no purchaseDate error', () => {
    const errors = {
      buyerType: ['Select a buyer type'],
      price: ['Enter a price'],
    };
    expect(transformErrorsForSummary(errors)).toEqual(errors);
  });

  it('transforms purchaseDate error to day field when only day has error', () => {
    const errors = {
      purchaseDate: ['Enter a valid day'],
    };
    const fieldErrors = {
      purchaseDate: { day: true } as DateFieldErrors,
    };
    expect(transformErrorsForSummary(errors, fieldErrors)).toEqual({
      day: ['Enter a valid day'],
    });
  });

  it('transforms purchaseDate error to month field when only month has error', () => {
    const errors = {
      purchaseDate: ['Enter a valid month'],
    };
    const fieldErrors = {
      purchaseDate: { month: true } as DateFieldErrors,
    };
    expect(transformErrorsForSummary(errors, fieldErrors)).toEqual({
      month: ['Enter a valid month'],
    });
  });

  it('transforms purchaseDate error to year field when only year has error', () => {
    const errors = {
      purchaseDate: ['Enter a valid year'],
    };
    const fieldErrors = {
      purchaseDate: { year: true } as DateFieldErrors,
    };
    expect(transformErrorsForSummary(errors, fieldErrors)).toEqual({
      year: ['Enter a valid year'],
    });
  });

  it('transforms purchaseDate error to first error field when multiple fields have errors', () => {
    const errors = {
      purchaseDate: ['Enter a valid month and year'],
    };
    const fieldErrors = {
      purchaseDate: { month: true, year: true } as DateFieldErrors,
    };
    expect(transformErrorsForSummary(errors, fieldErrors)).toEqual({
      month: ['Enter a valid month and year'],
    });
  });

  it('preserves other errors alongside transformed purchaseDate error', () => {
    const errors = {
      buyerType: ['Select a buyer type'],
      purchaseDate: ['Enter a valid month'],
      price: ['Enter a price'],
    };
    const fieldErrors = {
      purchaseDate: { month: true } as DateFieldErrors,
    };
    expect(transformErrorsForSummary(errors, fieldErrors)).toEqual({
      buyerType: ['Select a buyer type'],
      month: ['Enter a valid month'],
      price: ['Enter a price'],
    });
  });

  it('does not duplicate error if target field already has error', () => {
    const errors = {
      purchaseDate: ['Enter a valid date'],
      day: ['Day is required'],
    };
    const fieldErrors = {
      purchaseDate: { day: true } as DateFieldErrors,
    };
    expect(transformErrorsForSummary(errors, fieldErrors)).toEqual({
      day: ['Day is required'],
    });
  });
});
