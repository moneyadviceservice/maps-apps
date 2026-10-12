import { addMonths, subMonths } from 'date-fns';
import { resolveAccountFirmById } from 'lib/account/tripCover/shared';
import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { getFirmById } from 'lib/firms/fetchFirm';
import { isMainFirm } from 'lib/firms/firmDocument';
import { updateFirm } from 'lib/firms/updateFirm';
import type { IronSessionObject } from 'types/iron-session';
import type {
  MainTravelInsuranceFirmDocument,
  SpecificConditions,
} from 'types/travel-insurance-firm';

/** Maps semantic seed modes → query `mode` values for CI initialise. */
export const REREGISTRATION_SEED_QUERY = {
  thirtyDayWindow: 'reregistration-30-day-window',
  pastAnniversary: 'reregistration-past-anniversary',
} as const;

export type ReregistrationSeedMode = keyof typeof REREGISTRATION_SEED_QUERY;

export function parseReregistrationSeedMode(
  mode: string | string[] | undefined,
): ReregistrationSeedMode | null {
  const value = Array.isArray(mode) ? mode[0] : mode;
  if (value === REREGISTRATION_SEED_QUERY.thirtyDayWindow) {
    return 'thirtyDayWindow';
  }
  if (value === REREGISTRATION_SEED_QUERY.pastAnniversary) {
    return 'pastAnniversary';
  }
  return null;
}

function buildPreApprovedSpecificConditions(): SpecificConditions {
  return createMockFirm().medical_coverage.specific_conditions;
}

function buildDatingFields(
  mode: ReregistrationSeedMode,
  now: Date,
): Pick<
  MainTravelInsuranceFirmDocument,
  'approved_at' | 'reregistered_at' | 'reregister_approved_at'
> {
  if (mode === 'thirtyDayWindow') {
    const approvedAt = subMonths(now, 11);
    approvedAt.setDate(approvedAt.getDate() - 15);
    return {
      approved_at: approvedAt.toISOString(),
      reregistered_at: null,
      reregister_approved_at: null,
    };
  }

  // Cron-like: period expired (approved_at + 12m), pending trigger set.
  // Period base stays approved_at until renew confirm writes reregister_approved_at.
  const approvedAt = subMonths(now, 13);
  const pendingTriggerAt = addMonths(approvedAt, 12);
  return {
    approved_at: approvedAt.toISOString(),
    reregistered_at: pendingTriggerAt.toISOString(),
    reregister_approved_at: null,
  };
}

/**
 * Seeds the self-serve e2e firm for re-registration scenarios.
 * CI-only. Assumes reset has already run (or firm is otherwise usable).
 */
export const seedReregistrationForSS = async (
  session: IronSessionObject,
  mode: ReregistrationSeedMode,
  now: Date = new Date(),
) => {
  if (process.env.CI !== 'true') {
    console.error('Unauthorized attempt to seed reregistration data');
    return { error: 'Unauthorized', success: false };
  }

  const firmId = session.db_id;
  if (!firmId) {
    return { error: 'Could not resolve session with firm ID', success: false };
  }

  const resolved = await resolveAccountFirmById(session, firmId);
  if (!resolved || !isMainFirm(resolved.firm)) {
    return { error: 'Could not resolve session with firm ID', success: false };
  }

  const dating = buildDatingFields(mode, now);
  const mockMedical = createMockFirm().medical_coverage;

  const updateRecord = {
    ...dating,
    renewal_draft: null,
    renewal_resume_href: null,
    covered_by_ombudsman_question: 'true',
    medical_coverage: {
      ...mockMedical,
      specific_conditions: buildPreApprovedSpecificConditions(),
    },
    'service_details/supplies_documentation_when_needed_question': true,
  };

  const updateResult = await updateFirm(firmId, updateRecord);
  if (!updateResult.success) {
    return {
      error: 'A problem occurred seeding reregistration state',
      success: false,
    };
  }

  const refreshed = await getFirmById(firmId);
  const firm = refreshed.response;
  if (!refreshed.success || !firm || !isMainFirm(firm)) {
    return {
      error: 'Failed to reload firm after reregistration seed',
      success: false,
    };
  }

  // Avoid putting the full firm in the iron-session cookie (size limit).
  return { success: true, firm };
};
