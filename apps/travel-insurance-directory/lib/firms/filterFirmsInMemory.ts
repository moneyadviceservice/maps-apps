/**
 * In-memory filter for firms. Used by both Redis path and Cosmos fallback
 * so listing reads have a single source of truth for filter logic.
 */

import type {
  AgeLimits,
  CoverArea,
  TravelInsuranceFirmDocument,
  TripCoverAdvance,
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
const TRIP_COVER_ADVANCES = new Set<TripCoverAdvance>([
  'up_to_6_month',
  'up_to_12_month',
  'up_to_18_month',
  'up_to_24_month',
]);

const TRIP_COVER_ADVANCE_ORDER: TripCoverAdvance[] = [
  'up_to_6_month',
  'up_to_12_month',
  'up_to_18_month',
  'up_to_24_month',
];

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
  up_to_1_month: 30,
  '1_to_3_months': 45,
  '3_to_6_months': 50,
  over_6_months: 55,
  no_longer_than_31_days: 30,
  no_longer_than_45_days: 45,
  no_longer_than_55_days: 55,
};

const CRUISE_AGE_KEYS = AGE_LIMIT_KEYS.filter((k) => k.startsWith('cruise_'));
const LAND_AGE_KEYS = AGE_LIMIT_KEYS.filter((k) => k.startsWith('land_'));

function getSingleString(query: QueryParams, key: string): string | undefined {
  const v = getQueryValue(query, key);
  if (typeof v === 'string' && v.trim() !== '') return v.trim();
  if (Array.isArray(v) && v.length > 0 && String(v[0]).trim() !== '')
    return String(v[0]).trim();
  return undefined;
}

function parseIsCruiseBool(value: string | undefined): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function allowedAdvancesForWhenTravelling(
  userAdvance: TripCoverAdvance,
): TripCoverAdvance[] {
  const idx = TRIP_COVER_ADVANCE_ORDER.indexOf(userAdvance);
  if (idx < 0) return [];
  return TRIP_COVER_ADVANCE_ORDER.slice(idx);
}

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

function tripCoversMatchCruiseLand(
  firm: TravelInsuranceFirmDocument,
  isCruise: boolean,
): boolean {
  const keys = isCruise ? CRUISE_AGE_KEYS : LAND_AGE_KEYS;
  for (const tc of firm.trip_covers ?? []) {
    if (hasAnyPositiveAgeLimit(tc?.age_limits, keys)) return true;
  }
  return false;
}

function tripCoversMatchTripLength(
  firm: TravelInsuranceFirmDocument,
  tripType: string,
  days: number,
  isCruise: boolean | undefined,
  userAge: number,
  hasAge: boolean,
): boolean {
  const landKey = `land_${days}_days_max_age`;
  const cruiseKey = `cruise_${days}_days_max_age`;
  for (const tc of firm.trip_covers ?? []) {
    if (tc.trip_type !== tripType) continue;
    const al = tc?.age_limits;
    const landVal = getAgeLimit(al, landKey);
    const cruiseVal = getAgeLimit(al, cruiseKey);
    const landOk =
      landVal != null && landVal > 0 && (!hasAge || landVal >= userAge);
    const cruiseOk =
      cruiseVal != null && cruiseVal > 0 && (!hasAge || cruiseVal >= userAge);
    if (isCruise === true && cruiseOk) return true;
    if (isCruise === false && landOk) return true;
    if (isCruise !== true && isCruise !== false && (landOk || cruiseOk))
      return true;
  }
  return false;
}

function tripCoversMatchAgeOnly(
  firm: TravelInsuranceFirmDocument,
  userAge: number,
  isCruise: string | undefined,
): boolean {
  let keys: readonly string[] = AGE_LIMIT_KEYS;
  if (isCruise === 'true') keys = CRUISE_AGE_KEYS;
  else if (isCruise === 'false') keys = LAND_AGE_KEYS;
  for (const tc of firm.trip_covers ?? []) {
    const al = tc?.age_limits;
    for (const k of keys) {
      const val = getAgeLimit(al, k);
      if (val != null && val > 0 && val >= userAge) return true;
    }
  }
  return false;
}

function firmMatchesTripType(
  firm: TravelInsuranceFirmDocument,
  tripType: string | undefined,
): boolean {
  if (!tripType || !TRIP_TYPES.has(tripType as TripType)) return true;
  return (firm.trip_covers ?? []).some((t) => t.trip_type === tripType);
}

function firmMatchesCoverArea(
  firm: TravelInsuranceFirmDocument,
  coverArea: string | undefined,
): boolean {
  if (!coverArea || !COVER_AREAS.has(coverArea as CoverArea)) return true;
  return (firm.trip_covers ?? []).some((t) => t.cover_area === coverArea);
}

function firmMatchesWhenTravelling(
  firm: TravelInsuranceFirmDocument,
  whenTravelling: string | undefined,
): boolean {
  if (
    !whenTravelling ||
    !TRIP_COVER_ADVANCES.has(whenTravelling as TripCoverAdvance)
  )
    return true;
  const allowed = allowedAdvancesForWhenTravelling(
    whenTravelling as TripCoverAdvance,
  );
  const firmAdvance = firm.service_details?.how_far_in_advance_trip_cover;
  return firmAdvance != null && allowed.includes(firmAdvance);
}

function firmMatchesMedicalFilters(
  firm: TravelInsuranceFirmDocument,
  queryParams: QueryParams,
): boolean {
  const undergoing = getSingleString(queryParams, 'undergoing_treatment');
  if (
    undergoing === 'true' &&
    firm.medical_coverage?.will_cover_undergoing_treatment !== true
  )
    return false;
  const terminal = getSingleString(queryParams, 'terminal_prognosis');
  if (
    terminal === 'true' &&
    firm.medical_coverage?.terminal_prognosis_cover !== true
  )
    return false;
  const equipment = getSingleString(queryParams, 'medical_equipment');
  if (
    equipment === 'true' &&
    firm.service_details?.will_cover_specialist_equipment !== true
  )
    return false;
  return true;
}

function firmMatchesTripLengthAndAge(
  firm: TravelInsuranceFirmDocument,
  queryParams: QueryParams,
): boolean {
  const tripLength = getSingleString(queryParams, 'trip_length');
  const tripType = getSingleString(queryParams, 'trip_type');
  const isCruise = getSingleString(queryParams, 'is_cruise');
  const ageRaw = getSingleString(queryParams, 'age');
  const userAge = Math.min(
    100,
    Math.max(1, Number.parseInt(ageRaw ?? '', 10) || 0),
  );
  const hasAge =
    ageRaw !== undefined &&
    ageRaw !== '' &&
    !Number.isNaN(Number(ageRaw)) &&
    userAge >= 1 &&
    userAge <= 100;

  const hasTripLength =
    tripLength !== undefined &&
    tripLength !== '' &&
    tripType != null &&
    TRIP_TYPES.has(tripType as TripType);
  const days =
    hasTripLength && tripLength ? TRIP_LENGTH_TO_DAYS[tripLength] : null;

  if (days != null && tripType != null) {
    const isCruiseBool = parseIsCruiseBool(isCruise);
    return tripCoversMatchTripLength(
      firm,
      tripType,
      days,
      isCruiseBool,
      userAge,
      hasAge,
    );
  }

  if (isCruise === 'true' || isCruise === 'false') {
    if (!tripCoversMatchCruiseLand(firm, isCruise === 'true')) return false;
  }
  if (hasAge && !tripCoversMatchAgeOnly(firm, userAge, isCruise)) return false;
  return true;
}

function firmMatchesParams(
  firm: TravelInsuranceFirmDocument,
  queryParams: QueryParams,
): boolean {
  if (firm.status !== STATUS_ACTIVE) return false;
  const tripType = getSingleString(queryParams, 'trip_type');
  if (!firmMatchesTripType(firm, tripType)) return false;
  const coverArea = getSingleString(queryParams, 'cover_area');
  if (!firmMatchesCoverArea(firm, coverArea)) return false;
  const whenTravelling = getSingleString(queryParams, 'when_travelling');
  if (!firmMatchesWhenTravelling(firm, whenTravelling)) return false;
  if (!firmMatchesMedicalFilters(firm, queryParams)) return false;
  if (!firmMatchesTripLengthAndAge(firm, queryParams)) return false;
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
