import Decimal from 'decimal.js';

export const calculatePensionContributions = (
  grossAnnualSalary: number,
  contributionType: 'percentage' | 'fixed',
  contributionValue: number,
): number => {
  let employeePensionContributions = new Decimal(0);

  if (contributionType === 'percentage') {
    employeePensionContributions = new Decimal(grossAnnualSalary)
      .times(contributionValue)
      .div(100);
  } else if (contributionType === 'fixed') {
    employeePensionContributions = new Decimal(contributionValue).times(12);
  }

  return employeePensionContributions.toDecimalPlaces(2).toNumber();
};
