import type { RefinementCtx } from 'zod';
import {
  isDobEmpty,
  validateDobEmpty,
  validateDobFieldPresence,
  validateDobInvalidDate,
  validateDobAgeRange,
} from './dobValidation';

describe('dobValidation', () => {
  const makeCtx = () => {
    const addIssue = jest.fn();
    const ctx = { addIssue } as unknown as RefinementCtx;
    return { ctx, addIssue };
  };

  let ctx: RefinementCtx;
  let addIssue: jest.Mock;

  const expectAddIssueCalledWith = (
    partial: Partial<Record<string, unknown>>,
  ) => expect(addIssue).toHaveBeenCalledWith(expect.objectContaining(partial));

  beforeEach(() => {
    const m = makeCtx();
    ctx = m.ctx;
    addIssue = m.addIssue;
  });

  describe('isDobEmpty', () => {
    test.each([
      [{}, true],
      [{ day: '', month: '', year: '' }, true],
      [{ day: '1' }, false],
      [{ month: '1' }, false],
      [{ year: '2000' }, false],
    ])('returns %p for input %p', (input, expected) => {
      expect(isDobEmpty(input as Record<string, string>)).toBe(expected);
    });
  });

  describe('validateDobEmpty', () => {
    test('adds dob-empty issue and returns true when all fields empty', () => {
      const result = validateDobEmpty({ day: '', month: '', year: '' }, ctx);
      expect(result).toBe(true);
      expect(addIssue).toHaveBeenCalledTimes(1);
      expectAddIssueCalledWith({ code: 'custom', message: 'dob-empty' });
    });

    test('does not add issue and returns false when not empty', () => {
      const result = validateDobEmpty({ day: '1', month: '', year: '' }, ctx);
      expect(result).toBe(false);
      expect(addIssue).not.toHaveBeenCalled();
    });
  });

  describe('validateDobFieldPresence', () => {
    test.each([
      [
        { day: '', month: '1', year: '2000' },
        { message: 'day-invalid', path: ['day'] },
      ],
      [
        { day: '32', month: '1', year: '2000' },
        { message: 'day-invalid', path: ['day'] },
      ],
      [
        { day: '1', month: '', year: '2000' },
        { message: 'month-invalid', path: ['month'] },
      ],
      [
        { day: '1', month: '13', year: '2000' },
        { message: 'month-invalid', path: ['month'] },
      ],
      [
        { day: '1', month: '1', year: '1899' },
        { message: 'year-invalid', path: ['year'] },
      ],
    ])('flags invalid field for %p', (input, expectedPartial) => {
      const result = validateDobFieldPresence(
        input as Record<string, string>,
        ctx,
      );
      expect(result).toBe(true);
      expectAddIssueCalledWith(expectedPartial);
    });

    test('returns false when fields are present and within ranges', () => {
      const result = validateDobFieldPresence(
        { day: '15', month: '6', year: '1980' },
        ctx,
      );
      expect(result).toBe(false);
      expect(addIssue).not.toHaveBeenCalled();
    });
  });

  describe('validateDobInvalidDate', () => {
    test('flags invalid calendar date (e.g., 31 April)', () => {
      const result = validateDobInvalidDate(
        { day: '31', month: '4', year: '2000' },
        ctx,
      );

      expect(result).toBe(true);
      expect(addIssue).toHaveBeenCalled();
    });

    test('does not flag a valid date', () => {
      const result = validateDobInvalidDate(
        { day: '30', month: '4', year: '2000' },
        ctx,
      );
      expect(result).toBe(false);
      expect(addIssue).not.toHaveBeenCalled();
    });
  });

  describe('validateDobAgeRange', () => {
    const toDob = (d: Date) => ({
      day: String(d.getDate()),
      month: String(d.getMonth() + 1),
      year: String(d.getFullYear()),
    });

    test('flags under 18', () => {
      const now = new Date();
      const under18 = new Date(now);
      under18.setFullYear(now.getFullYear() - 17); // 17 years old
      const result = validateDobAgeRange(toDob(under18), ctx);
      expect(result).toBe(true);
      expectAddIssueCalledWith({ code: 'custom', message: 'dob-age-range' });
    });

    test('does not flag 18 or older', () => {
      const now = new Date();
      const over18 = new Date(now);
      over18.setFullYear(now.getFullYear() - 20); // 20 years old
      const result = validateDobAgeRange(toDob(over18), ctx);
      expect(result).toBe(false);
      expect(addIssue).not.toHaveBeenCalled();
    });

    test('returns true when age calculation fails (invalid/missing values)', () => {
      const result = validateDobAgeRange({ day: '', month: '', year: '' }, ctx);
      expect(result).toBe(true);
      expectAddIssueCalledWith({ message: 'dob-age-range' });
    });
  });
});
