import { adjustableIncomeCalculator } from './adjustableIncomeCalculator';

describe('adjustableIncomeCalculator', () => {
  it('should return the correct adjustable income when pot is provided', () => {
    const pot = 100000;

    const expected = {
      desiredIncomeWithPotGrowthLastsUntil: 93,
      growthInterestRate: 3,
      lifeExpectancy: 85,
      monthlyDrawdownAmount: 200,
      monthlyIncomeUntilLifeExpectancy: 200,
      taxFreeLumpSum: 25000,
      taxablePortion: 75000,
    };

    const result = adjustableIncomeCalculator(pot);

    expect(result).toEqual(expected);
  });

  it('should return the correct adjustable income when pot and age is provided', () => {
    const pot = 100000;
    const age = 60;

    const expected = {
      desiredIncomeWithPotGrowthLastsUntil: 85,
      growthInterestRate: 3,
      lifeExpectancy: 85,
      monthlyDrawdownAmount: 358,
      monthlyIncomeUntilLifeExpectancy: 358,
      taxFreeLumpSum: 25000,
      taxablePortion: 75000,
    };

    const result = adjustableIncomeCalculator(pot, age);

    expect(result).toEqual(expected);
  });

  it('should return the correct adjustable income when pot and age and month is provided', () => {
    const pot = 100000;
    const age = 60;
    const monthIncome = 400;

    const expected = {
      desiredIncomeWithPotGrowthLastsUntil: 81,
      growthInterestRate: 3,
      lifeExpectancy: 85,
      monthlyDrawdownAmount: 400,
      monthlyIncomeUntilLifeExpectancy: 358,
      taxFreeLumpSum: 25000,
      taxablePortion: 75000,
    };

    const result = adjustableIncomeCalculator(pot, age, monthIncome);

    expect(result).toEqual(expected);
  });

  it('should return the correct adjustable income when pot of 1000', () => {
    const pot = 1000;

    const expected = {
      desiredIncomeWithPotGrowthLastsUntil: 120,
      growthInterestRate: 3,
      lifeExpectancy: 85,
      monthlyDrawdownAmount: 0,
      monthlyIncomeUntilLifeExpectancy: 0,
      taxFreeLumpSum: 250,
      taxablePortion: 750,
    };

    const result = adjustableIncomeCalculator(pot);

    expect(result).toEqual(expected);
  });
});
