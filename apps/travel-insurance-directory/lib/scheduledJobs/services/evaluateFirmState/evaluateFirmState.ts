import { getPrincipal, isMainFirm } from 'lib/firms/firmDocument';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
  hasFcaVisibilityBlock,
  validateReRegistration,
} from 'lib/scheduledJobs/helpers';
import { validateFcaNumber } from 'lib/validate-firms/validate-fca';
import type {
  FirmStatus,
  MainTravelInsuranceFirmDocument,
  ReregistrationLogs,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

/** Fields the nightly evaluate-firm job may patch onto a firm document. */
export type FirmStateUpdates = {
  status?: FirmStatus;
  hidden_reason?: string | null;
  reRegistrationLogs?: ReregistrationLogs | null;
  /** Main-firm only; trading updates never set this. */
  reregistered_at?: string | null;
  pending_add_to_directory?: boolean;
  pending_add_to_directory_until?: string | null;
};

const clearPendingDirectoryAction = (): FirmStateUpdates => ({
  pending_add_to_directory: false,
  pending_add_to_directory_until: null,
});

export type EvaluateFirmStateResult = {
  firmUpdates: FirmStateUpdates;
  /** Extra Cosmos patches (e.g. hide trading firms when the main firm lapses). No emails. */
  relatedFirmUpdates: Array<{
    id: string;
    updates: FirmStateUpdates;
  }>;
  failure: null | { name: string; frn: number; issue: string };
  notifyTarget: null | {
    firstName: string;
    email: string;
    emailTemplate?: 'tidInvalidFrn' | 'tidReregistration';
  };
  isParentInvalid: boolean;
};

export type EvaluateFirmStateOptions = {
  /** Pre-indexed trading firms from the same batch fetch; avoids per-main Cosmos queries. */
  tradingFirmsByMainFirmId?: Map<string, TravelInsuranceFirmDocument[]>;
};

export function indexTradingFirmsByMainFirmId(
  firms: TravelInsuranceFirmDocument[],
): Map<string, TravelInsuranceFirmDocument[]> {
  const byMainFirmId = new Map<string, TravelInsuranceFirmDocument[]>();

  for (const firm of firms) {
    if (firm.type !== 'trading' || !firm.main_firm_id) {
      continue;
    }

    const existing = byMainFirmId.get(firm.main_firm_id) ?? [];
    existing.push(firm);
    byMainFirmId.set(firm.main_firm_id, existing);
  }

  return byMainFirmId;
}

const createEmptyResult = (): EvaluateFirmStateResult => ({
  firmUpdates: {},
  relatedFirmUpdates: [],
  failure: null,
  notifyTarget: null,
  isParentInvalid: false,
});

/** AC 1 / AC 3: never overwrite an existing hide, whatever the reason. */
const isAlreadyHidden = (
  firm: Pick<TravelInsuranceFirmDocument, 'status'>,
): boolean => firm.status === 'hidden';

/** Hide linked trading firms when the main firm first lapses — visibility only, no email. */
function buildTradingReregistrationHideUpdates(
  tradingFirms: TravelInsuranceFirmDocument[],
): EvaluateFirmStateResult['relatedFirmUpdates'] {
  return tradingFirms
    .filter((tradingFirm) => !hasFcaVisibilityBlock(tradingFirm))
    .filter(
      (tradingFirm) =>
        tradingFirm.status !== 'hidden' ||
        tradingFirm.hidden_reason !== 'reregistration_required',
    )
    .map((tradingFirm) => ({
      id: tradingFirm.id,
      updates: {
        status: 'hidden' as const,
        hidden_reason: 'reregistration_required',
      },
    }));
}

/** AC 1: hide currently active trading names only; leave other hides untouched. */
function buildFcaHideUpdates(
  tradingFirms: TravelInsuranceFirmDocument[],
): EvaluateFirmStateResult['relatedFirmUpdates'] {
  return tradingFirms
    .filter((tradingFirm) => !isAlreadyHidden(tradingFirm))
    .map((tradingFirm) => ({
      id: tradingFirm.id,
      updates: {
        status: 'hidden' as const,
        hidden_reason: HIDDEN_DUE_TO_FCA,
      },
    }));
}

function buildFcaRestoreUpdates(
  tradingFirms: TravelInsuranceFirmDocument[],
): EvaluateFirmStateResult['relatedFirmUpdates'] {
  return tradingFirms
    .filter((tradingFirm) => tradingFirm.hidden_reason === HIDDEN_DUE_TO_FCA)
    .map((tradingFirm) => ({
      id: tradingFirm.id,
      updates: {
        status: 'active' as const,
        hidden_reason: null,
      },
    }));
}

const handleInvalidParent = (
  firm: TravelInsuranceFirmDocument,
  fallbackName: string,
  principal: ReturnType<typeof getPrincipal>,
  tradingFirms: TravelInsuranceFirmDocument[],
): EvaluateFirmStateResult => {
  const result = createEmptyResult();
  result.isParentInvalid = firm.type === 'main';
  result.failure = {
    name: fallbackName,
    frn: firm.fca_number,
    issue: 'Invalid Parent Firm Status',
  };

  // AC 1: hide + Invalid FRN email only on first hide. Skip if already hidden
  // (Invalid_FCA or another reason such as re-registration).
  if (!isAlreadyHidden(firm)) {
    result.firmUpdates.status = 'hidden';
    result.firmUpdates.hidden_reason = HIDDEN_DUE_TO_FCA;

    if (
      firm.type === 'main' &&
      principal?.first_name &&
      principal?.email_address
    ) {
      result.notifyTarget = {
        firstName: principal.first_name,
        email: principal.email_address,
        emailTemplate: 'tidInvalidFrn',
      };
    }
  }

  if (firm.type === 'main') {
    result.relatedFirmUpdates = buildFcaHideUpdates(tradingFirms);
  }

  return result;
};

const handleTradingFirm = (
  firm: TravelInsuranceFirmDocument,
  fcaTradingNames: string[],
  fallbackName: string,
): EvaluateFirmStateResult => {
  const result = createEmptyResult();
  const registeredName = firm.registered_name?.toLowerCase().trim() ?? '';
  const isTradingNameActive = fcaTradingNames.includes(registeredName);

  if (!isTradingNameActive) {
    // AC 3: hide as Trading_name-Inactive_or_Not_Current unless already hidden
    // (this reason is a no-op; another reason must not be overwritten).
    if (!isAlreadyHidden(firm)) {
      result.firmUpdates.status = 'hidden';
      result.firmUpdates.hidden_reason = HIDDEN_DUE_TO_TRADING_NAME;
    }
    result.failure = {
      name: fallbackName,
      frn: firm.fca_number,
      issue: 'Invalid Trading Firm',
    };
  } else if (firm.hidden_reason === HIDDEN_DUE_TO_TRADING_NAME) {
    // AC 5: restore only when this trading name was hidden by AC 3.
    result.firmUpdates.status = 'active';
    result.firmUpdates.hidden_reason = null;
  }

  return result;
};

const handleReregistration = (
  firm: TravelInsuranceFirmDocument,
  reRegChecks: ReturnType<typeof validateReRegistration>,
  fallbackName: string,
  principal: ReturnType<typeof getPrincipal>,
  tradingFirms: TravelInsuranceFirmDocument[],
): EvaluateFirmStateResult => {
  const result = createEmptyResult();

  if (
    !reRegChecks.isWithinRenewalWindow &&
    !reRegChecks.reregistrationHasLapsed
  ) {
    return result;
  }

  let sendEmail = false;

  if (!reRegChecks.hasWindowStartEmailBeenSent) {
    sendEmail = true;
    result.firmUpdates.reRegistrationLogs = {
      ...firm.reRegistrationLogs,
      reRegWindowStartEmailSentAt: new Date().toISOString(),
    };
  } else if (
    !reRegChecks.hasSentLapsedEmail &&
    reRegChecks.reregistrationHasLapsed
  ) {
    sendEmail = true;
    const nowIso = new Date().toISOString();
    result.firmUpdates.reRegistrationLogs = {
      ...firm.reRegistrationLogs,
      lapsedEmailSentAt: nowIso,
    };
    result.firmUpdates.status = 'hidden';
    result.firmUpdates.hidden_reason = 'reregistration_required';
    // Same as admin re-reg trigger so account/admin pending UI works after lapse.
    result.firmUpdates.reregistered_at = nowIso;
    Object.assign(result.firmUpdates, clearPendingDirectoryAction());

    result.relatedFirmUpdates =
      buildTradingReregistrationHideUpdates(tradingFirms);
  }

  result.failure = {
    name: fallbackName,
    frn: firm.fca_number,
    issue: `Reregistration required, firm re-registration status = ${
      reRegChecks.reregistrationHasLapsed ? 'lapsed' : 'within_window'
    }`,
  };

  // Single email to the main firm principal only.
  if (sendEmail && principal?.first_name && principal?.email_address) {
    result.notifyTarget = {
      firstName: principal.first_name,
      email: principal.email_address,
      emailTemplate: 'tidReregistration',
    };
  }

  return result;
};

/**
 * Principal renewed in-window but admin never Kept before the saved window end.
 * Hide main + trading and clear pending_add_to_directory.
 */
const handleMissedKeepDeadline = (
  firm: MainTravelInsuranceFirmDocument,
  fallbackName: string,
  tradingFirms: TravelInsuranceFirmDocument[],
  now: Date = new Date(),
): EvaluateFirmStateResult => {
  const result = createEmptyResult();

  if (
    !firm.pending_add_to_directory ||
    firm.status !== 'active' ||
    !firm.pending_add_to_directory_until
  ) {
    return result;
  }

  const until = new Date(firm.pending_add_to_directory_until);
  if (Number.isNaN(until.getTime()) || now < until) {
    return result;
  }

  const nowIso = now.toISOString();
  result.firmUpdates = {
    status: 'hidden',
    hidden_reason: 'reregistration_required',
    reregistered_at: firm.reregistered_at ?? nowIso,
    ...clearPendingDirectoryAction(),
  };
  result.failure = {
    name: fallbackName,
    frn: firm.fca_number,
    issue:
      'Reregistration required, firm re-registration status = missed_keep_deadline',
  };
  result.relatedFirmUpdates =
    buildTradingReregistrationHideUpdates(tradingFirms);

  return result;
};

export const evaluateFirmState = async (
  firm: TravelInsuranceFirmDocument,
  options: EvaluateFirmStateOptions = {},
): Promise<EvaluateFirmStateResult> => {
  const fcaValidation = await validateFcaNumber(`${firm.fca_number}`);
  const reRegChecks = validateReRegistration(firm);

  const fallbackName =
    firm.registered_name ?? fcaValidation?.firmName ?? 'Unknown';
  const principal = getPrincipal(firm);

  const tradingFirms = firm.id
    ? options.tradingFirmsByMainFirmId?.get(firm.id) ?? []
    : [];

  if (!fcaValidation?.valid) {
    return handleInvalidParent(firm, fallbackName, principal, tradingFirms);
  }

  if (firm.type === 'trading') {
    const fcaTradingNames =
      fcaValidation.tradingNames?.map((n: string) => n.toLowerCase().trim()) ||
      [];

    return handleTradingFirm(firm, fcaTradingNames, fallbackName);
  }

  if (isMainFirm(firm)) {
    const missedKeep = handleMissedKeepDeadline(
      firm,
      fallbackName,
      tradingFirms,
    );
    if (Object.keys(missedKeep.firmUpdates).length > 0) {
      return missedKeep;
    }
  }

  const result = handleReregistration(
    firm,
    reRegChecks,
    fallbackName,
    principal,
    tradingFirms,
  );

  // AC 2: FRN valid again — restore main + trading names hidden only for Invalid_FCA.
  // No restore email. Hides for another reason stay hidden.
  if (
    firm.hidden_reason === HIDDEN_DUE_TO_FCA &&
    result.firmUpdates.hidden_reason === undefined
  ) {
    result.firmUpdates.status = 'active';
    result.firmUpdates.hidden_reason = null;
    result.relatedFirmUpdates = buildFcaRestoreUpdates(tradingFirms);
  }

  return result;
};
