import {
  NO_AGE_RESTRICTION_VALUE,
  NOT_OFFERED_VALUE,
  TRIP_COVER_AGE_LIMIT_OPTIONS,
} from 'data/pages/account/tripCover/tripCoverConfig';
import type {
  TripCoverAgeLimits,
  TripDurationBucket,
} from 'types/travel-insurance-firm';

const AGE_LIMIT_LABELS = new Map(
  TRIP_COVER_AGE_LIMIT_OPTIONS.map((option) => [option.value, option.text]),
);

export function formatAgeLimitDisplay(stored: number | null): string {
  if (stored == null) {
    return (
      AGE_LIMIT_LABELS.get(String(NO_AGE_RESTRICTION_VALUE)) ??
      'No age restriction'
    );
  }

  return (
    AGE_LIMIT_LABELS.get(String(stored)) ??
    (stored === NOT_OFFERED_VALUE ? 'Not offered' : String(stored))
  );
}

export function formatDurationBucketDisplay(
  ageLimits: TripCoverAgeLimits | undefined,
  bucket: TripDurationBucket,
): string {
  if (!ageLimits) {
    return formatAgeLimitDisplay(null);
  }

  const land = formatAgeLimitDisplay(ageLimits[bucket].land);
  const cruise = formatAgeLimitDisplay(ageLimits[bucket].cruise);

  if (land === cruise) {
    return land;
  }

  return `Land: ${land}, Cruise: ${cruise}`;
}
