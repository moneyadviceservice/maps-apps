import { addMonths } from 'date-fns';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmBaseDocument,
} from 'types/travel-insurance-firm';

export type RegistrationDatingFields = Pick<
  MainTravelInsuranceFirmDocument,
  'approved_at' | 'reregister_approved_at' | 'reregistered_at'
>;

/**
 * True when `reregistered_at` is an active admin/cron (or prior) trigger:
 * set with no renew approval yet, or newer than the last `reregister_approved_at`.
 */
export function hasActiveReregistrationTrigger(
  firm: RegistrationDatingFields,
): boolean {
  const triggeredAt = parseTimestamp(firm.reregistered_at);
  if (!triggeredAt) {
    return false;
  }

  const approvedAt = parseTimestamp(firm.reregister_approved_at);
  return approvedAt == null || triggeredAt > approvedAt;
}

/**
 * Pending re-registration: a draft exists, or an active trigger is present.
 * `reregistered_at` is kept after confirm as an audit of the last trigger.
 */
export function hasActivePendingReregistration(
  firm: MainTravelInsuranceFirmDocument,
): boolean {
  return firm.renewal_draft != null || hasActiveReregistrationTrigger(firm);
}

function parseTimestamp(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Period base for the renewal window / anniversary.
 *
 * - First registration: `approved_at`
 * - After a completed renew: `reregister_approved_at` (confirm time)
 * - `reregistered_at` is the pending trigger only and is never the period base
 */
export function getRegistrationBaseApproval(
  firm: RegistrationDatingFields,
): Date | null {
  return parseTimestamp(firm.reregister_approved_at ?? firm.approved_at);
}

/** Public hard stop / end of the 30-day window (base + 12 months). */
export function getRegistrationAnniversary(
  firm: RegistrationDatingFields,
): Date | null {
  const base = getRegistrationBaseApproval(firm);
  return base ? addMonths(base, 12) : null;
}

/** When the 30-day renewal window opens (base + 11 months). */
export function getRenewalWindowStart(
  firm: RegistrationDatingFields,
): Date | null {
  const base = getRegistrationBaseApproval(firm);
  return base ? addMonths(base, 11) : null;
}

export function isInRenewalWindow(
  firm: RegistrationDatingFields,
  now: Date = new Date(),
): boolean {
  const windowStart = getRenewalWindowStart(firm);
  const anniversary = getRegistrationAnniversary(firm);
  if (!windowStart || !anniversary) {
    return false;
  }

  return now >= windowStart && now < anniversary;
}

/** Calendar re-registration date (end of the current 30-day window). */
export function getReregistrationEffectiveDateIso(
  firm: RegistrationDatingFields,
): string | null {
  const anniversary = getRegistrationAnniversary(firm);
  return anniversary ? anniversary.toISOString() : null;
}

/** Has the re-registration date passed? */
export function hasReregistrationLapsed(
  firm: RegistrationDatingFields,
  now: Date = new Date(),
): boolean {
  const anniversary = getRegistrationAnniversary(firm);
  if (!anniversary) {
    return false;
  }

  return now >= anniversary;
}

/** Has the first re-registration email been sent? */
export function hasRegWindowStartEmailBeenSent(
  firm: TravelInsuranceFirmBaseDocument,
): boolean {
  const reRegWindowStartEmailSentAt =
    firm.reRegistrationLogs?.reRegWindowStartEmailSentAt;

  return !!reRegWindowStartEmailSentAt;
}

/** Has the lapsed re-registration email been sent? */
export function hasLapsedRegistrationEmailBeenSent(
  firm: TravelInsuranceFirmBaseDocument,
): boolean {
  const lapsedEmailSentAt = firm.reRegistrationLogs?.lapsedEmailSentAt;

  if (!lapsedEmailSentAt) {
    return false;
  }

  return !!lapsedEmailSentAt;
}
