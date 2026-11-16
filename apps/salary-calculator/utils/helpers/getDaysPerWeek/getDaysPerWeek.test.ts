import { getDaysPerWeek } from './getDaysPerWeek';

describe('getDaysPerWeek', () => {
  it('returns the number if a valid positive integer is provided', () => {
    expect(getDaysPerWeek(3)).toBe(3);
    expect(getDaysPerWeek(7)).toBe(7);
  });

  it('returns the number if a valid positive string is provided', () => {
    expect(getDaysPerWeek('4')).toBe(4);
    expect(getDaysPerWeek('6')).toBe(6);
  });

  it('defaults to 5 if input is 0', () => {
    expect(getDaysPerWeek(0)).toBe(5);
    expect(getDaysPerWeek('0')).toBe(5);
  });

  it('defaults to 5 if input is negative', () => {
    expect(getDaysPerWeek(-2)).toBe(5);
    expect(getDaysPerWeek('-3')).toBe(5);
  });

  it('defaults to 5 if input is an empty string', () => {
    expect(getDaysPerWeek('')).toBe(5);
  });

  it('defaults to 5 if input is NaN', () => {
    expect(getDaysPerWeek(Number.NaN)).toBe(5);
    expect(getDaysPerWeek('not-a-number')).toBe(5);
  });
});
