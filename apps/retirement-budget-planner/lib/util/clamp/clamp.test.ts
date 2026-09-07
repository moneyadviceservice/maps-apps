import { clamp } from './clamp';

describe('clamp utility', () => {
  it('returns the unchanged input value when it is within range', () => {
    expect(clamp(10, { min: 0, max: 20 })).toBe(10);
    expect(clamp(-5, { min: -10, max: -1 })).toBe(-5);
  });

  it('returns the unchanged input value when it is at the boundary values', () => {
    expect(clamp(0, { min: 0, max: 20 })).toBe(0);
    expect(clamp(20, { min: 0, max: 20 })).toBe(20);
  });

  it('returns min when input value is below range', () => {
    expect(clamp(-5, { min: 0, max: 20 })).toBe(0);
    expect(clamp(-20, { min: -10, max: -1 })).toBe(-10);
  });

  it('returns max when input value is above range', () => {
    expect(clamp(25, { min: 0, max: 20 })).toBe(20);
    expect(clamp(0, { min: -10, max: -1 })).toBe(-1);
  });

  it('throws when input value is not a finite number', () => {
    expect(() => clamp(Number.NaN, { min: 0, max: 20 })).toThrow(
      TypeError('input values must be finite numbers'),
    );
    expect(() => clamp(Number.POSITIVE_INFINITY, { min: 0, max: 20 })).toThrow(
      TypeError('input values must be finite numbers'),
    );
    expect(() => clamp(Number.NEGATIVE_INFINITY, { min: 0, max: 20 })).toThrow(
      TypeError('input values must be finite numbers'),
    );
  });

  it('throws when min value is not a finite number', () => {
    expect(() => clamp(10, { min: Number.NaN, max: 20 })).toThrow(
      TypeError('input values must be finite numbers'),
    );
    expect(() => clamp(10, { min: Number.POSITIVE_INFINITY, max: 20 })).toThrow(
      TypeError('input values must be finite numbers'),
    );
    expect(() => clamp(10, { min: Number.NEGATIVE_INFINITY, max: 20 })).toThrow(
      TypeError('input values must be finite numbers'),
    );
  });

  it('throws when max value is not a finite number', () => {
    expect(() => clamp(10, { min: 0, max: Number.NaN })).toThrow(
      TypeError('input values must be finite numbers'),
    );
    expect(() => clamp(10, { min: 0, max: Number.POSITIVE_INFINITY })).toThrow(
      TypeError('input values must be finite numbers'),
    );
    expect(() => clamp(10, { min: 0, max: Number.NEGATIVE_INFINITY })).toThrow(
      TypeError('input values must be finite numbers'),
    );
  });

  it('throws when min is greater than max', () => {
    expect(() => clamp(10, { min: 30, max: 20 })).toThrow(
      RangeError('min cannot be greater than max'),
    );
  });

  it('throws when range is invalid', () => {
    // @ts-expect-error - testing invalid input
    expect(() => clamp(10)).toThrow(
      TypeError('range must be an object with min and max number values'),
    );
    // @ts-expect-error - testing invalid input
    expect(() => clamp(10, 'not an object')).toThrow(
      TypeError('range must be an object with min and max number values'),
    );
  });
});
