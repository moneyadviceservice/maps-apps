import {
  buildSearchableFields,
  emptyMedicalSpecialisms,
  emptyServiceDetails,
} from 'lib/firms/firmDefaults';
import type {
  MainTravelInsuranceFirmDocument,
  TradingTravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

export const createMockFirm = (
  overrides?: Partial<MainTravelInsuranceFirmDocument>,
): MainTravelInsuranceFirmDocument => {
  const registered_name = 'Holiday Extras Cover Limited';
  const fca_number = 123456;

  return {
    id: 'travel_insurance_firm_mock',
    type: 'main',
    fca_number,
    registered_name,
    website_address: 'https://www.holidayextras.com',
    approved_at: '2023-01-15T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-12-01T00:00:00Z',
    hidden_at: null,
    reregistered_at: null,
    reregister_approved_at: null,
    renewal_draft: null,
    renewal_resume_href: null,
    pending_add_to_directory: false,
    pending_add_to_directory_until: null,
    self_serve_edit_draft: null,
    cover_service_confirmed_at: null,
    customer_contact_confirmed_at: null,
    confirmed_disclaimer: true,
    status: 'active',
    covered_by_ombudsman_question: 'Yes',
    medical_coverage: {
      covers_medical_condition_question: 'all',
      risk_profile_approach_question: 'questionaire',
      specialised_medical_conditions_covers_all: true,
      will_not_cover_some_medical_conditions: false,
      will_cover_undergoing_treatment: true,
      terminal_prognosis_cover: true,
      specific_conditions: {
        metastatic_breast_cancer: 'true',
        ulceritive_colitis_and_anaemia: 'true',
        heart_attack_with_hbp_and_high_cholesterol: 'true',
        copd_with_respiratory_infection: 'true',
        motor_neurone_disease: 'false',
        hodgkin_lymphoma: 'true',
        acute_myeloid_leukaemia: 'true',
        guillain_barre_syndrome: 'true',
        heart_failure_and_arrhytmia: 'true',
        stroke_with_hbp: 'true',
        peripheral_vascular_disease: 'true',
        schizophrenia: 'true',
        lupus: 'true',
        sickle_cell_and_renal: 'true',
        sub_arachnoid_haemorrhage_and_epilepsy: 'true',
        prostate_cancer: 'true',
        type_one_diabetes: 'true',
        parkinsons_disease: 'true',
        hiv: 'true',
      },
      likely_not_cover_medical_condition: null,
      cover_undergoing_treatment: null,
    },
    service_details: {
      ...emptyServiceDetails(),
      offers_telephone_quote: true,
      cover_for_specialist_equipment: 3000,
      medical_screening_company: 'Verisk',
      how_far_in_advance_trip_cover: 'up_to_12_month',
      covid19_medical_repatriation: true,
      covid19_cancellation_cover: true,
      will_cover_specialist_equipment: true,
      supplies_documentation_when_needed_question: true,
    },
    trip_covers: [],
    medical_specialisms: emptyMedicalSpecialisms(),
    office: {
      address: {
        line_one: '2nd Floor, 1 Tower View',
        line_two: 'Kings Hill',
        town: 'West Malling',
        county: 'Kent',
        country: 'Kent',
        postcode: 'ME19 4UY',
      },
      contact: {
        email_address: 'insurancewithenquiries@holidayextras.com',
        telephone_number: '0333 999 2679',
        website: 'https://www.holidayextras.com',
      },
      location: {
        latitude: 51.275916,
        longitude: 0.401099,
      },
      disabled_access: false,
      opening_times: {
        weekday: {
          opening_time: '09:00:00',
          closing_time: '17:00:00',
        },
        weekend: {
          saturday_opening_time: '09:00',
          saturday_closing_time: '17:00',
          sunday_opening_time: null,
          sunday_closing_time: null,
        },
      },

      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-12-01T00:00:00Z',
    },
    principal: {
      first_name: 'Jane',
      last_name: 'Smith',
      job_title: 'Director',
      email_address: 'jane@example.com',
      telephone_number: null,
      confirmed_disclaimer: true,
      senior_manager_name: null,
      individual_reference_number: 'IRN123',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-12-01T00:00:00Z',
    },
    searchable: buildSearchableFields(registered_name, fca_number),
    ...overrides,
  };
};

export const createMockTradingFirm = (
  overrides?: Partial<TradingTravelInsuranceFirmDocument>,
): TradingTravelInsuranceFirmDocument => {
  const { type: _type, main_firm_id, ...baseOverrides } = overrides ?? {};
  const id = baseOverrides.id ?? 'travel_insurance_firm_trading_mock';

  return {
    ...createMockFirm({ id, ...baseOverrides }),
    type: 'trading',
    main_firm_id: main_firm_id ?? 'travel_insurance_firm_mock',
    ...overrides,
  };
};
