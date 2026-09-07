import type {
  MedicalSpecialisms,
  Principal,
  SearchableFields,
  ServiceDetails,
  SpecificConditions,
  TravelModeAgeLimit,
  TripCoverAgeLimits,
} from 'types/travel-insurance-firm';

export type PrincipalInitialFields = Pick<
  Principal,
  | 'first_name'
  | 'last_name'
  | 'job_title'
  | 'email_address'
  | 'telephone_number'
  | 'individual_reference_number'
>;

export const emptyTravelModeAgeLimit = (): TravelModeAgeLimit => ({
  land: null,
  cruise: null,
});

export const emptyTripCoverAgeLimits = (): TripCoverAgeLimits => ({
  up_to_30_days: emptyTravelModeAgeLimit(),
  up_to_90_days: emptyTravelModeAgeLimit(),
  over_90_days: emptyTravelModeAgeLimit(),
});

export const emptyMedicalSpecialisms = (): MedicalSpecialisms => ({
  specialised_medical_conditions_covers_all: null,
  will_not_cover_some_medical_conditions: null,
  will_cover_undergoing_treatment: null,
  terminal_prognosis_cover: null,
  likely_not_cover_medical_condition: null,
  cover_undergoing_treatment: null,
  specialised_medical_conditions_cover: null,
});

export const emptyServiceDetails = (): ServiceDetails => ({
  offers_telephone_quote: null,
  cover_for_specialist_equipment: null,
  medical_screening_company: null,
  how_far_in_advance_trip_cover: null,
  covid19_medical_repatriation: null,
  covid19_cancellation_cover: null,
  will_cover_specialist_equipment: null,
  supplies_documentation_when_needed_question: null,
});

export const SPECIFIC_CONDITION_KEYS = Object.keys(
  emptySpecificConditionsTemplate(),
) as (keyof SpecificConditions)[];

function emptySpecificConditionsTemplate(): SpecificConditions {
  return {
    metastatic_breast_cancer: null,
    ulceritive_colitis_and_anaemia: null,
    heart_attack_with_hbp_and_high_cholesterol: null,
    copd_with_respiratory_infection: null,
    motor_neurone_disease: null,
    hodgkin_lymphoma: null,
    acute_myeloid_leukaemia: null,
    guillain_barre_syndrome: null,
    heart_failure_and_arrhytmia: null,
    stroke_with_hbp: null,
    peripheral_vascular_disease: null,
    schizophrenia: null,
    lupus: null,
    sickle_cell_and_renal: null,
    sub_arachnoid_haemorrhage_and_epilepsy: null,
    prostate_cancer: null,
    type_one_diabetes: null,
    parkinsons_disease: null,
    hiv: null,
  };
}

export const emptySpecificConditions = (): SpecificConditions =>
  emptySpecificConditionsTemplate();

export function buildPrincipalPayload(
  fields: Partial<PrincipalInitialFields> | undefined,
  nowIso: string,
): Principal {
  return {
    first_name: fields?.first_name ?? null,
    last_name: fields?.last_name ?? null,
    job_title: fields?.job_title ?? null,
    email_address: fields?.email_address ?? null,
    telephone_number: fields?.telephone_number ?? null,
    confirmed_disclaimer: false,
    senior_manager_name: null,
    individual_reference_number: fields?.individual_reference_number ?? null,
    created_at: nowIso,
    updated_at: nowIso,
  };
}

export function buildSearchableFields(
  registeredName: string,
  fcaNumber: number,
): SearchableFields {
  const registered_name_lower = registeredName.toLowerCase();
  return {
    registered_name_lower,
    fca_number_string: String(fcaNumber),
    keywords: registered_name_lower.split(/\s+/).filter(Boolean),
  };
}
