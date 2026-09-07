/**
 * TypeScript schema for v2 Cosmos DB Travel Insurance Firm documents.
 *
 * V2 stores every travel_insurance_firms row as a top-level document.
 * Main and trading-name firms are grouped by shared fca_number and
 * distinguished by type.
 */

/** Derived from approved_at, hidden_at, reregistered_at, reregister_approved_at */
export type FirmStatus = 'active' | 'hidden' | 'pending_approval';

export type FirmDocumentType = 'main' | 'trading';

export type MedicalConditionCoverage = 'all' | 'one_specific';

export type RiskProfileApproach =
  | 'non-proprietary'
  | 'questionaire'
  | 'bespoke';

export type TripType = 'single_trip' | 'annual_multi_trip';

export type CoverArea =
  | 'uk_and_europe'
  | 'worldwide_excluding_us_canada'
  | 'worldwide_including_us_canada';

export type TripCoverAdvance =
  | 'up_to_6_month'
  | 'up_to_12_month'
  | 'up_to_18_month'
  | 'up_to_24_month'
  | 'over_24_months';

export type MedicalConditionAnswer = 'true' | 'false' | null;

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

export type TripDurationBucket =
  | 'up_to_30_days'
  | 'up_to_90_days'
  | 'over_90_days';

export interface TravelModeAgeLimit {
  land: number | null;
  cruise: number | null;
}

export interface TripCoverAgeLimits {
  up_to_30_days: TravelModeAgeLimit;
  up_to_90_days: TravelModeAgeLimit;
  over_90_days: TravelModeAgeLimit;
}

export interface TripCover {
  trip_type: TripType;
  cover_area: CoverArea;
  age_limits: TripCoverAgeLimits;
  created_at: string;
  updated_at: string;
}

export interface MedicalSpecialisms {
  specialised_medical_conditions_covers_all: boolean | null;
  will_not_cover_some_medical_conditions: boolean | null;
  will_cover_undergoing_treatment: boolean | null;
  terminal_prognosis_cover: boolean | null;
  likely_not_cover_medical_condition: string | null;
  cover_undergoing_treatment: string | null;
  specialised_medical_conditions_cover: string | null;
}

type StringNull = string | null;

export interface OfficeAddress {
  line_one: StringNull;
  line_two?: StringNull;
  town: StringNull;
  county: StringNull;
  country?: StringNull;
  postcode: StringNull;
}

export interface OfficeContact {
  email_address: StringNull;
  telephone_number: StringNull;
  website: StringNull;
}

export interface OfficeLocation {
  latitude: number | null;
  longitude: number | null;
}

export interface OpeningTimesWeekday {
  opening_time: StringNull;
  closing_time: StringNull;
}

export interface OpeningTimesWeekend {
  saturday_opening?: boolean | 'yes' | 'no';
  saturday_opening_time: StringNull;
  saturday_closing_time: StringNull;
  sunday_opening?: boolean | 'yes' | 'no';
  sunday_opening_time: StringNull;
  sunday_closing_time: StringNull;
}

export interface OpeningTimes {
  weekday?: OpeningTimesWeekday;
  weekend?: OpeningTimesWeekend;
}

export interface Office {
  address: OfficeAddress;
  contact: OfficeContact;
  location: OfficeLocation;
  disabled_access: boolean;
  opening_times: OpeningTimes;
  created_at: string;
  updated_at: string;
}

export interface Principal {
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  email_address: string | null;
  telephone_number: string | null;
  confirmed_disclaimer: boolean;
  senior_manager_name: string | null;
  individual_reference_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchableFields {
  registered_name_lower: string;
  fca_number_string: string;
  keywords: string[];
}

export type ReregistrationLogs = {
  reRegWindowStartEmailSentAt?: string | null;
  lapsedEmailSentAt?: string | null;
};

/** Staged self-serve edits; live profile unchanged until confirm. */
export interface SelfServeEditDraft {
  trip_covers?: TripCover[];
  service_details?: ServiceDetails;
  office?: Office | null;
}

export interface TravelInsuranceFirmBaseDocument {
  id: string;
  type: FirmDocumentType;
  fca_number: number;
  registered_name: string;
  website_address: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  hidden_at: string | null;
  hidden_reason?: string | null;
  status: FirmStatus;
  service_details: ServiceDetails;
  trip_covers: TripCover[];
  medical_specialisms: MedicalSpecialisms;
  searchable: SearchableFields;
  office: Office | null;
  reRegistrationLogs?: ReregistrationLogs | null;
  /** In-progress Cover & Service / Customer Contact edits. */
  self_serve_edit_draft?: SelfServeEditDraft | null;
  /** Set when principal confirms Cover & Service summary; required for section completed. */
  cover_service_confirmed_at?: string | null;
  /** Set when principal confirms Customer Contact summary; required for section completed. */
  customer_contact_confirmed_at?: string | null;
}

/** Registration-question answers captured during a draft renewal (mirrors register form write paths). */
export interface RenewalDraft {
  covered_by_ombudsman_question: string | null;
  medical_coverage: Pick<
    MedicalCoverage,
    'risk_profile_approach_question' | 'specific_conditions'
  >;
  service_details: {
    supplies_documentation_when_needed_question: boolean | null;
  };
}

export interface MainTravelInsuranceFirmDocument
  extends TravelInsuranceFirmBaseDocument {
  type: 'main';
  reregistered_at: string | null;
  reregister_approved_at: string | null;
  confirmed_disclaimer: boolean;
  covered_by_ombudsman_question: string | null;
  medical_coverage: MedicalCoverage;
  principal: Principal;
  /** In-progress reregistration answers; live profile unchanged until submit. */
  renewal_draft?: RenewalDraft | null;
  /** Last saved `/register/firm/...` or `/register/scenario/...` step for resume. */
  renewal_resume_href?: string | null;
  /**
   * Admin still needs Keep/Add to directory after principal renew.
   * Cleared on admin Keep/Add or nightly lapse hide.
   */
  pending_add_to_directory?: boolean;
  /**
   * End of the renew window that was open when pending was set (pre-confirm anniversary).
   * Used so nightly can hide if Keep was skipped after reregister_approved_at moves the period base.
   */
  pending_add_to_directory_until?: string | null;
}

export interface TradingTravelInsuranceFirmDocument
  extends TravelInsuranceFirmBaseDocument {
  type: 'trading';
  /** Cosmos id of the parent main firm document. */
  main_firm_id: string;
}

export type TravelInsuranceFirmDocument =
  | MainTravelInsuranceFirmDocument
  | TradingTravelInsuranceFirmDocument;

/** Redis listings cache attaches display_order in memory only (not persisted in v2 Cosmos). */
export type TravelInsuranceFirmWithDisplayOrder =
  TravelInsuranceFirmDocument & {
    display_order?: number;
  };

/** Payload for creating a new main firm (Cosmos may assign id if omitted). */
export type CreateMainFirmPayload = Omit<
  MainTravelInsuranceFirmDocument,
  'id'
> & {
  id?: string;
};

/** Payload for creating a new trading firm document. */
export type CreateTradingFirmPayload = Omit<
  TradingTravelInsuranceFirmDocument,
  'id'
> & {
  id?: string;
};
