/**
 * In-memory filter for firms. Used by both Redis path and Cosmos fallback
 * so listing reads have a single source of truth for filter logic.
 *
 * All filters support multi-select (OR within a filter, AND across filters).
 */

import type {
  AgeLimits,
  CoverArea,
  TravelInsuranceFirmDocument,
  TripType,
} from 'types/travel-insurance-firm';
import type { QueryParams } from 'utils/query/queryHelpers';
import { getQueryValue } from 'utils/query/queryHelpers';

const STATUS_ACTIVE = 'active';

const TRIP_TYPES = new Set<TripType>(['single_trip', 'annual_multi_trip']);
const COVER_AREAS = new Set<CoverArea>([
  'uk_and_europe',
  'worldwide_excluding_us_canada',
  'worldwide_including_us_canada',
]);

const AGE_LIMIT_KEYS = [
  'land_30_days_max_age',
  'cruise_30_days_max_age',
  'land_45_days_max_age',
  'cruise_45_days_max_age',
  'land_50_days_max_age',
  'cruise_50_days_max_age',
  'land_55_days_max_age',
  'cruise_55_days_max_age',
] as const;

const TRIP_LENGTH_TO_DAYS: Record<string, number> = {
  up_to_30_days: 30,
  up_to_90_days: 55,
  '90_days_plus': 55,
};

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

const CRUISE_AGE_KEYS = AGE_LIMIT_KEYS.filter((k) => k.startsWith('cruise_'));
const LAND_AGE_KEYS = AGE_LIMIT_KEYS.filter((k) => k.startsWith('land_'));

/* ------------------------------------------------------------------ */
/*  Query helpers                                                     */
/* ------------------------------------------------------------------ */

function getMultiString(query: QueryParams, key: string): string[] {
  const v = getQueryValue(query, key);
  if (typeof v === 'string' && v.trim() !== '') return [v.trim()];
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  return [];
}

/* ------------------------------------------------------------------ */
/*  Age-limit helpers                                                 */
/* ------------------------------------------------------------------ */

function getAgeLimit(
  ageLimits: AgeLimits | undefined | null,
  key: string,
): number | null {
  if (ageLimits == null || typeof ageLimits !== 'object') return null;
  const v = (ageLimits as unknown as Record<string, number | null>)[key];
  return typeof v === 'number' ? v : null;
}

function hasAnyPositiveAgeLimit(
  ageLimits: AgeLimits | undefined | null,
  keys: readonly string[],
): boolean {
  for (const k of keys) {
    const val = getAgeLimit(ageLimits, k);
    if (val != null && val > 0) return true;
  }
  return false;
}

function ageLimitKeys(cruiseValues: string[]): readonly string[] {
  if (cruiseValues.length === 0) return AGE_LIMIT_KEYS;
  const hasLand = cruiseValues.includes('false');
  const hasCruise = cruiseValues.includes('true');
  if (hasLand && hasCruise) return AGE_LIMIT_KEYS;
  if (hasCruise) return CRUISE_AGE_KEYS;
  if (hasLand) return LAND_AGE_KEYS;
  return AGE_LIMIT_KEYS;
}

/* ------------------------------------------------------------------ */
/*  Cruise / land filter                                              */
/* ------------------------------------------------------------------ */

function firmMatchesCruise(
  firm: TravelInsuranceFirmDocument,
  cruiseValues: string[],
): boolean {
  if (cruiseValues.length === 0) return true;
  for (const val of cruiseValues) {
    const isCruise = val === 'true';
    const keys = isCruise ? CRUISE_AGE_KEYS : LAND_AGE_KEYS;
    for (const tc of firm.trip_covers ?? []) {
      if (hasAnyPositiveAgeLimit(tc?.age_limits, keys)) return true;
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

function tripCoverMatchesDays(
  al: AgeLimits | undefined | null,
  days: number,
  checkLand: boolean,
  checkCruise: boolean,
): boolean {
  if (checkLand) {
    const val = getAgeLimit(al, `land_${days}_days_max_age`);
    if (val != null && val > 0) return true;
  }
  if (checkCruise) {
    const val = getAgeLimit(al, `cruise_${days}_days_max_age`);
    if (val != null && val > 0) return true;
  }
  return false;
}

function firmMatchesTripLengths(
  firm: TravelInsuranceFirmDocument,
  tripLengths: string[],
  cruiseValues: string[],
  tripTypes: string[],
): boolean {
  const daysList = tripLengths
    .map((tl) => TRIP_LENGTH_TO_DAYS[tl])
    .filter((d): d is number => d != null);
  if (daysList.length === 0) return true;

  const checkLand = cruiseValues.length === 0 || cruiseValues.includes('false');
  const checkCruise =
    cruiseValues.length === 0 || cruiseValues.includes('true');
  const validTripTypes = tripTypes.filter((t) => TRIP_TYPES.has(t as TripType));

  for (const days of daysList) {
    for (const tc of firm.trip_covers ?? []) {
      if (validTripTypes.length > 0 && !validTripTypes.includes(tc.trip_type))
        continue;
      if (tripCoverMatchesDays(tc?.age_limits, days, checkLand, checkCruise))
        return true;
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Age range filter (multi-select checkbox ranges)                   */
/* ------------------------------------------------------------------ */

function firmMatchesAgeRanges(
  firm: TravelInsuranceFirmDocument,
  ageRanges: string[],
  cruiseValues: string[],
): boolean {
  const upperBounds = ageRanges
    .map((r) => AGE_RANGE_UPPER_BOUNDS[r])
    .filter((b): b is number => b != null);
  if (upperBounds.length === 0) return true;

  const keys = ageLimitKeys(cruiseValues);

  for (const upperBound of upperBounds) {
    for (const tc of firm.trip_covers ?? []) {
      const al = tc?.age_limits;
      for (const k of keys) {
        const val = getAgeLimit(al, k);
        if (val != null && val > 0 && val >= upperBound) return true;
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
  if (firm.status !== STATUS_ACTIVE) return false;

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
