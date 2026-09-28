import formatPercentage from './formatPercentage';

describe('formatPercentage', () => {
  it('should format positive numbers correctly', () => {
    expect(formatPercentage(25)).toBe('25%');
    expect(formatPercentage(100)).toBe('100%');
    expect(formatPercentage(0.5)).toBe('0.5%');
  });

  it('should format negative numbers correctly', () => {
    expect(formatPercentage(-10)).toBe('-10%');
    expect(formatPercentage(-99.9)).toBe('-99.9%');
  });

  it('should format zero correctly', () => {
    expect(formatPercentage(0)).toBe('0%');
  });

  it('should handle decimal numbers', () => {
    expect(formatPercentage(12.5)).toBe('12.5%');
    expect(formatPercentage(99.999)).toBe('99.999%');
    expect(formatPercentage(0.01)).toBe('0.01%');
  });

  it('should handle null values', () => {
    expect(formatPercentage(null)).toBe('0%');
  });

  it('should handle undefined values', () => {
    expect(formatPercentage(undefined)).toBe('0%');
  });

  it('should handle very large numbers', () => {
    expect(formatPercentage(1000000)).toBe('1000000%');
    expect(formatPercentage(999999999)).toBe('999999999%');
  });

  it('should handle very small decimal numbers', () => {
    expect(formatPercentage(0.00001)).toBe('0.00001%');
    expect(formatPercentage(0.123456789)).toBe('0.123456789%');
  });

  it('should handle edge cases with falsy number values', () => {
    expect(formatPercentage(0)).toBe('0%'); // 0 is falsy but should display as 0%
    expect(formatPercentage(-0)).toBe('0%'); // -0 is also falsy
  });

  it('should handle NaN values', () => {
    // NaN is falsy, so it should return 0%
    expect(formatPercentage(NaN)).toBe('0%');
  });

  it('should handle Infinity values', () => {
    expect(formatPercentage(Infinity)).toBe('Infinity%');
    expect(formatPercentage(-Infinity)).toBe('-Infinity%');
  });

  it('should maintain number precision', () => {
    expect(formatPercentage(1.1)).toBe('1.1%');
    expect(formatPercentage(1.1)).toBe('1.1%'); // JavaScript removes trailing zeros
    expect(formatPercentage(1.123456789012345)).toBe('1.123456789012345%');
  });

  it('should handle a variety of real-world percentage values', () => {
    expect(formatPercentage(19.9)).toBe('19.9%');
    expect(formatPercentage(24.9)).toBe('24.9%');
    expect(formatPercentage(29.9)).toBe('29.9%');

    expect(formatPercentage(0.25)).toBe('0.25%');
    expect(formatPercentage(1.5)).toBe('1.5%');
    expect(formatPercentage(3.75)).toBe('3.75%');
  });

  it('should handle type coercion edge cases', () => {
    expect(formatPercentage(null)).toBe('0%');
    expect(formatPercentage(undefined)).toBe('0%');
    expect(formatPercentage(0)).toBe('0%');
    expect(formatPercentage(NaN)).toBe('0%');
  });
});
