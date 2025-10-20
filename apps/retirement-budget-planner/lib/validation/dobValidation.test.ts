import z from 'zod';
import {
  isDobEmpty,
  validateDobEmpty,
  validateDobFieldPresence,
  validateDobAgeRange,
} from './dobValidation';

describe('dobValidation', () => {
  let ctx: z.RefinementCtx;

  beforeEach(() => {
    ctx = { addIssue: jest.fn() } as unknown as z.RefinementCtx;
  });

  describe('isDobEmpty', () => {
    test('returns true when all fields are undefined', () => {
      expect(isDobEmpty({})).toBe(true);
    });

    test('returns true when all fields are empty strings', () => {
      expect(isDobEmpty({ day: '', month: '', year: '' })).toBe(true);
    });

    test('returns false when any field is present', () => {
      expect(isDobEmpty({ day: '1' })).toBe(false);
      expect(isDobEmpty({ month: '1' })).toBe(false);
      expect(isDobEmpty({ year: '2000' })).toBe(false);
    });
  });

  describe('validateDobEmpty', () => {
    test('adds dob-empty issue and returns true when dob is empty', () => {
      const result = validateDobEmpty({}, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'custom',
          message: 'dob-empty',
          path: [],
        }),
      );
    });

    test('does not add issue and returns false when dob not empty', () => {
      const result = validateDobEmpty({ day: '1' }, ctx);
      expect(result).toBe(false);
      expect(ctx.addIssue).not.toHaveBeenCalled();
    });
  });

  describe('validateDobFieldPresence', () => {
    test('reports missing day', () => {
      const dob = { month: '1', year: '2000' };
      const result = validateDobFieldPresence(dob, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'custom',
          message: 'day-empty',
          path: ['day'],
        }),
      );
    });

    test('reports missing month', () => {
      const dob = { day: '1', year: '2000' };
      const result = validateDobFieldPresence(dob, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'custom',
          message: 'month-empty',
          path: ['month'],
        }),
      );
    });

    test('reports missing year', () => {
      const dob = { day: '1', month: '1' };
      const result = validateDobFieldPresence(dob, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 'custom',
          message: 'year-empty',
          path: ['year'],
        }),
      );
    });

    test('only reports first missing field (day has priority)', () => {
      const dob = { month: undefined as unknown as string, year: '2000' };
      const result = validateDobFieldPresence(dob, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledTimes(1);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'day-empty', path: ['day'] }),
      );
    });

    test('returns false and does not add issue when all fields present', () => {
      const dob = { day: '1', month: '1', year: '2000' };
      const result = validateDobFieldPresence(dob, ctx);
      expect(result).toBe(false);
      expect(ctx.addIssue).not.toHaveBeenCalled();
    });
  });

  describe('validateDobAgeRange', () => {
    const today = new Date();
    const makeDobForAge = (age: number) => {
      const year = today.getFullYear() - age;
      const month = today.getMonth() + 1; // 1-based
      const day = today.getDate();
      return { day: String(day), month: String(month), year: String(year) };
    };

    test('handles invalid date without adding age-range issue', () => {
      const dob = { day: '31', month: '2', year: '2000' }; // Feb 31st invalid
      const result = validateDobAgeRange(dob, ctx);
      // The validator currently normalises invalid dates (Date will roll over),
      // so it does not treat this as an age-range error; ensure the test
      // reflects that behaviour.
      expect(result).toBe(false);
      expect(ctx.addIssue).not.toHaveBeenCalled();
    });

    test('adds issue when age is under 18', () => {
      const dob = makeDobForAge(17);
      const result = validateDobAgeRange(dob, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'dob-age-range' }),
      );
    });

    test('adds issue when age is over 74', () => {
      const dob = makeDobForAge(75);
      const result = validateDobAgeRange(dob, ctx);
      expect(result).toBe(true);
      expect(ctx.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'dob-age-range' }),
      );
    });

    test('does not add issue for age within range (e.g., 30)', () => {
      const dob = makeDobForAge(30);
      const result = validateDobAgeRange(dob, ctx);
      expect(result).toBe(false);
      expect(ctx.addIssue).not.toHaveBeenCalled();
    });

    test('boundary ages 18 and 74 are valid', () => {
      const dob18 = makeDobForAge(18);
      const dob74 = makeDobForAge(74);

      expect(validateDobAgeRange(dob18, ctx)).toBe(false);
      expect(ctx.addIssue).not.toHaveBeenCalled();

      // reset mock between checks
      (ctx.addIssue as jest.Mock).mockClear();

      expect(validateDobAgeRange(dob74, ctx)).toBe(false);
      expect(ctx.addIssue).not.toHaveBeenCalled();
    });
  });
});
