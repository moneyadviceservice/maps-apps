import { getHmrcRates } from '../../rates/getHmrcRates';
import type { Country, TaxYear } from '../../rates/types';

// Calculates an individual's national insurance contributions based on taxable income
// Note: This is employee contributions only. Supports class 1, category A national insurance only.
// Uses the employee's weekly salary as a basis, as per the system, then re-converts into a year at the end.
// See https://www.gov.uk/national-insurance-rates-letters/category-letters for other categories
export const calculateEmployeeNationalInsurance = ({
  taxYear,
  country,
  taxableAnnualIncome,
  isOverStatePensionAge = false,
}: {
  taxYear?: TaxYear;
  country?: Country;
  taxableAnnualIncome: number;
  isOverStatePensionAge?: boolean;
}) => {
  if (isOverStatePensionAge) return 0; // no NI contributions if over state pension age

  const {
    NI_ANNUAL_MIDDLE_BRACKET,
    NI_ANNUAL_UPPER_BRACKET,
    NI_MIDDLE_RATE,
    NI_UPPER_RATE,
  } = getHmrcRates({ taxYear, country });

  let ni = 0;

  if (taxableAnnualIncome > NI_ANNUAL_UPPER_BRACKET) {
    ni =
      (NI_ANNUAL_UPPER_BRACKET - NI_ANNUAL_MIDDLE_BRACKET) * NI_MIDDLE_RATE +
      (taxableAnnualIncome - NI_ANNUAL_UPPER_BRACKET) * NI_UPPER_RATE;
  } else if (taxableAnnualIncome > NI_ANNUAL_MIDDLE_BRACKET) {
    ni = (taxableAnnualIncome - NI_ANNUAL_MIDDLE_BRACKET) * NI_MIDDLE_RATE;
  }

  return Number(ni.toFixed(2));
};
