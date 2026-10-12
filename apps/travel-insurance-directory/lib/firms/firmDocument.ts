import type {
  MainTravelInsuranceFirmDocument,
  Principal,
  TradingTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
  TripCoverAgeLimits,
  TripDurationBucket,
} from 'types/travel-insurance-firm';

export function isMainFirm(
  doc: TravelInsuranceFirmDocument,
): doc is MainTravelInsuranceFirmDocument {
  return doc.type === 'main';
}

export function isTradingFirm(
  doc: TravelInsuranceFirmDocument,
): doc is TradingTravelInsuranceFirmDocument {
  return doc.type === 'trading';
}

export function getOffice(firm: TravelInsuranceFirmDocument) {
  return firm.office;
}

export function getPrincipal(
  firm: TravelInsuranceFirmDocument,
): Principal | null {
  return isMainFirm(firm) ? firm.principal : null;
}

/** Map UI trip_length filter value to v2 Cosmos bucket key. */
export function tripLengthToBucket(
  tripLength: string,
): TripDurationBucket | null {
  if (tripLength === 'up_to_30_days' || tripLength === 'up_to_90_days') {
    return tripLength;
  }
  if (tripLength === '90_days_plus') {
    return 'over_90_days';
  }
  return null;
}

export type AgeLimitMode = 'land' | 'cruise';

/**
 * Read age limit for a bucket and travel mode. Values <= 0 or -1 mean no cover.
 */
export function getAgeLimit(
  ageLimits: TripCoverAgeLimits | undefined | null,
  bucket: TripDurationBucket,
  mode: AgeLimitMode,
): number | null {
  if (ageLimits == null) return null;
  const val = ageLimits[bucket]?.[mode];
  if (typeof val !== 'number' || val <= 0) return null;
  return val;
}

export function hasPositiveAgeLimit(
  ageLimits: TripCoverAgeLimits | undefined | null,
  bucket: TripDurationBucket,
  mode: AgeLimitMode,
): boolean {
  return getAgeLimit(ageLimits, bucket, mode) != null;
}
