import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import {
  buildTripCoverSteps,
  getFirstIncompleteStepPath,
  getFirstStepPath,
  getLastStepPath,
  getNextStepPath,
  getPreviousStepPath,
} from './tripCoverSteps';

describe('tripCoverSteps', () => {
  const europeSingle = tripCoverWithAgeLimits(
    {},
    { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
  );
  const europeAnnual = tripCoverWithAgeLimits(
    {},
    { cover_area: 'uk_and_europe', trip_type: 'annual_multi_trip' },
  );
  const worldwideSingle = tripCoverWithAgeLimits(
    {},
    {
      cover_area: 'worldwide_including_us_canada',
      trip_type: 'single_trip',
    },
  );

  it('builds two steps for one selected region', () => {
    expect(buildTripCoverSteps([europeSingle, europeAnnual])).toEqual([
      { coverArea: 'uk_and_europe', tripType: 'single_trip' },
      { coverArea: 'uk_and_europe', tripType: 'annual_multi_trip' },
    ]);
  });

  it('builds six steps for three selected regions', () => {
    const tripCovers = [
      europeSingle,
      europeAnnual,
      tripCoverWithAgeLimits(
        {},
        {
          cover_area: 'worldwide_excluding_us_canada',
          trip_type: 'single_trip',
        },
      ),
      tripCoverWithAgeLimits(
        {},
        {
          cover_area: 'worldwide_excluding_us_canada',
          trip_type: 'annual_multi_trip',
        },
      ),
      worldwideSingle,
      tripCoverWithAgeLimits(
        {},
        {
          cover_area: 'worldwide_including_us_canada',
          trip_type: 'annual_multi_trip',
        },
      ),
    ];

    expect(buildTripCoverSteps(tripCovers)).toHaveLength(6);
  });

  it('returns step paths in order', () => {
    const tripCovers = [europeSingle, europeAnnual];
    const firmId = 'firm-123';

    expect(getFirstStepPath(firmId, tripCovers)).toBe(
      '/account/trip-cover/firm-123/uk_and_europe/single_trip',
    );
    expect(
      getNextStepPath(firmId, tripCovers, {
        coverArea: 'uk_and_europe',
        tripType: 'single_trip',
      }),
    ).toBe('/account/trip-cover/firm-123/uk_and_europe/annual_multi_trip');
    expect(
      getPreviousStepPath(firmId, tripCovers, {
        coverArea: 'uk_and_europe',
        tripType: 'annual_multi_trip',
      }),
    ).toBe('/account/trip-cover/firm-123/uk_and_europe/single_trip');
    expect(getLastStepPath(firmId, tripCovers)).toBe(
      '/account/trip-cover/firm-123/uk_and_europe/annual_multi_trip',
    );
  });

  it('returns the first incomplete step path', () => {
    const completeCover = tripCoverWithAgeLimits(
      {
        up_to_30_days: { land: 75, cruise: 1000 },
        up_to_90_days: { land: 1000, cruise: 1000 },
        over_90_days: { land: 1000, cruise: 1000 },
      },
      { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
    );

    expect(
      getFirstIncompleteStepPath('firm-123', [completeCover, europeAnnual]),
    ).toBe('/account/trip-cover/firm-123/uk_and_europe/annual_multi_trip');
  });
});
