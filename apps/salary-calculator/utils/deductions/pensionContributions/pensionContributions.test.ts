import { calculatePensionContributions } from './pensionContributions';

describe('calculatePensionContributions', () => {
  it('calculates percentage contribution from annual salary', () => {
    expect(calculatePensionContributions(50000, 'percentage', 5)).toBeCloseTo(
      2500,
      2,
    );
    expect(calculatePensionContributions(80000, 'percentage', 10)).toBeCloseTo(
      8000,
      2,
    );
    expect(
      calculatePensionContributions(12345.67, 'percentage', 7.5),
    ).toBeCloseTo(925.93, 2);
  });

  it('calculates fixed monthly contribution annualised', () => {
    expect(calculatePensionContributions(50000, 'fixed', 200)).toBeCloseTo(
      2400,
      2,
    );
    expect(calculatePensionContributions(80000, 'fixed', 0)).toBeCloseTo(0, 2);
    expect(calculatePensionContributions(80000, 'fixed', 123.45)).toBeCloseTo(
      1481.4,
      2,
    );
  });

  it('returns 0 for 0% or 0 fixed', () => {
    expect(calculatePensionContributions(50000, 'percentage', 0)).toBeCloseTo(
      0,
      2,
    );
    expect(calculatePensionContributions(50000, 'fixed', 0)).toBeCloseTo(0, 2);
  });

  it('handles high precision values', () => {
    expect(
      calculatePensionContributions(12345.67, 'percentage', 2.3456),
    ).toBeCloseTo(289.58, 2);
    expect(
      calculatePensionContributions(12345.67, 'fixed', 99.999),
    ).toBeCloseTo(1199.99, 2);
  });

  it('returns 0 if contributionValue is null', () => {
    // @ts-expect-error: Testing null input for coverage
    expect(calculatePensionContributions(50000, 'percentage', null)).toBe(0);
    // @ts-expect-error: Testing null input for coverage
    expect(calculatePensionContributions(50000, 'fixed', null)).toBe(0);
  });

  it('returns 0 for unknown contributionType', () => {
    // @ts-expect-error: Testing fallback branch for coverage
    expect(calculatePensionContributions(50000, 'unknown', 100)).toBe(0);
  });
});
