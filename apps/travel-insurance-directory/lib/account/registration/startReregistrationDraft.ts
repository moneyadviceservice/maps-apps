import { SUCCESS_REDIRECT_PATH } from 'types/CONSTANTS';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { updateFirm } from 'lib/firms/updateFirm';
import { buildRenewalDraftFromFirm } from 'lib/register/registerFieldPaths';

import { hasActiveReregistrationTrigger } from './reregistrationState';

export type StartReregistrationDraftResult =
  | { success: true; resumeHref: string }
  | { success: false; error: 'update_failed' };

/**
 * Shared start for principal and admin reregistration.
 * Creates a registration-shaped renewal_draft and leaves public status unchanged.
 * Idempotent when a draft already exists.
 *
 * Sets `reregistered_at` when there is no active trigger yet. If admin/cron
 * already set it for this cycle, that value is kept.
 */
export async function startReregistrationDraft(
  firm: MainTravelInsuranceFirmDocument,
  now: Date = new Date(),
): Promise<StartReregistrationDraftResult> {
  if (firm.renewal_draft != null) {
    return {
      success: true,
      resumeHref: firm.renewal_resume_href ?? SUCCESS_REDIRECT_PATH,
    };
  }

  const resumeHref = SUCCESS_REDIRECT_PATH;
  const patch: Record<string, unknown> = {
    renewal_draft: buildRenewalDraftFromFirm(firm),
    renewal_resume_href: resumeHref,
  };

  if (!hasActiveReregistrationTrigger(firm)) {
    patch.reregistered_at = now.toISOString();
  }

  const result = await updateFirm(firm.id, patch);

  if (!result.success) {
    return { success: false, error: 'update_failed' };
  }

  return { success: true, resumeHref };
}
