import { getAnnualIncome } from './next-steps';

const DEFAULT_PERSONAL_ALLOWANCE = 12_570;
const TAPER_THRESHOLD = 100_000;
const ZERO_ALLOWANCE_THRESHOLD = 125_140;
const HIGHER_BRACKET = 50_270;
const ADDITIONAL_BRACKET = 125_140;

const BASIC_RATE = 0.2;
const HIGHER_RATE = 0.4;
const ADDITIONAL_RATE = 0.45;

/**
 * Calculate personal allowance after taper for high earners
 * @param income Annual income
 * @returns Personal allowance amount after taper (never negative)
 *
 * Rules:
 * - Income <= £100,000: Personal allowance = £12,570
 * - Income >= £125,140: Personal allowance = £0
 * - £100,000 < Income < £125,140: Personal allowance = £12,570 - ((income - £100,000) / 2)
 */
const getPersonalAllowanceAfterTaper = (income: number): number => {
  if (income <= TAPER_THRESHOLD) {
    return DEFAULT_PERSONAL_ALLOWANCE;
  }

  if (income >= ZERO_ALLOWANCE_THRESHOLD) {
    return 0;
  }

  // Calculate tapered personal allowance
  // Personal allowance is reduced by £1 for every £2 of income over £100,000
  const excess = income - TAPER_THRESHOLD;
  const reduction = excess / 2;
  const taperedAllowance = DEFAULT_PERSONAL_ALLOWANCE - reduction;

  return Math.max(0, taperedAllowance);
};

export const getAvailableAmountAfterIncomeTax = (
  taxableAnnualIncome: number,
) => {
  const personalAllowance = getPersonalAllowanceAfterTaper(taxableAnnualIncome);
  const taxable = Math.max(0, taxableAnnualIncome - personalAllowance);

  const basicBandSize = HIGHER_BRACKET - DEFAULT_PERSONAL_ALLOWANCE; // 37,700

  // Higher band extends from the end of basic band to the additional rate threshold
  // The additional rate threshold in taxable terms is affected by the personal allowance
  // maxHigherBandSize = (ADDITIONAL_BRACKET - personalAllowance) - basicBandSize
  const maxHigherBandSize =
    ADDITIONAL_BRACKET - personalAllowance - basicBandSize;

  const basicPortion = Math.min(taxable, basicBandSize);
  const higherPortion = Math.min(
    Math.max(taxable - basicBandSize, 0),
    maxHigherBandSize,
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
