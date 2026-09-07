import {
  Office,
  ServiceDetails,
  TravelInsuranceFirmDocument,
  TripCover,
} from 'types/travel-insurance-firm';

/**
 * Stable self-serve E2E firm metadata.
 * Keep FRN / registered / trading names in sync with `selfServeCreds` in
 * `apps/e2e/travel-insurance-directory-e2e/data/selfServeCredentials.data.ts`.
 * Login email is unique per e2e run and comes from the account session only.
 */
export const selfServeE2eConstants = {
  fcaNumber: 123_456,
  fcaNumberString: '123456',
  registeredName: 'e2e main firm',
  /** Trading names returned by MSW FCA `/Names` mock for the E2E FRN. */
  tradingNames: [
    'trading firm e2e 1',
    'trading firm e2e 2',
    'trading firm e2e 3',
  ],
} as const;

export const baseState: Partial<TravelInsuranceFirmDocument> = {
  fca_number: selfServeE2eConstants.fcaNumber,
  registered_name: selfServeE2eConstants.registeredName,
  status: 'hidden',
  hidden_reason: null,
  service_details: undefined,
  trip_covers: [],
  office: undefined,
  self_serve_edit_draft: null,
  cover_service_confirmed_at: null,
  customer_contact_confirmed_at: null,
};

const office: Office = {
  address: {
    line_one: 'MaPS',
    line_two: '',
    town: 'Bedford',
    county: 'Bedfordshire',
    postcode: 'BD1 BD1',
  },
  contact: {
    email_address: 'first.name@email.com',
    telephone_number: '0800 000 0000',
    website: 'https://www.example-website.co.uk',
  },
  opening_times: {
    weekday: {
      opening_time: '08:30:00',
      closing_time: '20:00:00',
    },
    weekend: {
      saturday_opening_time: '09:00:00',
      saturday_closing_time: '17:30:00',
      sunday_opening_time: '10:00:00',
      sunday_closing_time: '17:00:00',
    },
  },
  disabled_access: false,
  location: { latitude: 1, longitude: 1 },
  created_at: '2020-09-15T10:48:03.068462+00:00',
  updated_at: '2023-11-30T15:04:27.550556+00:00',
};

const COMMON_METADATA = {
  age_limits: {
    up_to_30_days: { land: 1000, cruise: 1000 },
    up_to_90_days: { land: 1000, cruise: 1000 },
    over_90_days: { land: 1000, cruise: 1000 },
  },
  created_at: '2020-09-15T10:48:03.068462+00:00',
  updated_at: '2023-11-30T15:04:27.550556+00:00',
};

const COVER_AREAS = [
  'uk_and_europe',
  'worldwide_excluding_us_canada',
  'worldwide_including_us_canada',
] as const;

const TRIP_TYPES = ['single_trip', 'annual_multi_trip'] as const;

export const tripCovers: TripCover[] = COVER_AREAS.flatMap((cover_area) =>
  TRIP_TYPES.map((trip_type) => ({
    trip_type,
    cover_area,
    ...COMMON_METADATA,
  })),
);

const serviceDetails: ServiceDetails = {
  offers_telephone_quote: true,
  cover_for_specialist_equipment: 1000,
  medical_screening_company: 'verisk',
  how_far_in_advance_trip_cover: 'up_to_18_month',
  will_cover_specialist_equipment: false,
  supplies_documentation_when_needed_question: true,
  covid19_medical_repatriation: null,
  covid19_cancellation_cover: null,
};

export const baseCompleteState: Partial<TravelInsuranceFirmDocument> = {
  ...baseState,
  service_details: serviceDetails,
  trip_covers: tripCovers,
  office: office,
};
