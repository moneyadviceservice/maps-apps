import { AFFORDABILITY_EXPENSE_FIELDS } from 'data/mortgage-affordability/CONSTANTS';
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

    it('should return 0 for zero mortgage term', () => {
      const borrowAmount = 120000;
      const interestRate = 0;
      const termYears = 0;

      const result = calculateMonthlyPayment(
        borrowAmount,
        interestRate,
        termYears,
      );

      expect(result).toBe(0);
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

    it('should return percentages above 100 uncapped when outgoings exceed income', () => {
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

      expect(result).toBe(125);
    });
  });

  describe('calculateRiskLevel', () => {
    it('should return "success" for risk percentage below 80', () => {
      expect(calculateRiskLevel(30)).toBe('success');
      expect(calculateRiskLevel(79.4)).toBe('success');
    });

    it('should return "warning" for risk percentage between 80 and 100', () => {
      expect(calculateRiskLevel(80)).toBe('warning');
      expect(calculateRiskLevel(85)).toBe('warning');
      expect(calculateRiskLevel(95)).toBe('warning');
      expect(calculateRiskLevel(100)).toBe('warning');
    });

    it('should return "warning" for risk percentage above 100', () => {
      expect(calculateRiskLevel(100.5)).toBe('warning');
      expect(calculateRiskLevel(160)).toBe('warning');
    });
  });

  describe('affordability rating', () => {
    // Living costs (food, entertainment and leisure, holidays) count towards
    // the rating; rent/current mortgage does not.
    const cases: {
      name: string;
      takeHome: string;
      expenses: Record<string, string>;
      borrow: number;
      term: number;
      interest: number;
      percentage: number;
      level: string;
    }[] = [
      {
        name: 'green when outgoings are 75% of take-home pay',
        takeHome: '3000',
        expenses: {
          [ExpenseFieldKeys.RENT_MORTGAGE]: '500',
          [ExpenseFieldKeys.CARD_AND_LOAN]: '200',
          [ExpenseFieldKeys.CHILD_SPOUSAL]: '300',
          [ExpenseFieldKeys.CARE_SCHOOL]: '400',
          [ExpenseFieldKeys.TRAVEL]: '55',
          [ExpenseFieldKeys.BILLS_INSURANCE]: '400',
          [ExpenseFieldKeys.GROCERIES]: '250',
          [ExpenseFieldKeys.LEISURE]: '100',
          [ExpenseFieldKeys.HOLIDAYS]: '67',
        },
        borrow: 90000,
        term: 25,
        interest: 4,
        percentage: 75,
        level: 'success',
      },
      {
        name: 'green just below the amber threshold at 79%',
        takeHome: '3000',
        expenses: {
          [ExpenseFieldKeys.RENT_MORTGAGE]: '500',
          [ExpenseFieldKeys.CARD_AND_LOAN]: '100',
          [ExpenseFieldKeys.CHILD_SPOUSAL]: '200',
          [ExpenseFieldKeys.CARE_SCHOOL]: '50',
          [ExpenseFieldKeys.LEISURE]: '150',
          [ExpenseFieldKeys.HOLIDAYS]: '220',
        },
        borrow: 190000,
        term: 12,
        interest: 4,
        percentage: 79,
        level: 'success',
      },
      {
        name: 'amber when outgoings are 91% of take-home pay',
        takeHome: '2000',
        expenses: {
          [ExpenseFieldKeys.RENT_MORTGAGE]: '500',
          [ExpenseFieldKeys.CARD_AND_LOAN]: '450',
          [ExpenseFieldKeys.CHILD_SPOUSAL]: '230',
          [ExpenseFieldKeys.GROCERIES]: '44',
          [ExpenseFieldKeys.LEISURE]: '111',
        },
        borrow: 113500,
        term: 13,
        interest: 5,
        percentage: 91,
        level: 'warning',
      },
      {
        name: 'amber at the 80% lower boundary',
        takeHome: '2000',
        expenses: {
          [ExpenseFieldKeys.RENT_MORTGAGE]: '500',
          [ExpenseFieldKeys.CARD_AND_LOAN]: '76',
          [ExpenseFieldKeys.CHILD_SPOUSAL]: '54',
          [ExpenseFieldKeys.CARE_SCHOOL]: '43',
          [ExpenseFieldKeys.TRAVEL]: '32',
          [ExpenseFieldKeys.BILLS_INSURANCE]: '56',
          [ExpenseFieldKeys.GROCERIES]: '45',
          [ExpenseFieldKeys.LEISURE]: '56',
          [ExpenseFieldKeys.HOLIDAYS]: '67',
        },
        borrow: 118800,
        term: 11,
        interest: 5,
        percentage: 80,
        level: 'warning',
      },
      {
        name: 'amber at 99% just below the overstretched threshold',
        takeHome: '3100',
        expenses: {
          [ExpenseFieldKeys.RENT_MORTGAGE]: '500',
          [ExpenseFieldKeys.CARD_AND_LOAN]: '100',
          [ExpenseFieldKeys.CHILD_SPOUSAL]: '200',
          [ExpenseFieldKeys.CARE_SCHOOL]: '300',
          [ExpenseFieldKeys.TRAVEL]: '200',
          [ExpenseFieldKeys.BILLS_INSURANCE]: '100',
          [ExpenseFieldKeys.GROCERIES]: '200',
          [ExpenseFieldKeys.LEISURE]: '300',
          [ExpenseFieldKeys.HOLIDAYS]: '212',
        },
        borrow: 132000,
        term: 10,
        interest: 6,
        percentage: 99,
        level: 'warning',
      },
    ];

    it.each(cases)(
      'should rate $name',
      ({ takeHome, expenses, borrow, term, interest, percentage, level }) => {
        const formData = {
          [IncomeFieldKeys.TAKE_HOME]: takeHome,
          ...expenses,
        };

        const monthlyPayment = calculateMonthlyPayment(borrow, interest, term);
        const riskPercentage = calculateRiskPercentage(
          AFFORDABILITY_EXPENSE_FIELDS,
          [IncomeFieldKeys.TAKE_HOME],
          monthlyPayment,
          formData,
        );

        expect(Math.round(riskPercentage)).toBe(percentage);
        expect(calculateRiskLevel(riskPercentage)).toBe(level);
      },
    );
  });
});
