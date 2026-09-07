import { startReregistrationDraft } from 'lib/account/startReregistrationDraft';
import { canShowAdminReregisterButton } from 'lib/admin/detail/actionVisibility/actionVisibility';
import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import { isMainFirm } from 'lib/firms/firmDocument';
import { invalidateFirmsListingCache } from 'lib/firms/invalidateFirmsListingCache';
import { updateFirm } from 'lib/firms/updateFirm';
import { tidReregistration } from 'lib/notify/tid-reregistration';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export function getAdminReregisterActionUrl(firmId: string): string {
  return `/api/admin/firms/${firmId}/reregister`;
}

export type ApplyFirmReregistrationResult =
  | { success: true }
  | {
      success: false;
      error: 'not_eligible' | 'not_main_firm' | 'update_failed';
    };

async function sendPrincipalReregistrationEmail(
  firm: MainTravelInsuranceFirmDocument,
): Promise<void> {
  const email = firm.principal.email_address?.trim();
  const firstName = firm.principal.first_name?.trim();

  if (!email || !firstName) {
    console.warn(
      'Skipping re-registration email: firm principal first name or email is missing.',
      { firmId: firm.id },
    );
    return;
  }

  await tidReregistration(firstName, email);
}

/**
 * Admin-triggered reregistration uses the same renewal_draft as principal start,
 * then hides the firm from the public directory until admin adds it back
 * (after the principal completes re-registration).
 * Sends the Firm Principal Notify email after a successful trigger (email failures are soft).
 */
export async function applyFirmReregistration(
  firm: TravelInsuranceFirmDocument,
): Promise<ApplyFirmReregistrationResult> {
  if (!isMainFirm(firm)) {
    return { success: false, error: 'not_main_firm' };
  }

  if (hasFcaVisibilityBlock(firm) || !canShowAdminReregisterButton(firm)) {
    return { success: false, error: 'not_eligible' };
  }

  const result = await startReregistrationDraft(firm);

  if (!result.success) {
    return { success: false, error: 'update_failed' };
  }

  const statusResult = await updateFirm(firm.id, {
    status: 'hidden',
    hidden_at: new Date().toISOString(),
    hidden_reason: 'reregistration_required',
  });

  if (!statusResult.success) {
    return { success: false, error: 'update_failed' };
  }

  await invalidateFirmsListingCache();
  await sendPrincipalReregistrationEmail(firm);

  return { success: true };
}
