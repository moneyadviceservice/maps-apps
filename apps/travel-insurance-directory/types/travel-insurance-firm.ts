/**
 * TypeScript schema for Cosmos DB Travel Insurance Firm documents
 *
 * This schema represents the document structure stored in Cosmos DB
 * after migration from PostgreSQL.
 */

/**
 * Firm status derived from approval/hidden/reregistered dates
 */
export type FirmStatus = 'active' | 'hidden' | 'pending_approval';

/**
 * Medical condition coverage question values
 */
export type MedicalConditionCoverage = 'all' | 'one_specific';

/**
 * Risk profile approach question values
 *
 * Note: "questionaire" appears to be a typo for "questionnaire"
 */
export type RiskProfileApproach =
  | 'non-proprietary'
  | 'questionaire'
  | 'bespoke';

/**
 * Trip type values
 */
export type TripType = 'single_trip' | 'annual_multi_trip';

/**
 * Cover area values
 */
export type CoverArea =
  | 'uk_and_europe'
  | 'worldwide_excluding_us_canada'
  | 'worldwide_including_us_canada';

/**
 * How far in advance trip cover values
 */
export type TripCoverAdvance =
  | 'up_to_6_month'
  | 'up_to_12_month'
  | 'up_to_18_month'
  | 'up_to_24_month';

/**
 * Specific medical condition question values
 * Note: In the data, these appear as strings "true"/"false" rather than booleans
 */
export type MedicalConditionAnswer = 'true' | 'false' | null;

/**
 * Medical condition specific coverage
 */
export interface SpecificConditions {
  metastatic_breast_cancer: MedicalConditionAnswer;
  ulceritive_colitis_and_anaemia: MedicalConditionAnswer;
  heart_attack_with_hbp_and_high_cholesterol: MedicalConditionAnswer;
  copd_with_respiratory_infection: MedicalConditionAnswer;
  motor_neurone_disease: MedicalConditionAnswer;
  hodgkin_lymphoma: MedicalConditionAnswer;
  acute_myeloid_leukaemia: MedicalConditionAnswer;
  guillain_barre_syndrome: MedicalConditionAnswer;
  heart_failure_and_arrhytmia: MedicalConditionAnswer;
  stroke_with_hbp: MedicalConditionAnswer;
  peripheral_vascular_disease: MedicalConditionAnswer;
  schizophrenia: MedicalConditionAnswer;
  lupus: MedicalConditionAnswer;
  sickle_cell_and_renal: MedicalConditionAnswer;
  sub_arachnoid_haemorrhage_and_epilepsy: MedicalConditionAnswer;
  prostate_cancer: MedicalConditionAnswer;
  type_one_diabetes: MedicalConditionAnswer;
  parkinsons_disease: MedicalConditionAnswer;
  hiv: MedicalConditionAnswer;
}

/**
 * Medical coverage information
 */
export interface MedicalCoverage {
  covers_medical_condition_question: MedicalConditionCoverage | null;
  risk_profile_approach_question: RiskProfileApproach | null;
  specialised_medical_conditions_covers_all: boolean | null;
  will_not_cover_some_medical_conditions: boolean | null;
  will_cover_undergoing_treatment: boolean | null;
  terminal_prognosis_cover: boolean | null;
  specific_conditions: SpecificConditions;
  likely_not_cover_medical_condition: string | null;
  cover_undergoing_treatment: string | null;
}

/**
 * Service details
 */
export interface ServiceDetails {
  offers_telephone_quote: boolean | null;
  cover_for_specialist_equipment: number | null;
  medical_screening_company: string | null;
  how_far_in_advance_trip_cover: TripCoverAdvance | null;
  covid19_medical_repatriation: boolean | null;
  covid19_cancellation_cover: boolean | null;
  will_cover_specialist_equipment: boolean | null;
  supplies_documentation_when_needed_question: boolean | null;
}

/**
 * Age limits for trip covers
 */
export interface AgeLimits {
  land_30_days_max_age: number | null;
  cruise_30_days_max_age: number | null;
  land_45_days_max_age: number | null;
  cruise_45_days_max_age: number | null;
  land_50_days_max_age: number | null;
  cruise_50_days_max_age: number | null;
  land_55_days_max_age: number | null;
  cruise_55_days_max_age: number | null;
}

/**
 * Trip cover information
 */
export interface TripCover {
  trip_type: TripType;
  cover_area: CoverArea;
  age_limits: AgeLimits;
  created_at: string;
  updated_at: string;
}

/**
 * Medical specialisms information
 */
export interface MedicalSpecialisms {
  specialised_medical_conditions_covers_all: boolean | null;
  will_not_cover_some_medical_conditions: boolean | null;
  will_cover_undergoing_treatment: boolean | null;
  terminal_prognosis_cover: boolean | null;
  likely_not_cover_medical_condition: string | null;
  cover_undergoing_treatment: string | null;
  specialised_medical_conditions_cover: string | null;
}

/**
 * Office address
 */
export interface OfficeAddress {
  line_one: string | null;
  line_two: string | null;
  town: string | null;
  county: string | null;
  postcode: string | null;
}

/**
 * Office contact information
 */
export interface OfficeContact {
  email_address: string | null;
  telephone_number: string | null;
  website: string | null;
}

/**
 * Office location coordinates
 */
export interface OfficeLocation {
  latitude: number | null;
  longitude: number | null;
}

/**
 * Opening times for a day
 */
export interface DayOpeningTimes {
  opening: string | null;
  closing: string | null;
}

/**
 * Opening times for a week
 */
export interface OpeningTimes {
  weekday: DayOpeningTimes;
  saturday: DayOpeningTimes;
  sunday: DayOpeningTimes;
}

/**
 * Office information
 */
export interface Office {
  address: OfficeAddress;
  contact: OfficeContact;
  location: OfficeLocation;
  disabled_access: boolean;
  opening_times: OpeningTimes[];
  created_at: string;
  updated_at: string;
}

/**
 * Principal information
 */
export interface Principal {
  first_name: string;
  last_name: string;
  job_title: string | null;
  email_address: string | null;
  telephone_number: string | null;
  confirmed_disclaimer: boolean;
  senior_manager_name: string | null;
  individual_reference_number: string;
  created_at: string;
  updated_at: string;
}

/**
 * Searchable fields for full-text search
 */
export interface SearchableFields {
  registered_name_lower: string;
  fca_number_string: string;
  keywords: string[];
}

/**
 * Trading name structure
 */
export interface TradingName {
  fca_number: number;
  registered_name: string;
  website_address: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  hidden_at: string | null;
  reregistered_at: string | null;
  reregister_approved_at: string | null;
  confirmed_disclaimer: boolean;
  status: FirmStatus;
  covered_by_ombudsman_question: string | null;
  service_details: ServiceDetails | null;
  trip_covers: TripCover[];
  medical_specialisms: MedicalSpecialisms;
  offices: Office[];
  principals: Principal[];
  searchable: SearchableFields;
}

/**
 * Main Travel Insurance Firm document structure
 */
export interface TravelInsuranceFirmDocument {
  fca_number: number;
  registered_name: string;
  website_address: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  hidden_at: string | null;
  reregistered_at: string | null;
  reregister_approved_at: string | null;
  confirmed_disclaimer: boolean;
  status: FirmStatus;
  covered_by_ombudsman_question: string | null;

  // Embedded related entities
  medical_coverage: MedicalCoverage;
  service_details: ServiceDetails | null;
  trip_covers: TripCover[];
  medical_specialisms: MedicalSpecialisms | null;
  offices: Office[];
  principals: Principal[];

  // Trading names array (nested firm-like structures)
  trading_names: TradingName[];

  // Search optimization
  searchable: SearchableFields;

  /**
   * Precomputed order for listings (updated hourly by job to match shufflePACs).
   * Used for ORDER BY in Cosmos so pagination can be done in DB.
   */
  display_order?: number;
}
