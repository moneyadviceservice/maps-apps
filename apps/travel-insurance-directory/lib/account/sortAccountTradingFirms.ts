import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import type { TradingTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

function toCreatedAtMs(firm: TradingTravelInsuranceFirmDocument): number {
  const ms = Date.parse(firm.created_at ?? '');
  return Number.isNaN(ms) ? 0 : ms;
}

/**
 * Valid trading names first (newest `created_at` first), then FCA-blocked names at the bottom.
 */
export function sortAccountTradingFirms(
  tradingFirms: TradingTravelInsuranceFirmDocument[],
): TradingTravelInsuranceFirmDocument[] {
  return [...tradingFirms].sort((a, b) => {
    const aBlocked = hasFcaVisibilityBlock(a);
    const bBlocked = hasFcaVisibilityBlock(b);
    if (aBlocked !== bBlocked) {
      return aBlocked ? 1 : -1;
    }
    return toCreatedAtMs(b) - toCreatedAtMs(a);
  });
}
