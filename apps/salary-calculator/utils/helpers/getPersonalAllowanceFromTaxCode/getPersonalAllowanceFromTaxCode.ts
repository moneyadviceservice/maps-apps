import type { Country } from '../../rates';
import {
  SPECIAL_TAX_CODES_ENGLAND,
  SPECIAL_TAX_CODES_SCOTLAND,
} from '../../rates/constants';

export function getPersonalAllowanceFromTaxCode(
  taxCode?: string,
  defaultAllowance = 12570,
  country: Country = 'England/NI/Wales',
): number {
  if (!taxCode) return defaultAllowance;

  const code = taxCode.toUpperCase().trim();

  // Use correct special codes for the country
  const specialCodes =
    country === 'Scotland'
      ? SPECIAL_TAX_CODES_SCOTLAND
      : SPECIAL_TAX_CODES_ENGLAND;

  if (code === '0T' || code === 'C0T' || code === 'S0T') return 0;

  if (code in specialCodes) return 0;

  // Numeric part for codes like 1100T, 1257L, etc.
  const numMatch = /\d+/.exec(code);
  const num = Number.parseInt(numMatch ? numMatch[0] : '0', 10);

  // K codes: negative allowance
  if (code.includes('K')) return -num * 10;

  // T, L, M, N, etc. with a number: allowance = number * 10
  if (num > 0) return num * 10;

  // Fallback
  return defaultAllowance;
}
