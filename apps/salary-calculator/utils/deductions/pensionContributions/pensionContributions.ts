import Decimal from 'decimal.js';

export const calculatePensionContributions = (
  grossAnnualSalary: number,
  contributionType: 'percentage' | 'fixed',
  contributionValue: number,
): number => {
  if (contributionValue === null) {
    return 0;
  }

  if (contributionType === 'percentage') {
    return new Decimal(grossAnnualSalary)
      .times(contributionValue)
      .div(100)
      .toDecimalPlaces(2)
      .toNumber();
  } else if (contributionType === 'fixed') {
    return new Decimal(contributionValue)
      .times(12)
      .toDecimalPlaces(2)
      .toNumber();
  }

  return 0;
};
