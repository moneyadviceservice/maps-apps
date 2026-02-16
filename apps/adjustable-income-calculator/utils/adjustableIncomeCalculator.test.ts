import { adjustableIncomeCalculator } from './adjustableIncomeCalculator';

describe('Adjustable Income Calculator', () => {
  it('should calculate the correct tax free adjustable income, monthly drawdown and the life expectancy', () => {
    const {
      taxFreeLumpSum,
      monthlyDrawdownAmount,
      desiredIncomeWithPotGrowthLastsUntil,
      monthlyIncomeUntilLifeExpectancy,
      lifeExpectancy,
    } = adjustableIncomeCalculator(100000, 85);

    expect(taxFreeLumpSum).toBe(25000);
    expect(monthlyDrawdownAmount).toBe(8333);
    expect(desiredIncomeWithPotGrowthLastsUntil).toBe(85);
    expect(monthlyIncomeUntilLifeExpectancy).toBe(8333);
    expect(lifeExpectancy).toBe(85);
  });

  it('should calculate the correct monthly drawdown and the life expectancy when updating the monthly income', () => {
    const {
      monthlyDrawdownAmount,
      desiredIncomeWithPotGrowthLastsUntil,
      monthlyIncomeUntilLifeExpectancy,
      lifeExpectancy,
    } = adjustableIncomeCalculator(100000, 85, 1000);

    expect(monthlyDrawdownAmount).toBe(1000);
    expect(desiredIncomeWithPotGrowthLastsUntil).toBe(92);
    expect(monthlyIncomeUntilLifeExpectancy).toBe(1000);
    expect(lifeExpectancy).toBe(85);
  });

  it('should return old monthly drawdown amount if it is greater than the age cap', () => {
    const {
      monthlyDrawdownAmount,
      desiredIncomeWithPotGrowthLastsUntil,
      monthlyIncomeUntilLifeExpectancy,
      lifeExpectancy,
    } = adjustableIncomeCalculator(100000, 121);

    expect(monthlyDrawdownAmount).toBe(8333);
    expect(desiredIncomeWithPotGrowthLastsUntil).toBe(121);
    expect(monthlyIncomeUntilLifeExpectancy).toBe(8333);
    expect(lifeExpectancy).toBe(85);
  });

  it('should return 0 if pot is £100', () => {
    const {
      monthlyDrawdownAmount,
      desiredIncomeWithPotGrowthLastsUntil,
      monthlyIncomeUntilLifeExpectancy,
      lifeExpectancy,
    } = adjustableIncomeCalculator(100, 55);

    expect(monthlyDrawdownAmount).toBe(0);
    expect(desiredIncomeWithPotGrowthLastsUntil).toBe(120);
    expect(monthlyIncomeUntilLifeExpectancy).toBe(0);
    expect(lifeExpectancy).toBe(85);
  });
});
