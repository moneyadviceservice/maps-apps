/**
 * Self-serve trip cover route flow:
 * regions → age form → medical specialism → service details → summary
 *
 * - Regions:   /account/trip-cover/regions/{firmId}
 * - Age form:  /account/trip-cover/{firmId}/{coverArea}/{tripType}
 * - Medical:   /account/trip-cover/medical-specialism/{firmId}
 * - Service:   /account/trip-cover/service-details/{firmId}
 * - Summary:   /account/trip-cover/confirm/{firmId}
 */
import type { CoverArea, TripType } from 'types/travel-insurance-firm';

export function regionsPath(firmId: string): string {
  return `/account/trip-cover/regions/${firmId}`;
}

export function ageLimitsPath(
  firmId: string,
  coverArea: CoverArea,
  tripType: TripType,
): string {
  return `/account/trip-cover/${firmId}/${coverArea}/${tripType}`;
}

export function medicalSpecialismPath(firmId: string): string {
  return `/account/trip-cover/medical-specialism/${firmId}`;
}

export function serviceDetailsPath(firmId: string): string {
  return `/account/trip-cover/service-details/${firmId}`;
}

export function confirmPath(firmId: string): string {
  return `/account/trip-cover/confirm/${firmId}`;
}
