import { TRIP_COVER_REGION_OPTIONS } from 'data/pages/account/tripCover/tripCoverConfig';
import type { CoverArea, TripType } from 'types/travel-insurance-firm';

import {
  ageLimitsPath,
  regionsPath,
  serviceDetailsPath,
} from '../steps/tripCoverRoutes';
import {
  VALID_COVER_AREAS,
  VALID_TRIP_TYPES,
} from '../steps/tripCoverValidation';

const REGIONS_PATH_PATTERN = /^\/account\/trip-cover\/regions\/([^/]+)$/;
const SERVICE_DETAILS_PATH_PATTERN =
  /^\/account\/trip-cover\/service-details\/([^/]+)$/;
const AGE_LIMITS_PATH_PATTERN =
  /^\/account\/trip-cover\/([^/]+)\/([^/]+)\/([^/]+)$/;

export function buildAllowedChangeTargetPaths(firmId: string): Set<string> {
  const paths = new Set<string>([
    regionsPath(firmId),
    serviceDetailsPath(firmId),
  ]);

  for (const region of TRIP_COVER_REGION_OPTIONS) {
    for (const tripType of VALID_TRIP_TYPES) {
      paths.add(ageLimitsPath(firmId, region.value, tripType));
    }
  }

  return paths;
}

export function parseChangeTargetPath(
  targetPath: string,
): { pathname: string; firmId: string | null } | null {
  const trimmed = targetPath.trim();
  if (!trimmed.startsWith('/account/')) {
    return null;
  }

  const [pathname] = trimmed.split('?');

  const regionsMatch = REGIONS_PATH_PATTERN.exec(pathname);
  if (regionsMatch) {
    return { pathname, firmId: regionsMatch[1] };
  }

  const serviceDetailsMatch = SERVICE_DETAILS_PATH_PATTERN.exec(pathname);
  if (serviceDetailsMatch) {
    return { pathname, firmId: serviceDetailsMatch[1] };
  }

  const ageLimitsMatch = AGE_LIMITS_PATH_PATTERN.exec(pathname);
  if (ageLimitsMatch) {
    const [, firmId, coverArea, tripType] = ageLimitsMatch;
    if (
      VALID_COVER_AREAS.has(coverArea as CoverArea) &&
      VALID_TRIP_TYPES.has(tripType as TripType)
    ) {
      return { pathname, firmId };
    }
    return null;
  }

  return null;
}

export function isAllowedChangeTargetPath(
  firmId: string,
  targetPath: string,
): boolean {
  const parsed = parseChangeTargetPath(targetPath);
  if (parsed?.firmId !== firmId) {
    return false;
  }

  return buildAllowedChangeTargetPaths(firmId).has(targetPath.trim());
}
