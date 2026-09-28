import { EMERGENCY_TAX_CODE_SUFFIXES } from 'utils/rates/constants';

/**
 * Emergency (non-cumulative) tax codes end in W1, M1 or X, for example
 * 1257L W1, S1257L M1 or C663L X. Expects an upper-case tax code.
 */
export const isEmergencyTaxCode = (taxCode?: string): boolean =>
  !!taxCode &&
  EMERGENCY_TAX_CODE_SUFFIXES.some((suffix) => taxCode.endsWith(suffix));
