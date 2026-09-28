import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import { updateTripCoverAgeLimits } from './updateTripCoverAgeLimits';

describe('updateTripCoverAgeLimits', () => {
  it('updates age limits for the matching cover area and trip type', () => {
    const existing = tripCoverWithAgeLimits(
      {},
      { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
    );
    const other = tripCoverWithAgeLimits(
      {},
      {
        cover_area: 'uk_and_europe',
        trip_type: 'annual_multi_trip',
      },
    );
    const newLimits = {
      up_to_30_days: { land: 75, cruise: 80 },
      up_to_90_days: { land: 70, cruise: 75 },
      over_90_days: { land: 65, cruise: 70 },
    };

    const result = updateTripCoverAgeLimits(
      [existing, other],
      { coverArea: 'uk_and_europe', tripType: 'single_trip' },
      newLimits,
    );

    expect(result[0].age_limits).toEqual(newLimits);
    expect(result[1]).toBe(other);
    expect(result[0].updated_at).not.toBe(existing.updated_at);
  });
});
