import type {
  MainTravelInsuranceFirmDocument,
  RenewalDraft,
} from 'types/travel-insurance-firm';

import { emptySpecificConditions } from 'lib/firms/firmDefaults';

/**
 * Maps registration form field keys to Cosmos patch paths for v2 main firm documents.
 */
const FIRM_FIELD_PATHS: Record<string, string> = {
  covered_by_ombudsman_question: 'covered_by_ombudsman_question',
  risk_profile_approach_question:
    'medical_coverage/risk_profile_approach_question',
  supplies_document_when_needed_question:
    'service_details/supplies_documentation_when_needed_question',
};

const RENEWAL_DRAFT_PREFIX = 'renewal_draft/';

function getValueAtPath(source: unknown, path: string): unknown {
  return path.split('/').reduce<unknown>((current, segment) => {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, source);
}

function formatFirmFieldValue(fieldKey: string, raw: unknown): string {
  if (fieldKey === 'supplies_document_when_needed_question') {
    if (raw === true) return 'true';
    if (raw === false) return 'false';
    return '';
  }

  if (raw == null) return '';
  return String(raw);
}

/** Reads a saved registration answer for pre-fill (firm or scenario). */
export function getRegistrationFieldValue(
  source: Record<string, unknown> | null | undefined,
  fieldKey: string,
  currentPath: '/register/firm' | '/register/scenario',
): string {
  if (!source || !fieldKey) return '';

  if (currentPath !== '/register/firm') {
    const value = source[fieldKey];
    return value == null || value === '' ? '' : String(value);
  }

  const path = FIRM_FIELD_PATHS[fieldKey] ?? fieldKey;
  const raw = getValueAtPath(source, path);
  return formatFirmFieldValue(fieldKey, raw);
}

export function buildRegistrationUpdate(
  currentPath: string,
  field: string,
  value: string,
): Record<string, string | boolean> {
  if (currentPath !== '/register/firm') {
    return { [`medical_coverage/specific_conditions/${field}`]: value };
  }

  const path = FIRM_FIELD_PATHS[field] ?? field;

  if (field === 'supplies_document_when_needed_question') {
    return { [path]: value === 'true' };
  }

  return { [path]: value };
}

/** Nest registration patch paths under `renewal_draft/` for in-progress renewal. */
export function prefixRegistrationUpdateForRenewalDraft(
  updates: Record<string, string | boolean>,
): Record<string, string | boolean> {
  return Object.fromEntries(
    Object.entries(updates).map(([path, value]) => [
      `${RENEWAL_DRAFT_PREFIX}${path}`,
      value,
    ]),
  );
}

export function buildRenewalDraftFromFirm(
  firm: MainTravelInsuranceFirmDocument,
): RenewalDraft {
  return {
    covered_by_ombudsman_question: firm.covered_by_ombudsman_question ?? null,
    medical_coverage: {
      risk_profile_approach_question:
        firm.medical_coverage?.risk_profile_approach_question ?? null,
      specific_conditions: {
        ...emptySpecificConditions(),
        ...firm.medical_coverage?.specific_conditions,
      },
    },
    service_details: {
      supplies_documentation_when_needed_question:
        firm.service_details?.supplies_documentation_when_needed_question ??
        null,
    },
  };
}

/** Flatten a renewal draft into live firm field paths for promote-on-submit. */
export function buildPromoteRenewalDraftPatch(
  draft: RenewalDraft,
): Record<string, unknown> {
  const patch: Record<string, unknown> = {
    covered_by_ombudsman_question: draft.covered_by_ombudsman_question,
    'service_details/supplies_documentation_when_needed_question':
      draft.service_details.supplies_documentation_when_needed_question,
    'medical_coverage/risk_profile_approach_question':
      draft.medical_coverage.risk_profile_approach_question,
  };

  for (const [key, value] of Object.entries(
    draft.medical_coverage.specific_conditions,
  )) {
    patch[`medical_coverage/specific_conditions/${key}`] = value;
  }

  return patch;
}
