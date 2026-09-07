import { createMockFirm } from 'components/FirmSummary/mockFirm';
import { NO_AGE_RESTRICTION_VALUE } from 'data/pages/account/tripCover/tripCoverConfig';
import { AGE_LIMIT_FIELD_KEYS } from 'lib/account/tripCover/TripCoverAgeLimits';
import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';
import type { CoverArea, TripType } from 'types/travel-insurance-firm';

export const TRIP_COVER_TEST_FIRM_ID = 'firm-123';
export const TRIP_COVER_TEST_COVER_AREA: CoverArea = 'uk_and_europe';

const defaultAgeLimitFieldValues = Object.fromEntries(
  AGE_LIMIT_FIELD_KEYS.map((key) => [key, String(NO_AGE_RESTRICTION_VALUE)]),
);

export function buildAgeLimitApiBody(
  overrides: Record<string, string> = {},
): Record<string, string> {
  return {
    firmId: TRIP_COVER_TEST_FIRM_ID,
    coverArea: TRIP_COVER_TEST_COVER_AREA,
    tripType: 'single_trip',
    ...defaultAgeLimitFieldValues,
    ...overrides,
  };
}

export function mockResolvedEmptyTripCoverFirm(
  overrides: Parameters<typeof createMockFirm>[0] = {},
) {
  return {
    firm: createMockFirm({
      id: TRIP_COVER_TEST_FIRM_ID,
      trip_covers: [],
      ...overrides,
    }),
    isTrading: false,
  };
}

export function mockResolvedEuropeTripCoverFirm(
  overrides: Parameters<typeof createMockFirm>[0] = {},
) {
  return {
    firm: createMockFirm({
      id: TRIP_COVER_TEST_FIRM_ID,
      trip_covers: [
        tripCoverWithAgeLimits(
          {},
          {
            cover_area: TRIP_COVER_TEST_COVER_AREA,
            trip_type: 'single_trip',
          },
        ),
        tripCoverWithAgeLimits(
          {},
          {
            cover_area: TRIP_COVER_TEST_COVER_AREA,
            trip_type: 'annual_multi_trip',
          },
        ),
      ],
      ...overrides,
    }),
    isTrading: false,
  };
}

export function testAgeLimitsPagePath(
  coverArea: CoverArea,
  tripType: TripType,
): string {
  return `/account/trip-cover/${TRIP_COVER_TEST_FIRM_ID}/${coverArea}/${tripType}`;
}
