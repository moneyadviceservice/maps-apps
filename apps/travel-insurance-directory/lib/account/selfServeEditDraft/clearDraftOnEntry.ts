import { updateFirm } from 'lib/firms/updateFirm';
import type { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import {
  buildClearCoverServiceDraftPatch,
  buildClearCustomerContactDraftPatch,
} from './selfServeEditDraft';

type ClearDraftPatchBuilder = (
  firm: TravelInsuranceFirmDocument,
) => Record<string, unknown> | null;

async function clearDraftOnEntry(
  firm: TravelInsuranceFirmDocument,
  buildPatch: ClearDraftPatchBuilder,
): Promise<void> {
  const patch = buildPatch(firm);
  if (!patch) {
    return;
  }

  await updateFirm(firm.id, patch);
}

/**
 * Clears staged Cover & Service edits when the principal re-enters that journey
 * from account (so the summary shows live data).
 */
export async function clearCoverServiceDraftOnJourneyStart(
  firm: TravelInsuranceFirmDocument,
): Promise<void> {
  await clearDraftOnEntry(firm, buildClearCoverServiceDraftPatch);
}

/**
 * Clears staged Customer Contact edits when the principal re-enters that journey
 * from account (so the summary shows live data).
 */
export async function clearCustomerContactDraftOnJourneyStart(
  firm: TravelInsuranceFirmDocument,
): Promise<void> {
  await clearDraftOnEntry(firm, buildClearCustomerContactDraftPatch);
}

export function shouldResetDraftOnEntry(
  query: Record<string, string | string[] | undefined>,
): boolean {
  return query.resetDraft === 'true';
}
