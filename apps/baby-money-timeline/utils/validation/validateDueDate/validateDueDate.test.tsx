import { validateDueDate } from './validateDueDate';

describe('validateDueDate', () => {
  it('should flag all fields as errors if empty', () => {
    const result = validateDueDate({});
    expect(result.fieldErrors).toEqual({
      day: true,
      month: true,
      year: true,
    });
    expect(result.isInvalidDate).toBe(false);
    expect(result.isBeforeMinDate).toBe(false);
  });

  it('should flag invalid day', () => {
    const result = validateDueDate({ day: '45', month: '12', year: '2025' });
    expect(result.fieldErrors.day).toBe(true);
    expect(result.isInvalidDate).toBe(false);
    expect(result.isBeforeMinDate).toBe(false);
  });

  it('should flag invalid month', () => {
    const result = validateDueDate({ day: '15', month: '13', year: '2025' });
    expect(result.fieldErrors.month).toBe(true);
    expect(result.isInvalidDate).toBe(false);
    expect(result.isBeforeMinDate).toBe(false);
  });

  it('should flag invalid year', () => {
    const result = validateDueDate({ day: '15', month: '12', year: '202' });
    expect(result.fieldErrors.year).toBe(true);
    expect(result.isInvalidDate).toBe(false);
    expect(result.isBeforeMinDate).toBe(false);
  });

  it('should flag invalid full date (e.g., 31-04-2025)', () => {
    const result = validateDueDate({ day: '31', month: '04', year: '2025' });
    expect(result.fieldErrors).toEqual({
      day: false,
      month: false,
      year: false,
    });
    expect(result.isInvalidDate).toBe(true);
    expect(result.isBeforeMinDate).toBe(false);
  });

  it('should flag date before minimum allowed', () => {
    // 6 years ago, always before min date
    const d = new Date();
    const year = (d.getFullYear() - 6).toString();
    const result = validateDueDate({ day: '01', month: '01', year });
    expect(result.fieldErrors).toEqual({
      day: false,
      month: false,
      year: false,
    });
    expect(result.isInvalidDate).toBe(false);
    expect(result.isBeforeMinDate).toBe(true);
  });

  it('should pass for valid date after minimum', () => {
    const d = new Date();
    const year = (d.getFullYear() - 2).toString();
    const result = validateDueDate({ day: '15', month: '12', year });
    expect(result.fieldErrors).toEqual({
      day: false,
      month: false,
      year: false,
    });
    expect(result.isInvalidDate).toBe(false);
    expect(result.isBeforeMinDate).toBe(false);
  });
});
