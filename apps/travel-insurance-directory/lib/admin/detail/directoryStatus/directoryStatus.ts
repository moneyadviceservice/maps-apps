import {
  canApproveFirmStatus,
  canHideFirmStatus,
  canShowAdminHideButton,
  canShowKeepOnDirectory,
  isAdminFirmActionEligible,
} from 'lib/admin/detail/actionVisibility/actionVisibility';
import { hasFcaVisibilityBlock } from 'lib/firms/fcaVisibility';
import { isMainFirm } from 'lib/firms/firmDocument';
import { invalidateFirmsListingCache } from 'lib/firms/invalidateFirmsListingCache';
import { updateFirm } from 'lib/firms/updateFirm';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export type DirectoryStatusAction = 'approve' | 'hide';

export function getAdminDirectoryStatusActionUrl(
  firmId: string,
  action: DirectoryStatusAction,
): string {
  return `/api/admin/firms/${firmId}/directory-status?action=${action}`;
}

export function parseDirectoryStatusAction(
  value: string | string[] | undefined,
): DirectoryStatusAction | null {
  if (value === 'approve' || value === 'hide') {
    return value;
  }
  return null;
}

export type DirectoryStatusError =
  | 'not_eligible'
  | 'invalid_transition'
  | 'update_failed';

export type UpdateFirmDirectoryStatusResult =
  | { success: true }
  | {
      success: false;
      error: DirectoryStatusError;
    };

function clearPendingDirectoryFields(
  firm: TravelInsuranceFirmDocument,
): Record<string, unknown> {
  if (!isMainFirm(firm)) {
    return {};
  }
  return {
    pending_add_to_directory: false,
    pending_add_to_directory_until: null,
  };
}

function getApproveTransitionError(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): DirectoryStatusError | null {
  if (!isAdminFirmActionEligible(firm, mainFirm)) {
    return 'not_eligible';
  }

  const isKeep = canShowKeepOnDirectory(firm, mainFirm);
  if (!isKeep && !canApproveFirmStatus(firm.status)) {
    return 'invalid_transition';
  }
  if (isKeep && firm.status !== 'active') {
    return 'invalid_transition';
  }

  return null;
}

async function persistDirectoryStatusUpdate(
  firmId: string,
  patch: Record<string, unknown>,
): Promise<UpdateFirmDirectoryStatusResult> {
  const result = await updateFirm(firmId, patch);
  if (!result.success) {
    return { success: false, error: 'update_failed' };
  }

  await invalidateFirmsListingCache();
  return { success: true };
}

async function approveDirectoryStatus(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Promise<UpdateFirmDirectoryStatusResult> {
  const transitionError = getApproveTransitionError(firm, mainFirm);
  if (transitionError) {
    return { success: false, error: transitionError };
  }

  const isKeep = canShowKeepOnDirectory(firm, mainFirm);
  return persistDirectoryStatusUpdate(firm.id, {
    ...(isKeep
      ? {}
      : {
          status: 'active' as const,
          hidden_at: null,
          hidden_reason: null,
        }),
    ...clearPendingDirectoryFields(firm),
  });
}

async function hideDirectoryStatus(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Promise<UpdateFirmDirectoryStatusResult> {
  if (!canShowAdminHideButton(firm, mainFirm)) {
    return {
      success: false,
      error: canHideFirmStatus(firm.status)
        ? 'not_eligible'
        : 'invalid_transition',
    };
  }

  return persistDirectoryStatusUpdate(firm.id, {
    status: 'hidden',
    hidden_at: new Date().toISOString(),
  });
}

export async function applyDirectoryStatusAction(
  action: DirectoryStatusAction,
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Promise<UpdateFirmDirectoryStatusResult> {
  if (hasFcaVisibilityBlock(firm)) {
    return { success: false, error: 'not_eligible' };
  }

  if (action === 'approve') {
    return approveDirectoryStatus(firm, mainFirm);
  }

  return hideDirectoryStatus(firm, mainFirm);
}

export async function approveFirmForDirectory(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Promise<UpdateFirmDirectoryStatusResult> {
  return applyDirectoryStatusAction('approve', firm, mainFirm);
}

export async function hideFirmFromDirectory(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): Promise<UpdateFirmDirectoryStatusResult> {
  return applyDirectoryStatusAction('hide', firm, mainFirm);
}
