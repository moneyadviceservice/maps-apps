import { getAnnualIncome } from './next-steps';

const DEFAULT_PERSONAL_ALLOWANCE = 12_570;
const HIGHER_BRACKET = 50_270;
const ADDITIONAL_BRACKET = 125_140;

const BASIC_RATE = 0.2;
const HIGHER_RATE = 0.4;
const ADDITIONAL_RATE = 0.45;

export const getAvailableAmountAfterIncomeTax = (
  taxableAnnualIncome: number,
) => {
  const taxable = Math.max(0, taxableAnnualIncome - DEFAULT_PERSONAL_ALLOWANCE);

  const basicBandSize = HIGHER_BRACKET - DEFAULT_PERSONAL_ALLOWANCE; // 37,700
  const higherBandSize =
    ADDITIONAL_BRACKET - DEFAULT_PERSONAL_ALLOWANCE - basicBandSize; // 74,870

  const basicPortion = Math.min(taxable, basicBandSize);
  const higherPortion = Math.min(
    Math.max(taxable - basicBandSize, 0),
    higherBandSize,
  );
  const additionalPortion = Math.max(
    taxable - basicBandSize - higherPortion,
    0,
  );

  const tax =
    basicPortion * BASIC_RATE +
    higherPortion * HIGHER_RATE +
    additionalPortion * ADDITIONAL_RATE;

  return taxableAnnualIncome - tax;
};

export const calculateIncomeTax = (income: Record<string, string>) => {
  const annualIncome = getAnnualIncome(income);
  const annualIncomeAfterTax = getAvailableAmountAfterIncomeTax(annualIncome);
  return annualIncomeAfterTax;
};
