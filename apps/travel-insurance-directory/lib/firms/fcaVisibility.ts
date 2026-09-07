import type { TravelInsuranceFirmBaseDocument } from 'types/travel-insurance-firm';

export const HIDDEN_DUE_TO_FCA = 'Invalid_FCA';
export const HIDDEN_DUE_TO_TRADING_NAME =
  'Trading_name-Inactive_or_Not_Current';

export type FcaVisibilityFields = Pick<
  TravelInsuranceFirmBaseDocument,
  'status' | 'hidden_reason'
>;

/** FCA / trading-name blocks public listing without changing directory status. */
export function hasFcaVisibilityBlock(
  firm: Pick<TravelInsuranceFirmBaseDocument, 'hidden_reason'>,
): boolean {
  return (
    firm.hidden_reason === HIDDEN_DUE_TO_FCA ||
    firm.hidden_reason === HIDDEN_DUE_TO_TRADING_NAME
  );
}

/** Public directory: approved status and no FCA visibility block. */
export function isListedOnPublicDirectory(firm: FcaVisibilityFields): boolean {
  return firm.status === 'active' && !hasFcaVisibilityBlock(firm);
}
