import { filterFirmsInMemory } from './filterFirmsInMemory';
import {
  emptyTripCoverAgeLimits,
  mockListingFirm,
} from 'lib/firms/testing/tripCoverFixtures';

const mockFirm = mockListingFirm;
const emptyAgeLimits = emptyTripCoverAgeLimits();

describe('filterFirmsInMemory', () => {
  it('returns all active firms when query params are empty', () => {
    const active = mockFirm({ status: 'active' });
    const firms = [
      active,
      mockFirm({
        status: 'active',
        fca_number: 999,
      }),
    ];
    const result = filterFirmsInMemory(firms, {});
    expect(result).toHaveLength(2);
  });

  it('excludes firms with status !== active', () => {
    const active = mockFirm({ status: 'active' });
    const hidden = mockFirm({ status: 'hidden' });
    const pending = mockFirm({ status: 'pending_approval' });
    const result = filterFirmsInMemory([active, hidden, pending], {});
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('active');
  });

  it('excludes active firms blocked by FCA visibility reason', () => {
    const listed = mockFirm({ status: 'active', hidden_reason: null });
    const fcaBlocked = mockFirm({
      status: 'active',
      hidden_reason: 'Invalid_FCA',
    });
    const result = filterFirmsInMemory([listed, fcaBlocked], {});
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(listed);
  });

  it('filters by trip_type: keeps only firms with matching trip_cover', () => {
    const singleTrip = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const multiTrip = mockFirm({
      trip_covers: [
        {
          trip_type: 'annual_multi_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([singleTrip, multiTrip], {
      trip_type: 'single_trip',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].trip_type).toBe('single_trip');
  });

  it('filters by trip_type multi-select (OR logic)', () => {
    const singleTrip = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const multiTrip = mockFirm({
      trip_covers: [
        {
          trip_type: 'annual_multi_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([singleTrip, multiTrip], {
      trip_type: ['single_trip', 'annual_multi_trip'],
    });
    expect(result).toHaveLength(2);
  });

  it('filters by cover_area: keeps only firms with matching trip_cover', () => {
    const ukEurope = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const worldwide = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'worldwide_including_us_canada',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([ukEurope, worldwide], {
      cover_area: 'uk_and_europe',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].cover_area).toBe('uk_and_europe');
  });

  it('filters by trip_length: keeps firm with matching duration age limit', () => {
    const hasLand30 = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const noMatch = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasLand30, noMatch], {
      trip_length: 'up_to_30_days',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.land).toBe(70);
  });

  it('filters by trip_length + is_cruise true: uses cruise age limit', () => {
    const hasCruise30 = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 70 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasCruise30], {
      trip_length: 'up_to_30_days',
      is_cruise: 'true',
    });
    expect(result).toHaveLength(1);
  });

  it('filters by is_cruise without trip_length: requires cruise or land cover', () => {
    const hasCruise = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 70 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const noCruise = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasCruise, noCruise], {
      is_cruise: 'true',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.cruise).toBe(70);
  });

  it('filters by age range: requires age limit >= upper bound of range', () => {
    const meetsAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 75, cruise: 65 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const tooLow = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 60, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([meetsAge, tooLow], { age: '70-74' });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.land).toBe(75);
  });

  it('filters by multiple age ranges (OR logic)', () => {
    const coversYoung = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 16, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const coversOlder = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 86, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([coversYoung, coversOlder], {
      age: ['0-16', '86+'],
    });
    expect(result).toHaveLength(2);
  });

  it('trip_length without trip_type checks all covers', () => {
    const singleWithLength = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([singleWithLength], {
      trip_length: 'up_to_30_days',
    });
    expect(result).toHaveLength(1);
  });

  it('trip_type + trip_length are coupled: must match on the same cover', () => {
    const firm = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_90_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
        {
          trip_type: 'annual_multi_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });

    const matchesSingle = filterFirmsInMemory([firm], {
      trip_type: 'single_trip',
      trip_length: 'up_to_90_days',
    });
    expect(matchesSingle).toHaveLength(1);

    const noMatchAnnual = filterFirmsInMemory([firm], {
      trip_type: 'annual_multi_trip',
      trip_length: 'up_to_90_days',
    });
    expect(noMatchAnnual).toHaveLength(0);
  });

  it('trip_type + trip_length coupled: matches when both types have the duration', () => {
    const firm = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
        {
          trip_type: 'annual_multi_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 65, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });

    const result = filterFirmsInMemory([firm], {
      trip_type: ['single_trip', 'annual_multi_trip'],
      trip_length: 'up_to_30_days',
    });
    expect(result).toHaveLength(1);
  });

  it('filters by cover_area multi-select (OR logic)', () => {
    const ukEurope = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const worldwide = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'worldwide_including_us_canada',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const excluded = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'worldwide_excluding_us_canada',
          age_limits: emptyAgeLimits,
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([ukEurope, worldwide, excluded], {
      cover_area: ['uk_and_europe', 'worldwide_including_us_canada'],
    });
    expect(result).toHaveLength(2);
  });

  it('filters by is_cruise false: requires land cover', () => {
    const hasLand = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const cruiseOnly = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 70 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasLand, cruiseOnly], {
      is_cruise: 'false',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.land).toBe(70);
  });

  it('filters by is_cruise multi-select: matches land or cruise cover', () => {
    const landOnly = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const cruiseOnly = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 70 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([landOnly, cruiseOnly], {
      is_cruise: ['true', 'false'],
    });
    expect(result).toHaveLength(2);
  });

  it('filters by trip_length + is_cruise false: uses land age limit only', () => {
    const landMatch = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 70, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const cruiseOnlyMatch = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 70 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([landMatch, cruiseOnlyMatch], {
      trip_length: 'up_to_30_days',
      is_cruise: 'false',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.land).toBe(70);
  });

  it('filters by age range + is_cruise true: checks only cruise age keys', () => {
    const hasCruiseAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 75 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const landOnlyAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 75, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasCruiseAge, landOnlyAge], {
      age: '70-74',
      is_cruise: 'true',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.cruise).toBe(75);
  });

  it('filters by age range + is_cruise false: checks only land age keys', () => {
    const hasLandAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 75, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const cruiseOnlyAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 75 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasLandAge, cruiseOnlyAge], {
      age: '70-74',
      is_cruise: 'false',
    });
    expect(result).toHaveLength(1);
    expect(result[0].trip_covers[0].age_limits.up_to_30_days.land).toBe(75);
  });

  it('filters by age range + is_cruise both: checks all age keys', () => {
    const hasLandAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: 75, cruise: null },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const hasCruiseAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            up_to_30_days: { land: null, cruise: 75 },
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasLandAge, hasCruiseAge], {
      age: '70-74',
      is_cruise: ['true', 'false'],
    });
    expect(result).toHaveLength(2);
  });
});
