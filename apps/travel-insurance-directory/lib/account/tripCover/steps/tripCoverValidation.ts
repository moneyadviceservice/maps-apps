import {
  TRIP_COVER_REGION_OPTIONS,
  TRIP_COVER_TRIP_TYPES,
} from 'data/pages/account/tripCover/tripCoverConfig';
import type { ParsedUrlQuery } from 'node:querystring';
import type { CoverArea, TripType } from 'types/travel-insurance-firm';

import type { TripCoverStep } from './tripCoverSteps';

export const VALID_COVER_AREAS = new Set(
  TRIP_COVER_REGION_OPTIONS.map((option) => option.value),
);

export const VALID_TRIP_TYPES = new Set<TripType>(TRIP_COVER_TRIP_TYPES);

export function parseTripCoverStepParams(
  coverArea: string,
  tripType: string,
): TripCoverStep | null {
  const trimmedCoverArea = coverArea.trim();
  const trimmedTripType = tripType.trim();

  if (
    !VALID_COVER_AREAS.has(trimmedCoverArea as CoverArea) ||
    !VALID_TRIP_TYPES.has(trimmedTripType as TripType)
  ) {
    return null;
  }

  return {
    coverArea: trimmedCoverArea as CoverArea,
    tripType: trimmedTripType as TripType,
  };
}

export function parseCoverAreas(
  raw: string | string[] | undefined,
): CoverArea[] {
  const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return values.filter((value): value is CoverArea =>
    VALID_COVER_AREAS.has(value as CoverArea),
  );
}

export function parseTripCoverStepFromParams(
  params: ParsedUrlQuery | undefined,
): TripCoverStep | null {
  const coverArea =
    typeof params?.coverArea === 'string' ? params.coverArea : '';
  const tripType = typeof params?.tripType === 'string' ? params.tripType : '';

  return parseTripCoverStepParams(coverArea, tripType);
}
