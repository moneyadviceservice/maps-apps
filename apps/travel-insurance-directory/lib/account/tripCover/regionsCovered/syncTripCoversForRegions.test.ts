import { emptyTripCoverAgeLimits } from 'lib/firms/firmDefaults';
import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import { syncTripCoversForRegions } from './syncTripCoversForRegions';

describe('syncTripCoversForRegions', () => {
  it('creates trip covers for each selected region and trip type', () => {
    const result = syncTripCoversForRegions([], ['uk_and_europe']);

    expect(result).toHaveLength(2);
    expect(result.map((cover) => cover.trip_type)).toEqual([
      'single_trip',
      'annual_multi_trip',
    ]);
    expect(result.every((cover) => cover.cover_area === 'uk_and_europe')).toBe(
      true,
    );
    expect(result[0].age_limits).toEqual(emptyTripCoverAgeLimits());
  });

  it('preserves existing age_limits when region stays selected', () => {
    const existing = [
      tripCoverWithAgeLimits(
        { up_to_30_days: { land: 75, cruise: null } },
        { trip_type: 'single_trip', cover_area: 'uk_and_europe' },
      ),
    ];

    const result = syncTripCoversForRegions(existing, ['uk_and_europe']);

    const singleTrip = result.find(
      (cover) => cover.trip_type === 'single_trip',
    );
    expect(singleTrip?.age_limits.up_to_30_days.land).toBe(75);
  });

  it('removes trip covers for deselected regions', () => {
    const existing = [
      tripCoverWithAgeLimits({}, { cover_area: 'uk_and_europe' }),
      tripCoverWithAgeLimits(
        {},
        { cover_area: 'worldwide_including_us_canada' },
      ),
    ];

    const result = syncTripCoversForRegions(existing, ['uk_and_europe']);

    expect(result.every((cover) => cover.cover_area === 'uk_and_europe')).toBe(
      true,
    );
    expect(result).toHaveLength(2);
  });

  it('creates six unique trip covers when all regions are selected', () => {
    const result = syncTripCoversForRegions(
      [],
      [
        'uk_and_europe',
        'worldwide_excluding_us_canada',
        'worldwide_including_us_canada',
      ],
    );

    expect(result).toHaveLength(6);
    expect(
      new Set(result.map((cover) => `${cover.cover_area}:${cover.trip_type}`)),
    ).toHaveProperty('size', 6);
  });

  it('dedupes legacy duplicate entries by latest updated_at', () => {
    const existing = [
      tripCoverWithAgeLimits(
        { up_to_30_days: { land: 65, cruise: null } },
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z',
        },
      ),
      tripCoverWithAgeLimits(
        { up_to_30_days: { land: 75, cruise: null } },
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-06-01T00:00:00.000Z',
        },
      ),
    ];

    const result = syncTripCoversForRegions(existing, ['uk_and_europe']);
    const singleTrip = result.find(
      (cover) => cover.trip_type === 'single_trip',
    );

    expect(result).toHaveLength(2);
    expect(singleTrip?.age_limits.up_to_30_days.land).toBe(75);
  });

  it('preserves distinct age_limits per cover area and trip type', () => {
    const existing = [
      tripCoverWithAgeLimits(
        {
          up_to_30_days: { land: 1000, cruise: 1000 },
          over_90_days: { land: -1, cruise: 1000 },
        },
        { trip_type: 'single_trip', cover_area: 'uk_and_europe' },
      ),
      tripCoverWithAgeLimits(
        {
          up_to_30_days: { land: 1000, cruise: 1000 },
          up_to_90_days: { land: -1, cruise: -1 },
        },
        { trip_type: 'annual_multi_trip', cover_area: 'uk_and_europe' },
      ),
      tripCoverWithAgeLimits(
        {},
        {
          trip_type: 'single_trip',
          cover_area: 'worldwide_excluding_us_canada',
        },
      ),
    ];

    const result = syncTripCoversForRegions(existing, [
      'uk_and_europe',
      'worldwide_excluding_us_canada',
    ]);

    expect(result).toHaveLength(4);
    expect(
      result.find(
        (cover) =>
          cover.cover_area === 'uk_and_europe' &&
          cover.trip_type === 'single_trip',
      )?.age_limits.over_90_days.land,
    ).toBe(-1);
    expect(
      result.find(
        (cover) =>
          cover.cover_area === 'uk_and_europe' &&
          cover.trip_type === 'annual_multi_trip',
      )?.age_limits.up_to_90_days.land,
    ).toBe(-1);
    expect(
      result.find(
        (cover) =>
          cover.cover_area === 'worldwide_excluding_us_canada' &&
          cover.trip_type === 'single_trip',
      )?.age_limits,
    ).toEqual(emptyTripCoverAgeLimits());
  });

  it('adds missing trip type when region already has one trip type', () => {
    const existing = [
      tripCoverWithAgeLimits(
        {},
        { trip_type: 'single_trip', cover_area: 'uk_and_europe' },
      ),
    ];

    const result = syncTripCoversForRegions(existing, ['uk_and_europe']);

    expect(result).toHaveLength(2);
    expect(result.map((cover) => cover.trip_type)).toEqual([
      'single_trip',
      'annual_multi_trip',
    ]);
  });
});
