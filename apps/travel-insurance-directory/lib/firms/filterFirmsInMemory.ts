/**
 * In-memory filter for firms. Used by both Redis path and Cosmos fallback
 * so listing reads have a single source of truth for filter logic.
 *
 * All filters support multi-select (OR within a filter, AND across filters).
 */

import {
  getAgeLimit,
  hasPositiveAgeLimit,
  tripLengthToBucket,
  type AgeLimitMode,
} from 'lib/firms/firmDocument';
import { isListedOnPublicDirectory } from 'lib/firms/fcaVisibility';
import type {
  CoverArea,
  TravelInsuranceFirmDocument,
  TripCoverAgeLimits,
  TripDurationBucket,
  TripType,
} from 'types/travel-insurance-firm';
import type { QueryParams } from 'utils/query/queryHelpers';
import { getQueryValue } from 'utils/query/queryHelpers';

const TRIP_TYPES = new Set<TripType>(['single_trip', 'annual_multi_trip']);
const COVER_AREAS = new Set<CoverArea>([
  'uk_and_europe',
  'worldwide_excluding_us_canada',
  'worldwide_including_us_canada',
]);

const ALL_BUCKETS: TripDurationBucket[] = [
  'up_to_30_days',
  'up_to_90_days',
  'over_90_days',
];

/**
 * Map age range checkbox values to the upper bound age used for filtering.
 * A firm matches a range if its max_age >= the upper bound.
 */
const AGE_RANGE_UPPER_BOUNDS: Record<string, number> = {
  '0-16': 16,
  '17-69': 69,
  '70-74': 74,
  '75-85': 85,
  '86+': 86,
};

/* ------------------------------------------------------------------ */
/*  Query helpers                                                     */
/* ------------------------------------------------------------------ */

function getMultiString(query: QueryParams, key: string): string[] {
  const v = getQueryValue(query, key);
  if (typeof v === 'string' && v.trim() !== '') return [v.trim()];
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  return [];
}

function bucketsForModes(modes: AgeLimitMode[]): TripDurationBucket[] {
  return ALL_BUCKETS;
}

function modesFromCruiseValues(cruiseValues: string[]): AgeLimitMode[] {
  if (cruiseValues.length === 0) return ['land', 'cruise'];
  const modes: AgeLimitMode[] = [];
  if (cruiseValues.includes('false')) modes.push('land');
  if (cruiseValues.includes('true')) modes.push('cruise');
  return modes.length > 0 ? modes : ['land', 'cruise'];
}

/* ------------------------------------------------------------------ */
/*  Cruise / land filter                                              */
/* ------------------------------------------------------------------ */

function firmMatchesCruise(
  firm: TravelInsuranceFirmDocument,
  cruiseValues: string[],
): boolean {
  if (cruiseValues.length === 0) return true;
  const modes = modesFromCruiseValues(cruiseValues);
  const buckets = bucketsForModes(modes);

  for (const tc of firm.trip_covers ?? []) {
    for (const bucket of buckets) {
      for (const mode of modes) {
        if (hasPositiveAgeLimit(tc?.age_limits, bucket, mode)) return true;
      }
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Trip type filter (multi-select)                                   */
/* ------------------------------------------------------------------ */

function firmMatchesTripTypes(
  firm: TravelInsuranceFirmDocument,
  tripTypes: string[],
): boolean {
  const valid = tripTypes.filter((t) => TRIP_TYPES.has(t as TripType));
  if (valid.length === 0) return true;
  return (firm.trip_covers ?? []).some((tc) => valid.includes(tc.trip_type));
}

/* ------------------------------------------------------------------ */
/*  Cover area filter (multi-select)                                  */
/* ------------------------------------------------------------------ */

function firmMatchesCoverAreas(
  firm: TravelInsuranceFirmDocument,
  coverAreas: string[],
): boolean {
  const valid = coverAreas.filter((a) => COVER_AREAS.has(a as CoverArea));
  if (valid.length === 0) return true;
  return (firm.trip_covers ?? []).some((tc) => valid.includes(tc.cover_area));
}

/* ------------------------------------------------------------------ */
/*  Trip length filter (coupled with trip type on the same cover)     */
/* ------------------------------------------------------------------ */

function tripCoverMatchesBucket(
  al: TripCoverAgeLimits | undefined | null,
  bucket: TripDurationBucket,
  modes: AgeLimitMode[],
): boolean {
  for (const mode of modes) {
    if (hasPositiveAgeLimit(al, bucket, mode)) return true;
  }
  return false;
}

function firmMatchesTripLengths(
  firm: TravelInsuranceFirmDocument,
  tripLengths: string[],
  cruiseValues: string[],
  tripTypes: string[],
): boolean {
  const buckets = tripLengths
    .map((tl) => tripLengthToBucket(tl))
    .filter((b): b is TripDurationBucket => b != null);
  if (buckets.length === 0) return true;

  const modes = modesFromCruiseValues(cruiseValues);
  const validTripTypes = tripTypes.filter((t) => TRIP_TYPES.has(t as TripType));

  for (const bucket of buckets) {
    for (const tc of firm.trip_covers ?? []) {
      if (validTripTypes.length > 0 && !validTripTypes.includes(tc.trip_type))
        continue;
      if (tripCoverMatchesBucket(tc?.age_limits, bucket, modes)) return true;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Age range filter (multi-select checkbox ranges)                   */
/* ------------------------------------------------------------------ */

function tripCoverMeetsAgeUpperBound(
  ageLimits: TripCoverAgeLimits | undefined | null,
  buckets: TripDurationBucket[],
  modes: AgeLimitMode[],
  upperBound: number,
): boolean {
  for (const bucket of buckets) {
    for (const mode of modes) {
      const val = getAgeLimit(ageLimits, bucket, mode);
      if (val != null && val >= upperBound) return true;
    }
  }
  return false;
}

function firmMatchesAgeRanges(
  firm: TravelInsuranceFirmDocument,
  ageRanges: string[],
  cruiseValues: string[],
): boolean {
  const upperBounds = ageRanges
    .map((r) => AGE_RANGE_UPPER_BOUNDS[r])
    .filter((b): b is number => b != null);
  if (upperBounds.length === 0) return true;

  const modes = modesFromCruiseValues(cruiseValues);
  const buckets = bucketsForModes(modes);

  for (const upperBound of upperBounds) {
    for (const tc of firm.trip_covers ?? []) {
      if (
        tripCoverMeetsAgeUpperBound(tc?.age_limits, buckets, modes, upperBound)
      ) {
        return true;
      }
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Main filter                                                       */
/* ------------------------------------------------------------------ */

function firmMatchesParams(
  firm: TravelInsuranceFirmDocument,
  queryParams: QueryParams,
): boolean {
  if (!isListedOnPublicDirectory(firm)) return false;

  const tripTypes = getMultiString(queryParams, 'trip_type');
  if (!firmMatchesTripTypes(firm, tripTypes)) return false;

  const coverAreas = getMultiString(queryParams, 'cover_area');
  if (!firmMatchesCoverAreas(firm, coverAreas)) return false;

  const cruiseValues = getMultiString(queryParams, 'is_cruise');
  if (!firmMatchesCruise(firm, cruiseValues)) return false;

  const tripLengths = getMultiString(queryParams, 'trip_length');
  if (!firmMatchesTripLengths(firm, tripLengths, cruiseValues, tripTypes))
    return false;

  const ageRanges = getMultiString(queryParams, 'age');
  if (!firmMatchesAgeRanges(firm, ageRanges, cruiseValues)) return false;

  return true;
}

/**
 * Filter firms in memory by query params.
 * Firms must already be in display order (e.g. from Redis all-firms list).
 */
export function filterFirmsInMemory(
  firms: TravelInsuranceFirmDocument[],
  queryParams: QueryParams,
): TravelInsuranceFirmDocument[] {
  return firms.filter((firm) => firmMatchesParams(firm, queryParams));
}
