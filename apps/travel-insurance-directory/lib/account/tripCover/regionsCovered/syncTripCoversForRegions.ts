import { TRIP_COVER_TRIP_TYPES } from 'data/pages/account/tripCover/tripCoverConfig';
import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';
import type {
  CoverArea,
  TripCover,
  TripType,
} from 'types/travel-insurance-firm';

function tripCoverKey(coverArea: CoverArea, tripType: TripType): string {
  return `${coverArea}:${tripType}`;
}

function dedupeTripCoversByKey(tripCovers: TripCover[]): TripCover[] {
  const byKey = new Map<string, TripCover>();

  for (const cover of tripCovers) {
    const key = tripCoverKey(cover.cover_area, cover.trip_type);
    const existing = byKey.get(key);

    if (!existing || cover.updated_at > existing.updated_at) {
      byKey.set(key, cover);
    }
  }

  return [...byKey.values()];
}

export function syncTripCoversForRegions(
  existingTripCovers: TripCover[],
  selectedAreas: CoverArea[],
): TripCover[] {
  const nowIso = new Date().toISOString();

  const existingByKey = new Map<string, TripCover>();
  for (const cover of dedupeTripCoversByKey(existingTripCovers)) {
    existingByKey.set(tripCoverKey(cover.cover_area, cover.trip_type), cover);
  }

  const synced: TripCover[] = [];

  for (const coverArea of selectedAreas) {
    for (const tripType of TRIP_COVER_TRIP_TYPES) {
      const key = tripCoverKey(coverArea, tripType);
      const existing = existingByKey.get(key);

      if (existing) {
        synced.push(existing);
        continue;
      }

      synced.push({
        trip_type: tripType,
        cover_area: coverArea,
        age_limits: emptyTripCoverAgeLimits(),
        created_at: nowIso,
        updated_at: nowIso,
      });
    }
  }

  return synced;
}
