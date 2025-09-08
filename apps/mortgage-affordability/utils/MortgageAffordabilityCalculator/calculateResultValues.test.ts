import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
} from 'data/mortgage-affordability/step';

import {
  calculateBound,
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
  calculateTotalFormValues,
  getBound,
} from './calculateResultValues';

describe('Mortgage Affordability Calculations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('calculateTotalFormValues', () => {
    it('should calculate the total form values correctly', () => {
      const fields = [IncomeFieldKeys.ANNUAL_INCOME, IncomeFieldKeys.TAKE_HOME];
      const formData = {
        [IncomeFieldKeys.ANNUAL_INCOME]: '5000',
        [IncomeFieldKeys.TAKE_HOME]: '2000',
      };

      const result = calculateTotalFormValues(fields, formData);

      expect(result).toBe(7000);
    });
  });

  describe('calculateBound', () => {
    it('should calculate the bound correctly', () => {
      const annualIncomeBeforeTax = 100000;
      const committedCosts = 2000;
      const profitMultiplier = 4;

      const result = calculateBound(
        annualIncomeBeforeTax,
        committedCosts,
        profitMultiplier,
      );

      expect(result).toBe(304000);
    });
  });

  describe('getBound', () => {
    it('should calculate the bound using formData', () => {
      const formData = {
        [IncomeFieldKeys.ANNUAL_INCOME]: '40,000',
        [IncomeFieldKeys.SEC_ANNUAL_INCOME]: '20,000',
        [ExpenseFieldKeys.BILLS_INSURANCE]: '1,000',
        [ExpenseFieldKeys.CARD_AND_LOAN]: '500',
      };

      const incomeFields = [
        IncomeFieldKeys.ANNUAL_INCOME,
        IncomeFieldKeys.SEC_ANNUAL_INCOME,
      ];
      const expenseFields = [
        ExpenseFieldKeys.BILLS_INSURANCE,
        ExpenseFieldKeys.CARD_AND_LOAN,
      ];
      const bound = 3;

      const result = getBound(formData, incomeFields, expenseFields, bound);

      expect(result).toBe(126000);
    });
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate the monthly payment correctly', () => {
      const borrowAmount = 200000;
      const interestRate = 5;
      const termYears = 30;

      const result = calculateMonthlyPayment(
        borrowAmount,
        interestRate,
        termYears,
      );

      expect(result).toBeCloseTo(1073.64, 2);
    });

    it('should handle zero interest rate', () => {
      const borrowAmount = 120000;
      const interestRate = 0;
      const termYears = 10;

      const result = calculateMonthlyPayment(
        borrowAmount,
        interestRate,
        termYears,
      );

      expect(result).toBe(1000);
    });
  });

  describe('calculateRiskPercentage', () => {
    it('should calculate the risk percentage correctly', () => {
      const outgoingFields = [
        ExpenseFieldKeys.BILLS_INSURANCE,
        ExpenseFieldKeys.CARD_AND_LOAN,
      ];
      const incomeFields = [
        IncomeFieldKeys.TAKE_HOME,
        IncomeFieldKeys.SEC_TAKE_HOME,
      ];
      const formData = {
        [IncomeFieldKeys.TAKE_HOME]: '2500',
        [IncomeFieldKeys.SEC_TAKE_HOME]: '1200',
        [ExpenseFieldKeys.BILLS_INSURANCE]: '1000',
        [ExpenseFieldKeys.CARD_AND_LOAN]: '500',
      };
      const monthlyMortgagePayment = 1200;

      const result = calculateRiskPercentage(
        outgoingFields,
        incomeFields,
        monthlyMortgagePayment,
        formData,
      );

      expect(result).toBeCloseTo(72.97, 2);
    });

    it('should cap the risk percentage at 100', () => {
      const outgoingFields = [
        ExpenseFieldKeys.BILLS_INSURANCE,
        ExpenseFieldKeys.CARD_AND_LOAN,
      ];
      const incomeFields = [
        IncomeFieldKeys.TAKE_HOME,
        IncomeFieldKeys.SEC_TAKE_HOME,
      ];
      const formData = {
        [IncomeFieldKeys.TAKE_HOME]: '2000',
        [IncomeFieldKeys.SEC_TAKE_HOME]: '4000',
        [ExpenseFieldKeys.BILLS_INSURANCE]: '4000',
        [ExpenseFieldKeys.CARD_AND_LOAN]: '2000',
      };
      const monthlyMortgagePayment = 1500;

      const result = calculateRiskPercentage(
        outgoingFields,
        incomeFields,
        monthlyMortgagePayment,
        formData,
      );

      expect(result).toBe(100);
    });
  });

  describe('calculateRiskLevel', () => {
    it('should return "low" for risk percentage below 40', () => {
      const result = calculateRiskLevel(30);

      expect(result).toBe('success');
    });

    it('should return "medium" for risk percentage between 40 and 60', () => {
      const result = calculateRiskLevel(50);

      expect(result).toBe('warning');
    });

    it('should return "high" for risk percentage above 60', () => {
      const result = calculateRiskLevel(70);

      expect(result).toBe('error');
    });
  });
});
