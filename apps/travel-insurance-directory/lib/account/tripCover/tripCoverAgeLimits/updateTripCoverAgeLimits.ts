import type {
  TripCover,
  TripCoverAgeLimits,
} from 'types/travel-insurance-firm';

import { findTripCoverForStep, type TripCoverStep } from '../steps';

export function updateTripCoverAgeLimits(
  tripCovers: TripCover[],
  step: TripCoverStep,
  ageLimits: TripCoverAgeLimits,
): TripCover[] {
  const nowIso = new Date().toISOString();
  const matchingCover = findTripCoverForStep(tripCovers, step);

  if (!matchingCover) {
    return tripCovers;
  }

  return tripCovers.map((cover) => {
    if (cover === matchingCover) {
      return {
        ...cover,
        age_limits: ageLimits,
        updated_at: nowIso,
      };
    }

    return cover;
  });
}
