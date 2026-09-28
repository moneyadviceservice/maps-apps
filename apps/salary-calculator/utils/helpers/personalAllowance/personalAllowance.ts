import { getHmrcRates } from '../../rates/getHmrcRates';
import type { Country, TaxYear } from '../../rates/types';
import { getPersonalAllowanceFromTaxCode } from '../getPersonalAllowanceFromTaxCode';

const isNumericOrKTaxCode = (taxCode?: string): boolean => {
  if (!taxCode) return false;

  // Remove Scottish or Welsh prefix
  const code =
    taxCode.startsWith('S') || taxCode.startsWith('C')
      ? taxCode.slice(1)
      : taxCode;

  // K-codes (negative allowance)
  if (/^K\d+$/.test(code)) return true;

  // Standard numeric allowance codes (e.g., 1257L, 1100T, 50T)
  if (/^\d+[A-Z]?$/.test(code)) return true;

  return false;
};

/**
 * Calculates an individual's annual personal allowance based on taxable income, tax code,
 * and eligibility for Blind Person's Allowance.
 */
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

  // 1. Base allowance from tax code
  let personalAllowance = getPersonalAllowanceFromTaxCode(
    taxCode,
    DEFAULT_PERSONAL_ALLOWANCE,
    country,
  );

  // 2. Detect numeric tax code (ignores S/C prefix for Scotland/Wales)
  const hasNumericTaxCode = isNumericOrKTaxCode(taxCode);

  // 3. Apply tapering ONLY if no numeric tax code
  if (!hasNumericTaxCode && taxableAnnualIncome > PERSONAL_ALLOWANCE_DROPOFF) {
    const deduction = (taxableAnnualIncome - PERSONAL_ALLOWANCE_DROPOFF) / 2;
    personalAllowance = Math.max(0, personalAllowance - deduction);
  }

  // 4. Add Blind Person’s Allowance ONLY if **no tax code at all**
  if (!taxCode && isBlindPerson && BLIND_PERSONS_ALLOWANCE) {
    personalAllowance += BLIND_PERSONS_ALLOWANCE;
  }

  return personalAllowance;
};
