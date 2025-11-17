import { getHmrcRates } from '../../rates/getHmrcRates';
import type { Country, TaxYear } from '../../rates/types';
import { getPersonalAllowanceFromTaxCode } from '../getPersonalAllowanceFromTaxCode';

// Calculates an individual's annual personal allowance, based on taxable annual income.
export const calculatePersonalAllowance = ({
  taxYear,
  country,
  taxableAnnualIncome,
  isBlindPerson,
  taxCode,
}: {
  taxYear?: TaxYear;
  country?: Country;
  taxableAnnualIncome: number;
  isBlindPerson?: boolean;
  taxCode?: string;
}): number => {
  const {
    PERSONAL_ALLOWANCE_DROPOFF,
    DEFAULT_PERSONAL_ALLOWANCE,
    BLIND_PERSONS_ALLOWANCE,
  } = getHmrcRates({ taxYear, country });

  // 1. Get base allowance from tax code
  let personalAllowance = getPersonalAllowanceFromTaxCode(
    taxCode,
    DEFAULT_PERSONAL_ALLOWANCE,
  );

  // 2. Apply income-based deduction (personal allowance reduces £1 for every £2 over threshold)
  if (taxableAnnualIncome >= PERSONAL_ALLOWANCE_DROPOFF) {
    const deduction = (taxableAnnualIncome - PERSONAL_ALLOWANCE_DROPOFF) / 2;
    personalAllowance = Math.max(0, personalAllowance - deduction);
  }

  // 3. Add blind person's allowance if applicable
  if (isBlindPerson && BLIND_PERSONS_ALLOWANCE) {
    personalAllowance += BLIND_PERSONS_ALLOWANCE;
  }

  return personalAllowance;
};
