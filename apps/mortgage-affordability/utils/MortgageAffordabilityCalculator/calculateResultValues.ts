import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
} from 'data/mortgage-affordability/step';

import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';

export const calculateTotalFormValues = (
  fields: (IncomeFieldKeys | ExpenseFieldKeys)[],
  formData: Record<string, string>,
) => {
  let total = 0;
  fields.forEach((key) => {
    total += convertStringToNumber(formData[`${key}`]);
  });

  return total;
};

export const calculateBound = (
  annualIncomeBeforeTax: number,
  committedCosts: number,
  profitMultiplier: number,
) => {
  return Math.round(
    (annualIncomeBeforeTax - committedCosts * 12) * profitMultiplier,
  );
};

export const getBound = (
  formData: Record<string, string>,
  annualIncomeFields: IncomeFieldKeys[],
  monthlyExpenseFields: ExpenseFieldKeys[],
  bound: number,
) => {
  const incomeTotal = calculateTotalFormValues(annualIncomeFields, formData);
  const committedExpenseTotal = calculateTotalFormValues(
    monthlyExpenseFields,
    formData,
  );

  return calculateBound(incomeTotal, committedExpenseTotal, bound);
};

export const calculateMonthlyPayment = (
  borrowAmount: number,
  interestRate: number,
  termYears: number,
) => {
  const principal = borrowAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = termYears * 12;

  if (numberOfPayments <= 0) {
    return 0;
  }

  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }

  const numerator =
    monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

  return principal * (numerator / denominator);
};

export const calculateRiskPercentage = (
  monthlyOutgoingFields: ExpenseFieldKeys[],
  monthlyIncomeFields: IncomeFieldKeys[],
  monthlyMortgagePayment: number,
  formData: Record<string, string>,
) => {
  const incomeTotal = calculateTotalFormValues(monthlyIncomeFields, formData);
  const outgoingTotal = calculateTotalFormValues(
    monthlyOutgoingFields,
    formData,
  );
  return ((outgoingTotal + monthlyMortgagePayment) / incomeTotal) * 100;
};

// 'error' means outgoings exceed take-home pay, the overstretched state; the
// results page never displays it (it clamps to 100% and shows warning).
export const calculateRiskLevel = (riskPercentage: number) => {
  const rounded = Math.round(riskPercentage);
  if (rounded < 80) return 'success';
  return 'warning';
};

export const calculateLeftOver = (
  monthlyIncome: number,
  fixedAndCommittedCosts: number,
  livingCosts: number,
  monthlyPayment: number,
) => monthlyIncome - (fixedAndCommittedCosts + livingCosts + monthlyPayment);
