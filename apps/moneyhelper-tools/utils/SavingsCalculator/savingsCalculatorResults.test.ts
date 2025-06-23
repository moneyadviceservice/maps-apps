import {
  SavingsCalculatorFrequency,
  savingsCalculatorResults,
} from './savingsCalculatorResults';
import { getSixMonthsFromCurrentDate } from './savingsCalculatorValidationInputs';

describe('savingsCalculatorResults', () => {
  it('should return correct results for saving goal 100', () => {
    const result = savingsCalculatorResults({
      savingGoal: 100,
      regularDeposit: 10,
      regularDepositFrequency: 12,
      initialDeposit: 10,
      annualRate: 2.1,
    });

    expect(result).toEqual({
      savingGoal: 100,
      regularDepositFrequency: SavingsCalculatorFrequency.MONTH,
      monthsToGoal: {
        duration: { years: 0, months: 9 },
        regularDeposit: 10,
        totalSaved: 101,
      },
      altMonthsToGoal: {
        duration: { years: 0, months: 7 },
        regularDeposit: 13,
        regularDepositIncrease: 3,
        difference: { years: 0, months: 2 },
      },
    });
  });

  it('should return correct results 12000', () => {
    const result = savingsCalculatorResults({
      savingGoal: 12000,
      regularDeposit: 750,
      regularDepositFrequency: 1,
      initialDeposit: 2000,
      annualRate: 2.1,
    });

    expect(result).toEqual({
      savingGoal: 12000,
      regularDepositFrequency: SavingsCalculatorFrequency.YEAR,
      monthsToGoal: {
        duration: { years: 11, months: 3 },
        regularDeposit: 750,
        totalSaved: 12024,
      },
      altMonthsToGoal: {
        duration: { years: 8, months: 6 },
        regularDeposit: 1044,
        regularDepositIncrease: 294,
        difference: { years: 2, months: 9 },
      },
    });
  });

  it('should return correct results with saving goal 25000 and savingDate 6 months from now', () => {
    const { month, year, day } = getSixMonthsFromCurrentDate();
    const result = savingsCalculatorResults({
      savingGoal: 25000,
      regularDeposit: 10,
      regularDepositFrequency: 12,
      savingDate: new Date(`${year}-${month}-${day}`),
      initialDeposit: 10,
      annualRate: 2.1,
    });

    expect(result).toEqual({
      savingGoal: 25000,
      regularDepositFrequency: 12,
      monthsToGoal: {
        duration: { years: 0, months: 5 },
        regularDeposit: 4981,
        totalSaved: 25002,
      },
      altMonthsToGoal: {
        duration: { years: 0, months: 4 },
        regularDeposit: 6232,
        regularDepositIncrease: 1251,
        difference: { years: 0, months: 1 },
      },
    });
  });

  it('should return correct results with saving goal 18000 weekly', () => {
    const result = savingsCalculatorResults({
      savingGoal: 18000,
      regularDeposit: 100,
      regularDepositFrequency: 52,
      initialDeposit: 2000,
      annualRate: 0.2,
    });

    expect(result).toEqual({
      savingGoal: 18000,
      regularDepositFrequency: 52,
      monthsToGoal: {
        duration: { years: 3, months: 1 },
        regularDeposit: 100,
        totalSaved: 18094,
      },
      altMonthsToGoal: {
        duration: { years: 2, months: 4 },
        regularDeposit: 132,
        regularDepositIncrease: 32,
        difference: { years: 0, months: 9 },
      },
    });
  });

  it('should return correct results with saving goal 2000 monthly payment of 500 ', () => {
    const result = savingsCalculatorResults({
      savingGoal: 2000,
      regularDeposit: 500,
      regularDepositFrequency: 12,
      initialDeposit: 1000,
      annualRate: 0.2,
    });

    expect(result).toEqual({
      savingGoal: 2000,
      regularDepositFrequency: 12,
      monthsToGoal: {
        duration: { years: 0, months: 2 },
        regularDeposit: 500,
        totalSaved: 2000,
      },
      altMonthsToGoal: {
        duration: { years: 0, months: 1 },
        regularDeposit: 1000,
        regularDepositIncrease: 500,
        difference: { years: 0, months: 1 },
      },
    });
  });

  it('should return correct results with saving goal and initial deposit are equal', () => {
    const result = savingsCalculatorResults({
      savingGoal: 1500,
      regularDeposit: 500,
      regularDepositFrequency: 12,
      initialDeposit: 1500,
      annualRate: 0.2,
    });

    expect(result).toEqual({
      savingGoal: 1500,
      regularDepositFrequency: 12,
      monthsToGoal: {
        duration: { years: 0, months: 0 },
        regularDeposit: 500,
        totalSaved: 1500,
      },
      altMonthsToGoal: {
        duration: { years: 0, months: 0 },
        regularDeposit: 0,
        regularDepositIncrease: 0,
        difference: { years: 0, months: 0 },
      },
    });
  });

  it('should return correct results with saving goal with rate as 0', () => {
    const result = savingsCalculatorResults({
      savingGoal: 1500,
      regularDeposit: 25,
      regularDepositFrequency: 12,
      initialDeposit: 10,
      annualRate: 0,
    });

    expect(result).toEqual({
      savingGoal: 1500,
      regularDepositFrequency: 12,
      monthsToGoal: {
        duration: { years: 5, months: 0 },
        regularDeposit: 25,
        totalSaved: 1510,
      },
      altMonthsToGoal: {
        duration: { years: 3, months: 8 },
        regularDeposit: 34,
        regularDepositIncrease: 9,
        difference: { years: 1, months: 4 },
      },
    });
  });
});
