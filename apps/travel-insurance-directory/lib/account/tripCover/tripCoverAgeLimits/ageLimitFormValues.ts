/**
 * Trip cover age-limit form parsing and step completion.
 * A step is complete when all six fields are saved as numbers (including not offered).
 * Listing eligibility is separate — see hasPositiveAgeLimit in lib/firms/firmDocument.ts.
 */
import {
  TRIP_COVER_AGE_LIMIT_OPTIONS,
  TRIP_COVER_AGE_MODES,
  TRIP_COVER_DURATION_SECTIONS,
} from 'data/pages/account/tripCover/tripCoverConfig';
import type { AgeLimitMode } from 'lib/firms/firmDocument';
import type {
  TripCover,
  TripCoverAgeLimits,
  TripDurationBucket,
} from 'types/travel-insurance-firm';

const VALID_AGE_LIMIT_VALUES = new Set(
  TRIP_COVER_AGE_LIMIT_OPTIONS.map((option) => option.value),
);

export function ageLimitFieldKey(
  bucket: TripDurationBucket,
  mode: AgeLimitMode,
): string {
  return `${bucket}_${mode}`;
}

export const AGE_LIMIT_FIELD_KEYS = TRIP_COVER_DURATION_SECTIONS.flatMap(
  ({ bucket }) =>
    TRIP_COVER_AGE_MODES.map(({ mode }) => ageLimitFieldKey(bucket, mode)),
);

export function formatAgeLimitForSelect(stored: number | null): string {
  if (stored == null) {
    return '';
  }

  return String(stored);
}

export function formatAgeLimitsToFormValues(
  ageLimits: TripCoverAgeLimits,
): Record<string, string> {
  const values: Record<string, string> = {};

  for (const { bucket } of TRIP_COVER_DURATION_SECTIONS) {
    for (const { mode } of TRIP_COVER_AGE_MODES) {
      const key = ageLimitFieldKey(bucket, mode);
      values[key] = formatAgeLimitForSelect(ageLimits[bucket][mode]);
    }
  }

  return values;
}

export function parseAgeLimitValue(raw: string | undefined): number | null {
  const value = (raw ?? '').trim();
  if (!value || !VALID_AGE_LIMIT_VALUES.has(value)) {
    return null;
  }

  return Number(value);
}

export function parseAgeLimitFields(
  body: Record<string, string | string[] | undefined>,
): {
  ageLimits: TripCoverAgeLimits | null;
  fieldErrors: Record<string, { error: 'required' }>;
} {
  const fieldErrors: Record<string, { error: 'required' }> = {};
  const ageLimits: TripCoverAgeLimits = {
    up_to_30_days: { land: null, cruise: null },
    up_to_90_days: { land: null, cruise: null },
    over_90_days: { land: null, cruise: null },
  };

  for (const key of AGE_LIMIT_FIELD_KEYS) {
    const raw = body[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    const parsed = parseAgeLimitValue(value);

    if (parsed == null) {
      fieldErrors[key] = { error: 'required' };
      continue;
    }

    const separatorIndex = key.lastIndexOf('_');
    const bucket = key.slice(0, separatorIndex) as TripDurationBucket;
    const mode = key.slice(separatorIndex + 1) as AgeLimitMode;

    ageLimits[bucket][mode] = parsed;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ageLimits: null, fieldErrors };
  }

  return { ageLimits, fieldErrors };
}

export function areAgeLimitsSaved(ageLimits: TripCoverAgeLimits): boolean {
  for (const { bucket } of TRIP_COVER_DURATION_SECTIONS) {
    for (const { mode } of TRIP_COVER_AGE_MODES) {
      if (typeof ageLimits[bucket][mode] !== 'number') {
        return false;
      }
    }
  }

  return true;
}

export function isTripCoverAgeStepComplete(tripCover: TripCover): boolean {
  return (
    tripCover.age_limits != null && areAgeLimitsSaved(tripCover.age_limits)
  );
}
