import { areFirmSectionsComplete } from 'lib/account/firmSectionStatus';
import { hasSuccessfulRegistrationApproval } from 'lib/account/registrationCompletion';
import { hasActivePendingReregistration } from 'lib/account/reregistrationState';
import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import { isMainFirm, isTradingFirm } from 'lib/firms/firmDocument';
import type {
  FirmStatus,
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export { areFirmSectionsComplete } from 'lib/account/firmSectionStatus';

export function isRegistrationEligibleForAdminActions(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): boolean {
  if (isMainFirm(firm)) {
    return hasSuccessfulRegistrationApproval(firm);
  }

  if (isTradingFirm(firm)) {
    return mainFirm != null && hasSuccessfulRegistrationApproval(mainFirm);
  }

  return false;
}

export function isAdminFirmActionEligible(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): boolean {
  return (
    areFirmSectionsComplete(firm) &&
    isRegistrationEligibleForAdminActions(firm, mainFirm)
  );
}

export function canApproveFirmStatus(status: FirmStatus): boolean {
  return status === 'pending_approval' || status === 'hidden';
}

export function canHideFirmStatus(status: FirmStatus): boolean {
  return status === 'active';
}

export { hasActivePendingReregistration } from 'lib/account/reregistrationState';

export function getMainFirmForAdminActions(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): MainTravelInsuranceFirmDocument | null {
  if (isMainFirm(firm)) {
    return firm;
  }
  return mainFirm;
}

/** Main firm awaiting admin Keep after in-window renew (still listed). */
export function canShowKeepOnDirectory(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
  now: Date = new Date(),
): boolean {
  const main = getMainFirmForAdminActions(firm, mainFirm);
  if (main == null || !isMainFirm(firm) || hasFcaVisibilityBlock(firm)) {
    return false;
  }

  if (
    !isAdminFirmActionEligible(firm, mainFirm) ||
    hasActivePendingReregistration(main) ||
    firm.status !== 'active' ||
    !main.pending_add_to_directory
  ) {
    return false;
  }

  // Prefer saved window end; if missing, still show while pending + active.
  if (main.pending_add_to_directory_until) {
    const until = new Date(main.pending_add_to_directory_until);
    if (!Number.isNaN(until.getTime()) && now >= until) {
      return false;
    }
  }

  return true;
}

export function canShowAdminApproveButton(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): boolean {
  const main = getMainFirmForAdminActions(firm, mainFirm);
  if (main == null || hasFcaVisibilityBlock(firm)) {
    return false;
  }

  // Keep on directory takes precedence for active + pending renew.
  if (canShowKeepOnDirectory(firm, mainFirm)) {
    return false;
  }

  return (
    isAdminFirmActionEligible(firm, mainFirm) &&
    !hasActivePendingReregistration(main) &&
    canApproveFirmStatus(firm.status)
  );
}

export function canShowAdminReregisterButton(
  firm: TravelInsuranceFirmDocument,
): boolean {
  return (
    isMainFirm(firm) &&
    firm.approved_at != null &&
    !hasActivePendingReregistration(firm) &&
    !hasFcaVisibilityBlock(firm)
  );
}

/** Listed firms can always be hidden; section completeness is not required. */
export function canShowAdminHideButton(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): boolean {
  if (hasFcaVisibilityBlock(firm) || canShowKeepOnDirectory(firm, mainFirm)) {
    return false;
  }

  return (
    canHideFirmStatus(firm.status) &&
    isRegistrationEligibleForAdminActions(firm, mainFirm)
  );
}

export function getAdminFirmActionVisibility(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): {
  showApprove: boolean;
  showKeep: boolean;
  showHide: boolean;
  showReregister: boolean;
  approveLabel: 'Add to Directory' | 'Keep on directory';
} {
  if (hasFcaVisibilityBlock(firm)) {
    return {
      showApprove: false,
      showKeep: false,
      showHide: false,
      showReregister: false,
      approveLabel: 'Add to Directory',
    };
  }

  const showKeep = canShowKeepOnDirectory(firm, mainFirm);
  const showApprove = canShowAdminApproveButton(firm, mainFirm);

  return {
    showApprove: showApprove || showKeep,
    showKeep,
    showHide: canShowAdminHideButton(firm, mainFirm),
    showReregister: canShowAdminReregisterButton(firm),
    approveLabel: showKeep ? 'Keep on directory' : 'Add to Directory',
  };
}
