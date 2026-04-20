import type {
  MedicalCoverage,
  TravelInsuranceFirmDocument,
  TripCover,
} from 'types/travel-insurance-firm';

import { filterFirmsInMemory } from './filterFirmsInMemory';

const emptyAgeLimits = {
  land_30_days_max_age: null,
  cruise_30_days_max_age: null,
  land_45_days_max_age: null,
  cruise_45_days_max_age: null,
  land_50_days_max_age: null,
  cruise_50_days_max_age: null,
  land_55_days_max_age: null,
  cruise_55_days_max_age: null,
};

function mockFirm(
  overrides: Partial<{
    status: TravelInsuranceFirmDocument['status'];
    trip_covers: TravelInsuranceFirmDocument['trip_covers'];
    service_details: TravelInsuranceFirmDocument['service_details'];
    medical_coverage: TravelInsuranceFirmDocument['medical_coverage'];
  }> = {},
): TravelInsuranceFirmDocument {
  const medicalCoverage = {} as MedicalCoverage;
  const base: TravelInsuranceFirmDocument = {
    fca_number: 123456,
    registered_name: 'Test Firm',
    website_address: null,
    approved_at: null,
    created_at: '',
    updated_at: '',
    hidden_at: null,
    reregistered_at: null,
    reregister_approved_at: null,
    confirmed_disclaimer: false,
    status: 'active',
    covered_by_ombudsman_question: null,
    medical_coverage: {
      covers_medical_condition_question: null,
      risk_profile_approach_question: null,
      specialised_medical_conditions_covers_all: null,
      will_not_cover_some_medical_conditions: null,
      will_cover_undergoing_treatment: null,
      terminal_prognosis_cover: null,
      specific_conditions: medicalCoverage['specific_conditions'],
      likely_not_cover_medical_condition: null,
      cover_undergoing_treatment: null,
    },
    service_details: {
      how_far_in_advance_trip_cover: 'up_to_6_month',
      offers_telephone_quote: null,
      cover_for_specialist_equipment: null,
      medical_screening_company: null,
      covid19_medical_repatriation: null,
      covid19_cancellation_cover: null,
      will_cover_specialist_equipment: null,
      supplies_documentation_when_needed_question: null,
    },
    trip_covers: [
      {
        trip_type: 'single_trip',
        cover_area: 'uk_and_europe',
        age_limits: emptyAgeLimits,
        created_at: '',
        updated_at: '',
      },
    ],
    medical_specialisms: null,
    offices: [],
    principals: [],
    trading_names: [],
    searchable: {} as TravelInsuranceFirmDocument['searchable'],
  };
  return { ...base, ...overrides } as TravelInsuranceFirmDocument;
}

describe('filterFirmsInMemory', () => {
  it('returns all active firms when query params are empty', () => {
    const active = mockFirm({ status: 'active' });
    const firms = [
      active,
      mockFirm({
        status: 'active',
        fca_number: 999,
      } as Partial<TravelInsuranceFirmDocument>),
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
    expect((result[0].trip_covers as TripCover[])[0].trip_type).toBe(
      'single_trip',
    );
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
    expect((result[0].trip_covers as TripCover[])[0].cover_area).toBe(
      'uk_and_europe',
    );
  });

  it('filters by trip_length: keeps firm with matching duration age limit', () => {
    const hasLand30 = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: 70,
            cruise_30_days_max_age: null,
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
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits.land_30_days_max_age,
    ).toBe(70);
  });

  it('filters by trip_length + is_cruise true: uses cruise age limit', () => {
    const hasCruise30 = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: null,
            cruise_30_days_max_age: 70,
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
            cruise_30_days_max_age: 70,
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
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits
        .cruise_30_days_max_age,
    ).toBe(70);
  });

  it('filters by age range: requires age limit >= upper bound of range', () => {
    const meetsAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: 75,
            cruise_30_days_max_age: 65,
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
            land_30_days_max_age: 60,
          },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([meetsAge, tooLow], { age: '70-74' });
    expect(result).toHaveLength(1);
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits.land_30_days_max_age,
    ).toBe(75);
  });

  it('filters by multiple age ranges (OR logic)', () => {
    const coversYoung = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 16 },
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
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 86 },
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
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 70 },
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
          age_limits: { ...emptyAgeLimits, land_55_days_max_age: 70 },
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
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 70 },
          created_at: '',
          updated_at: '',
        },
        {
          trip_type: 'annual_multi_trip',
          cover_area: 'uk_and_europe',
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 65 },
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
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 70 },
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
          age_limits: { ...emptyAgeLimits, cruise_30_days_max_age: 70 },
          created_at: '',
          updated_at: '',
        },
      ],
    });
    const result = filterFirmsInMemory([hasLand, cruiseOnly], {
      is_cruise: 'false',
    });
    expect(result).toHaveLength(1);
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits.land_30_days_max_age,
    ).toBe(70);
  });

  it('filters by is_cruise multi-select: matches land or cruise cover', () => {
    const landOnly = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: { ...emptyAgeLimits, land_30_days_max_age: 70 },
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
          age_limits: { ...emptyAgeLimits, cruise_30_days_max_age: 70 },
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
            land_30_days_max_age: 70,
            cruise_30_days_max_age: null,
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
            land_30_days_max_age: null,
            cruise_30_days_max_age: 70,
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
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits.land_30_days_max_age,
    ).toBe(70);
  });

  it('filters by age range + is_cruise true: checks only cruise age keys', () => {
    const hasCruiseAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: null,
            cruise_30_days_max_age: 75,
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
            land_30_days_max_age: 75,
            cruise_30_days_max_age: null,
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
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits
        .cruise_30_days_max_age,
    ).toBe(75);
  });

  it('filters by age range + is_cruise false: checks only land age keys', () => {
    const hasLandAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: 75,
            cruise_30_days_max_age: null,
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
            land_30_days_max_age: null,
            cruise_30_days_max_age: 75,
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
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits.land_30_days_max_age,
    ).toBe(75);
  });

  it('filters by age range + is_cruise both: checks all age keys', () => {
    const hasLandAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: 75,
            cruise_30_days_max_age: null,
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
            land_30_days_max_age: null,
            cruise_30_days_max_age: 75,
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
