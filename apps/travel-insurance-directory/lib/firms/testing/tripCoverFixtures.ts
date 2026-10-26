import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { NO_AGE_RESTRICTION_VALUE } from 'data/pages/account/tripCover/tripCoverConfig';
import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';
import type {
  MainTravelInsuranceFirmDocument,
  TripCover,
  TripCoverAgeLimits,
} from 'types/travel-insurance-firm';

export { emptyTripCoverAgeLimits };

export function savedTripCoverAgeLimits(): TripCoverAgeLimits {
  const noRestriction = NO_AGE_RESTRICTION_VALUE;

  return {
    up_to_30_days: { land: 70, cruise: noRestriction },
    up_to_90_days: { land: noRestriction, cruise: noRestriction },
    over_90_days: { land: noRestriction, cruise: noRestriction },
  };
}

export function tripCoverWithSavedAgeLimits(
  rest: Partial<TripCover> = {},
): TripCover {
  return tripCoverWithAgeLimits(savedTripCoverAgeLimits(), rest);
}

export function mockListingFirm(
  overrides: Partial<MainTravelInsuranceFirmDocument> = {},
): MainTravelInsuranceFirmDocument {
  return createMockFirm(overrides);
}

export function tripCoverWithAgeLimits(
  ageLimits: Partial<TripCoverAgeLimits>,
  rest: Partial<TripCover> = {},
): TripCover {
  return {
    trip_type: 'single_trip',
    cover_area: 'uk_and_europe',
    age_limits: { ...emptyTripCoverAgeLimits(), ...ageLimits },
    created_at: '',
    updated_at: '',
    ...rest,
  };
}
