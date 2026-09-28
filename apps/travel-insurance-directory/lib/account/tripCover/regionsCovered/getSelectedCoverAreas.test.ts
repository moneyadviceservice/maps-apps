import { tripCoverWithAgeLimits } from 'lib/firms/testing/tripCoverFixtures';

import { getSelectedCoverAreas } from './getSelectedCoverAreas';

describe('getSelectedCoverAreas', () => {
  it('returns an empty array when trip_covers is empty', () => {
    expect(getSelectedCoverAreas([])).toEqual([]);
  });

  it('returns unique cover areas from trip covers', () => {
    const tripCovers = [
      tripCoverWithAgeLimits(
        {},
        { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
      ),
      tripCoverWithAgeLimits(
        {},
        { cover_area: 'uk_and_europe', trip_type: 'annual_multi_trip' },
      ),
      tripCoverWithAgeLimits(
        {},
        {
          cover_area: 'worldwide_including_us_canada',
          trip_type: 'single_trip',
        },
      ),
    ];

    const areas = getSelectedCoverAreas(tripCovers);

    expect(areas).toHaveLength(2);
    expect(areas).toContain('uk_and_europe');
    expect(areas).toContain('worldwide_including_us_canada');
  });

  it('ignores trip covers without a cover_area', () => {
    const tripCovers = [
      tripCoverWithAgeLimits(
        {},
        { cover_area: 'uk_and_europe', trip_type: 'single_trip' },
      ),
      tripCoverWithAgeLimits(
        {},
        { cover_area: undefined as never, trip_type: 'annual_multi_trip' },
      ),
    ];

    expect(getSelectedCoverAreas(tripCovers)).toEqual(['uk_and_europe']);
  });
});
