import {
  buildDirectoryStatusPatch,
  resolveDirectoryStatusAfterRegistration,
  resolveDirectoryStatusForFirm,
} from 'lib/account/firmSectionStatus';
import {
  getReregistrationEffectiveDateIso,
  hasActivePendingReregistration,
  isInRenewalWindow,
} from 'lib/account/reregistrationState';
import { fetchTradingDocsByMainFirmId } from 'lib/account/tradingFirm';
import { updateFirm } from 'lib/firms/updateFirm';
import { buildPromoteRenewalDraftPatch } from 'lib/register/registerFieldPaths';
import type {
  MainTravelInsuranceFirmDocument,
  RenewalDraft,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type ConfirmRegistrationSessionUser = {
  mail?: string;
  givenName?: string;
};

export type CompleteConfirmRegistrationResult =
  | { success: true }
  | { success: false; error: 'update_failed' };

function shouldSkipCosmosInCi(
  isReregistration: boolean,
  renewalDraft: RenewalDraft | null | undefined,
): boolean {
  return (
    process.env.CI === 'true' && !(isReregistration && renewalDraft != null)
  );
}

function buildRenewalPromotePatch(
  mainFirm: MainTravelInsuranceFirmDocument,
  renewalDraft: RenewalDraft,
  nowIso: string,
  now: Date,
): Record<string, unknown> {
  const wasHiddenForReregistration =
    mainFirm.status === 'hidden' &&
    mainFirm.hidden_reason === 'reregistration_required';

  // Capture window end before reregister_approved_at moves the period base.
  const windowEndIso = getReregistrationEffectiveDateIso(mainFirm);
  const inWindow = isInRenewalWindow(mainFirm, now);

  const patch: Record<string, unknown> = {
    ...buildPromoteRenewalDraftPatch(renewalDraft),
    renewal_draft: null,
    renewal_resume_href: null,
    // Confirm time becomes the next period base.
    // Keep reregistered_at (draft/admin trigger) for audit.
    reregister_approved_at: nowIso,
    // Reset per-cycle email/hide flags so the next anniversary can notify again.
    reRegistrationLogs: null,
  };

  if (wasHiddenForReregistration) {
    // Post-lapse renew: stay hidden until admin Add to Directory.
    patch.pending_add_to_directory = true;
    patch.pending_add_to_directory_until = null;
  } else if (inWindow) {
    // In-window renew: stay listed; admin must Keep on directory.
    patch.pending_add_to_directory = true;
    patch.pending_add_to_directory_until = windowEndIso;
  }

  return patch;
}

function buildFirstTimeOrLegacyPatch(
  mainFirm: MainTravelInsuranceFirmDocument,
  tradingFirms: TravelInsuranceFirmDocument[],
  isReregistration: boolean,
  nowIso: string,
): Record<string, unknown> {
  const wasHiddenForReregistration =
    isReregistration &&
    mainFirm.status === 'hidden' &&
    mainFirm.hidden_reason === 'reregistration_required';

  const mainPatch: Record<string, unknown> = {};

  if (wasHiddenForReregistration) {
    // Post-lapse renew (legacy / no draft): stay hidden until admin Add.
    mainPatch.reregister_approved_at = nowIso;
    mainPatch.reRegistrationLogs = null;
    mainPatch.pending_add_to_directory = true;
    mainPatch.pending_add_to_directory_until = null;
    return mainPatch;
  }

  const mainStatus = resolveDirectoryStatusAfterRegistration(
    mainFirm,
    tradingFirms,
  );
  Object.assign(mainPatch, buildDirectoryStatusPatch(mainStatus));

  if (isReregistration) {
    mainPatch.reregister_approved_at = nowIso;
    mainPatch.reRegistrationLogs = null;
    mainPatch.pending_add_to_directory = true;
    mainPatch.pending_add_to_directory_until = null;
  } else if (!mainFirm.approved_at) {
    mainPatch.approved_at = nowIso;
  }

  return mainPatch;
}

async function updateTradingFirmStatuses(
  tradingFirms: TravelInsuranceFirmDocument[],
): Promise<CompleteConfirmRegistrationResult> {
  for (const tradingFirm of tradingFirms) {
    const tradingStatus = resolveDirectoryStatusForFirm(tradingFirm);
    const tradingUpdate = await updateFirm(
      tradingFirm.id,
      buildDirectoryStatusPatch(tradingStatus),
    );
    if (!tradingUpdate.success) {
      return { success: false, error: 'update_failed' };
    }
  }

  return { success: true };
}

export async function completeConfirmRegistration(
  mainFirm: MainTravelInsuranceFirmDocument,
  now: Date = new Date(),
): Promise<CompleteConfirmRegistrationResult> {
  const isReregistration = hasActivePendingReregistration(mainFirm);
  const renewalDraft = mainFirm.renewal_draft;

  // First-time registration e2e uses session mocks only; skip Cosmos there.
  // Pending re-registration with a draft must still promote to Cosmos so the
  // account banner can clear under CI.
  if (shouldSkipCosmosInCi(isReregistration, renewalDraft)) {
    return { success: true };
  }

  const nowIso = now.toISOString();
  const tradingResult = await fetchTradingDocsByMainFirmId(mainFirm.id);
  const tradingFirms = tradingResult.success
    ? tradingResult.response ?? []
    : [];

  const isRenewalPromote = isReregistration && renewalDraft != null;

  const mainPatch = isRenewalPromote
    ? buildRenewalPromotePatch(mainFirm, renewalDraft, nowIso, now)
    : buildFirstTimeOrLegacyPatch(
        mainFirm,
        tradingFirms,
        isReregistration,
        nowIso,
      );

  const patchResult = await updateFirm(mainFirm.id, mainPatch);
  if (!patchResult.success) {
    return { success: false, error: 'update_failed' };
  }

  const stayHiddenAfterLapse =
    isReregistration &&
    mainFirm.status === 'hidden' &&
    mainFirm.hidden_reason === 'reregistration_required';

  // Trading firm statuses only recompute for first-time registration / legacy paths.
  // Post-lapse renew stays hidden (main + trading) until admin Add to Directory.
  if (!isRenewalPromote && !stayHiddenAfterLapse) {
    return updateTradingFirmStatuses(tradingFirms);
  }

  return { success: true };
}
