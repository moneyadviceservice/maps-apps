import type { IronSessionData } from 'iron-session';
import { getFirmById } from 'lib/firms/fetchFirm';
import { isMainFirm } from 'lib/firms/firmDocument';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

import { isInRenewalWindow } from './reregistrationState';
import { startReregistrationDraft } from './startReregistrationDraft';

/**
 * Same `/register/*` flow as first registration.
 * If the firm is in the 30-day window and has no draft yet, create it so
 * step saves write to renewal_draft until confirm promotes to live fields.
 */
export async function ensureRenewalDraftForRegisterFlow(
  firm: MainTravelInsuranceFirmDocument,
  _session: Pick<IronSessionData, 'db_id'>,
  now: Date = new Date(),
): Promise<MainTravelInsuranceFirmDocument> {
  if (firm.renewal_draft != null || !isInRenewalWindow(firm, now)) {
    return firm;
  }

  const started = await startReregistrationDraft(firm, now);
  if (!started.success) {
    return firm;
  }

  const refreshed = await getFirmById(firm.id);
  if (refreshed.response && isMainFirm(refreshed.response)) {
    return refreshed.response;
  }

  return firm;
}
