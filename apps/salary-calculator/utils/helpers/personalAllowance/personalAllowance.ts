import { getHmrcRates } from '../../rates/getHmrcRates';
import type { Country, TaxYear } from '../../rates/types';

// Calculates an individual's annual personal allowance, based on taxable annual income.
// Not yet supported: marriage allowance, blind person's allowance
export const calculatePersonalAllowance = ({
  taxYear,
  country,
  taxableAnnualIncome,
  isBlindPerson,
}: {
  taxYear?: TaxYear;
  country?: Country;
  taxableAnnualIncome: number;
  isBlindPerson?: boolean;
}): number => {
  const {
    PERSONAL_ALLOWANCE_DROPOFF,
    DEFAULT_PERSONAL_ALLOWANCE,
    BLIND_PERSONS_ALLOWANCE,
  } = getHmrcRates({ taxYear, country });

  // £1 of personal allowance is reduced for every £2 of Income over £100,000
  let personalAllowanceDeduction =
    taxableAnnualIncome >= PERSONAL_ALLOWANCE_DROPOFF
      ? (taxableAnnualIncome - PERSONAL_ALLOWANCE_DROPOFF) / 2
      : 0;

  // When beyond £125k taxable income, the personal allowance will reach zero.
  // Don't let the deduction go below zero, though.
  if (personalAllowanceDeduction < 0) {
    personalAllowanceDeduction = 0;
  }

  let personalAllowance = Math.max(
    0,
    DEFAULT_PERSONAL_ALLOWANCE - personalAllowanceDeduction,
  );

  // Drop off does not apply to blind person's allowance
  if (isBlindPerson)
    personalAllowance = personalAllowance + BLIND_PERSONS_ALLOWANCE;

  return personalAllowance;
};
