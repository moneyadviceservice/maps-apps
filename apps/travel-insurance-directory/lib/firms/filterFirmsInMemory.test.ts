import type {
  MedicalCoverage,
  ServiceDetails,
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

const medicalCoverage = mockFirm().medical_coverage as MedicalCoverage;

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

  it('filters by when_travelling: keeps firm if advance is in allowed list', () => {
    const firm6 = mockFirm({
      service_details: {
        ...mockFirm().service_details!,
        how_far_in_advance_trip_cover: 'up_to_6_month',
      },
    });
    const firm24 = mockFirm({
      service_details: {
        ...mockFirm().service_details!,
        how_far_in_advance_trip_cover: 'up_to_24_month',
      },
    });
    const result = filterFirmsInMemory([firm6, firm24], {
      when_travelling: 'up_to_6_month',
    });
    expect(result).toHaveLength(2);
    const result24Only = filterFirmsInMemory([firm6, firm24], {
      when_travelling: 'up_to_24_month',
    });
    expect(result24Only).toHaveLength(1);
    expect(result24Only[0].service_details?.how_far_in_advance_trip_cover).toBe(
      'up_to_24_month',
    );
  });

  it('filters by undergoing_treatment when true', () => {
    const covers = mockFirm({
      medical_coverage: {
        ...medicalCoverage,
        will_cover_undergoing_treatment: true,
      },
    });
    const notCovers = mockFirm({
      medical_coverage: {
        ...medicalCoverage,
        will_cover_undergoing_treatment: false,
      },
    });
    const result = filterFirmsInMemory([covers, notCovers], {
      undergoing_treatment: 'true',
    });
    expect(result).toHaveLength(1);
    expect(
      (result[0].medical_coverage as MedicalCoverage)
        .will_cover_undergoing_treatment,
    ).toBe(true);
  });

  it('filters by terminal_prognosis when true', () => {
    const covers = mockFirm({
      medical_coverage: {
        ...medicalCoverage,
        terminal_prognosis_cover: true,
      },
    });
    const notCovers = mockFirm({
      medical_coverage: {
        ...medicalCoverage,
        terminal_prognosis_cover: false,
      },
    });
    const result = filterFirmsInMemory([covers, notCovers], {
      terminal_prognosis: 'true',
    });
    expect(result).toHaveLength(1);
    expect(
      (result[0].medical_coverage as MedicalCoverage).terminal_prognosis_cover,
    ).toBe(true);
  });

  it('filters by medical_equipment when true', () => {
    const covers = mockFirm({
      service_details: {
        ...(mockFirm().service_details as ServiceDetails),
        will_cover_specialist_equipment: true,
      },
    });
    const notCovers = mockFirm({
      service_details: {
        ...(mockFirm().service_details as ServiceDetails),
        will_cover_specialist_equipment: false,
      },
    });
    const result = filterFirmsInMemory([covers, notCovers], {
      medical_equipment: 'true',
    });
    expect(result).toHaveLength(1);
    expect(result[0].service_details?.will_cover_specialist_equipment).toBe(
      true,
    );
  });

  it('filters by trip_length + trip_type: keeps firm with matching duration age limit', () => {
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
      trip_type: 'single_trip',
      trip_length: 'up_to_1_month',
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
      trip_type: 'single_trip',
      trip_length: 'up_to_1_month',
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

  it('filters by age without trip_length: requires age limit >= user age', () => {
    const meetsAge = mockFirm({
      trip_covers: [
        {
          trip_type: 'single_trip',
          cover_area: 'uk_and_europe',
          age_limits: {
            ...emptyAgeLimits,
            land_30_days_max_age: 70,
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
    const result = filterFirmsInMemory([meetsAge, tooLow], { age: '65' });
    expect(result).toHaveLength(1);
    expect(
      (result[0].trip_covers as TripCover[])[0].age_limits.land_30_days_max_age,
    ).toBe(70);
  });
});
