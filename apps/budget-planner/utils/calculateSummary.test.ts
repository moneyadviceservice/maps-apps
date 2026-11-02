import calculateSummary, { calculateOutcomeRange } from './calculateSummary';

describe('calculateSummary', () => {
  it('should add a positive value to the income', () => {
    const carry = { income: 0, spending: 0 };
    const transaction = { value: 1000 };
    const expectedSummary = { income: 1000, spending: 0 };
    const result = calculateSummary(carry, transaction);
    expect(result).toEqual(expectedSummary);
  });

  it('should add a negative value to the spending', () => {
    const carry = { income: 1000, spending: 0 };
    const transaction = { value: -500 };
    const expectedSummary = { income: 1000, spending: -500 };
    const result = calculateSummary(carry, transaction);
    expect(result).toEqual(expectedSummary);
  });
});

describe('calculateOutcomeRange', () => {
  it('should return a positive outcome', () => {
    const summary = { income: 1000, spending: -945 };
    const result = calculateOutcomeRange(summary);
    expect(result).toBe('positive');
  });

  it('should return a negative outcome', () => {
    const summary = { income: 1000, spending: -1050 };
    const result = calculateOutcomeRange(summary);
    expect(result).toBe('negative');
  });

  it('should return a neutral outcome', () => {
    const summary = { income: 1000, spending: -950 };
    const result = calculateOutcomeRange(summary);
    expect(result).toBe('neutral');
  });
});
