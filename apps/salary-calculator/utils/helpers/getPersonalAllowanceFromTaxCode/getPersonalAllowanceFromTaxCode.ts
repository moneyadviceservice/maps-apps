import type { Country } from '../../rates';
import {
  SPECIAL_TAX_CODES_ENGLAND,
  SPECIAL_TAX_CODES_SCOTLAND,
} from '../../rates/constants';
import { transformTaxCode } from '../transformTaxCode';

/**
 * Returns the base personal allowance for a given tax code and country.
 *
 * Numeric tax codes (e.g., 1100T, 1257L) override any formula.
 * Non-numeric codes (e.g., BR, D0, NT) return 0 or default allowance.
 * Tapering and Blind Person’s Allowance are handled separately in calculatePersonalAllowance.
 */
export function getPersonalAllowanceFromTaxCode(
  taxCode?: string,
  defaultAllowance = 12570,
  country: Country = 'England/NI/Wales',
): number {
  if (!taxCode) {
    // No tax code: return default allowance
    return defaultAllowance;
  }

  const code = transformTaxCode(taxCode)!;

  // Special codes for country
  const specialCodes =
    country === 'Scotland'
      ? SPECIAL_TAX_CODES_SCOTLAND
      : SPECIAL_TAX_CODES_ENGLAND;

  // 0T or other letter codes (no allowance), optional C/S prefix
  // Covers: 0T, 0M, 0N, 0L (+ C/S variants)
  if (/^[CS]?0[TMNL]$/.test(code)) {
    return 0;
  }

  if (code in specialCodes) return 0;

  // Extract numeric part of code
  const numMatch = /\d+/.exec(code);
  const num = Number.parseInt(numMatch ? numMatch[0] : '0', 10);

  // Numeric tax code: override PA
  if (num > 0) {
    if (code.includes('K')) {
      return -num * 10; // negative allowance
    }
    return num * 10; // override PA directly
  }

  // Non-numeric code (BR, D0, NT, etc.) → 0 allowance
  return 0;
}
