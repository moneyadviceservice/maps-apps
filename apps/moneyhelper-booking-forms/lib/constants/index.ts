/******** ENUMS *********/
export enum FlowName {
  BASE = 'base',

  /*** Main Flows ***/
  PENSION_WISE = 'pw',
  DIVORCE_SEPARATION = 'ds',
  SELF_EMPLOYED = 'se',
  PENSION_LOSS = 'pl',
  PENSION_SAFE_GUARDING = 'psg',
}

export enum StepName {
  APPOINTMENT_TYPE = 'appointment-type',
  ERROR = 'error',
  LOADING = 'loading',
  SUBMIT = 'submit',
  CONFIRMATION = 'confirmation',

  // PENSION WISE
  PENSION_WISE_APPOINTMENT = 'pension-wise-appointment',
  PENSION_WISE_NOT_ELIGIBLE = 'pension-wise-not-eligible',

  // SELF EMPLOYED
  SELF_EMPLOYED_APPOINTMENT = 'self-employed-appointment',

  // DIVORCE APPOINTMENT
  DIVORCE_APPOINTMENT = 'divorce-appointment',
  DIVORCE_NOT_ELIGIBLE = 'divorce-not-eligible',

  // PENSION LOSS APPOINTMENT
  PENSION_LOSS_APPOINTMENT = 'pension-loss-appointment',
  PENSION_LOSS_NOT_ELIGIBLE = 'pension-loss-not-eligible',

  // PENSION SAFE GUARDING
  PENSION_SAFEGUARDING_APPOINTMENT = 'pension-safeguarding-appointment',

  // ELIGIBILITY
  ELIGIBILITY_DEFINED_CONTRIBUTION = 'eligibility-defined-contribution',
  ELIGIBILITY_OVER_50 = 'eligibility-over-50',
  ELIGIBILITY_UK_PENSIONS = 'eligibility-uk-pensions',
  ELIGIBILITY_AGE_EXCEPTIONS = 'eligibility-age-exceptions',
  ELIGIBILITY_BUSINESS_STATE = 'eligibility-business-state',
  ELIGIBILITY_FINANCIAL_SETTLEMENT = 'eligibility-financial-settlement',
  ELIGIBILITY_PENSION_LOSS = 'eligibility-pension-loss',
  ELIGIBILITY_PENSION_PROVIDER = 'eligibility-pension-provider',
  ELIGIBILITY_DIVORCE_JURISDICTION = 'eligibility-divorce-jurisdiction',

  // ACCESS NEEDS
  ACCESS_SUPPORT = 'access-support',
  ACCESS_LANGUAGE = 'access-language',
  ACCESS_OPTIONS = 'access-options',
  ACCESS_BSL = 'access-bsl',
  ACCESS_COMPANION = 'access-companion',
  ACCESS_REVIEW = 'access-review',

  // COMMON
  APPOINTMENT_DATE_TIME = 'appointment-date-time',
  PRE_APPOINTMENT = 'pre-appointment',
  CONTACT_DETAILS = 'contact-details',
  COMMUNICATION_PREFERENCES = 'communication-preferences',
  CONFIRM_DETAILS = 'confirm-details',

  // ADDRESS
  ADDRESS_LOOKUP = 'address-lookup',
  ADDRESS_DETAILS = 'address-details',
  ADDRESS_CONFIRMATION = 'address-confirmation',

  // AMEND APPOINTMENT
  FIND_APPOINTMENT = 'find-appointment',
  APPOINTMENT_FOUND = 'appointment-found',

  // LOADING
  LOADING_BOOKING_AVAILABILITY = 'loading/appointment-availability',
  LOADING_BOOKING_CREATE = 'loading/booking-create',
  LOADING_BOOKING_LOOKUP = 'loading/booking-lookup',
}

// Set once at the start of the booking flow and used to drive steps array starting point and flow-specific behavior / ui etc
export enum JourneyType {
  BASE = 'base',
  CHANGE = 'change',
}

export enum Guards {
  COOKIE_GUARD = 'cookieGuard',
  VALIDATE_STEP_GUARD = 'validateStepGuard',
  AUTO_ADVANCE_GUARD = 'autoAdvanceGuard',
  EDIT_MODE_INIT_GUARD = 'editModeInitGuard',
  CLEAR_EDIT_MODE_GUARD = 'clearEditModeGuard',
  JOURNEY_ENTRY_GUARD = 'journeyEntryGuard',
}

export enum SidebarType {
  HELP = 'help',
  INFORMATION = 'information',
}

// App-level error status codes for route-level fallback scenarios
export enum AppErrorCode {
  LOADING_ROUTE_FALLBACK = '900',
  SUBMIT_ROUTE_FALLBACK = '901',
  ROUTE_SETUP_FALLBACK = '902',
}

// Async actions for form submission
export enum AsyncAction {
  BOOKING_AVAILABILITY = 'appointment-availability',
  BOOKING_CREATE = 'booking-create',
  BOOKING_LOOKUP = 'booking-lookup',
}

export enum FormFieldName {
  // Navigation / system (used on most steps)
  NEXT_STEP = 'nextStep',

  // Eligibility
  ELIGIBILITY_DEFINED_CONTRIBUTION_STATUS = 'eligibilityDefinedContributionStatus',
  ELIGIBILITY_OVER_50_STATUS = 'eligibilityOver50Status',
  ELIGIBILITY_UK_PENSION_STATUS = 'eligibilityUkPensionStatus',
  ELIGIBILITY_AGE_EXCEPTION_TYPE = 'eligibilityAgeExceptionType',
  ELIGIBILITY_FINANCIAL_SETTLEMENT_STATUS = 'eligibilityFinancialSettlementStatus',
  ELIGIBILITY_DIVORCE_JURISDICTION_STATUS = 'eligibilityDivorceJurisdictionStatus',
  ELIGIBILITY_PENSION_LOSS_STATUS = 'eligibilityPensionLossStatus',
  ELIGIBILITY_BUSINESS_STATE = 'eligibilityBusinessState',
  ELIGIBILITY_REFERRED_FROM = 'eligibilityReferredFrom',
  ELIGIBILITY_TRANSFERRING_TO = 'eligibilityTransferringTo',

  // Access needs
  ACCESS_SUPPORT_STATUS = 'accessSupportStatus',
  ACCESS_SUPPORT_REQUEST = 'accessSupportRequest',
  ACCESS_SUPPORT_COMPANION = 'accessSupportCompanion',
  ACCESS_SUPPORT_COMPANION_NAME = 'accessSupportCompanionName',
  ACCESS_SUPPORT_DETAILS = 'accessSupportDetails',
  ACCESS_SUPPORT_LANGUAGE_TYPE = 'accessSupportLanguageType',
  ACCESS_SUPPORT_LANGUAGE_OTHER = 'accessSupportLanguageOther',

  // Appointment
  APPOINTMENT_SLOT_SELECTION = 'appointmentSlotSelection',
  APPOINTMENT_DATE = 'appointmentDate',
  APPOINTMENT_FOUND_ACTION = 'appointmentFoundAction',

  // Contact details
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL_ADDRESS = 'emailAddress',
  PHONE_NUMBER = 'phoneNumber',
  DATE_OF_BIRTH = 'dateOfBirth',
  MEMORABLE_WORD = 'memorableWord',

  // Communication preferences
  COMMUNICATION_METHOD = 'communicationMethod',
  COMMUNICATION_LARGE_PRINT = 'communicationLargePrint',
  COMMUNICATION_CONTACT_YOU = 'communicationContactYou',

  // Address
  LOOKUP_POSTCODE = 'lookupPostcode',
  LOOKUP_ADDRESS_LINE_1 = 'lookupAddressLine1',
  ADDRESS_LINE_1 = 'addressLine1',
  ADDRESS_LINE_2 = 'addressLine2',
  CITY = 'city',
  COUNTY = 'county',
  POSTCODE = 'postcode',
  COUNTRY = 'country',

  // Find/Amend appointment
  REFERENCE_NUMBER = 'referenceNumber',
}

/********* CONSTANTS *********/
export const ALLOWED_JOURNEY_TYPES = new Set<string>([
  JourneyType.BASE,
  JourneyType.CHANGE,
]);

/********* MAPPINGS *********/
export const FLOW_NAME_LABEL_MAP: Record<string, string> = {
  [FlowName.PENSION_WISE]: 'Pension Wise',
  [FlowName.DIVORCE_SEPARATION]: 'Divorce Separation',
  [FlowName.SELF_EMPLOYED]: 'Self Employed',
  [FlowName.PENSION_LOSS]: 'Pension Loss',
  [FlowName.PENSION_SAFE_GUARDING]: 'Pension Safeguarding',
};

export const JOURNEY_TYPE_INITIAL_STEP_MAP: Record<string, StepName> = {
  [JourneyType.BASE]: StepName.APPOINTMENT_TYPE,
  [JourneyType.CHANGE]: StepName.FIND_APPOINTMENT,
};
export const INITIAL_STEP_JOURNEY_TYPE_MAP: Record<string, JourneyType> = {
  [StepName.APPOINTMENT_TYPE]: JourneyType.BASE,
  [StepName.FIND_APPOINTMENT]: JourneyType.CHANGE,
};

// Async action map to success steps
export const ASYNC_ACTION_SUCCESS_STEP_MAP: Record<AsyncAction, StepName> = {
  [AsyncAction.BOOKING_AVAILABILITY]: StepName.APPOINTMENT_DATE_TIME,
  [AsyncAction.BOOKING_CREATE]: StepName.CONFIRMATION,
  [AsyncAction.BOOKING_LOOKUP]: StepName.APPOINTMENT_FOUND,
};

// Async action map to loading steps
export const ASYNC_ACTION_LOADING_STEP_MAP: Record<AsyncAction, StepName> = {
  [AsyncAction.BOOKING_AVAILABILITY]: StepName.LOADING_BOOKING_AVAILABILITY,
  [AsyncAction.BOOKING_CREATE]: StepName.LOADING_BOOKING_CREATE,
  [AsyncAction.BOOKING_LOOKUP]: StepName.LOADING_BOOKING_LOOKUP,
};

export const FORM_FIELD_CONTENT_KEY: Record<
  Exclude<FormFieldName, FormFieldName.NEXT_STEP>,
  string
> = {
  [FormFieldName.ELIGIBILITY_DEFINED_CONTRIBUTION_STATUS]:
    'defined-contribution-status',
  [FormFieldName.ELIGIBILITY_OVER_50_STATUS]: 'over-50-status',
  [FormFieldName.ELIGIBILITY_UK_PENSION_STATUS]: 'uk-pension-status',
  [FormFieldName.ELIGIBILITY_AGE_EXCEPTION_TYPE]: 'age-exception-type',
  [FormFieldName.ELIGIBILITY_FINANCIAL_SETTLEMENT_STATUS]:
    'financial-settlement-status',
  [FormFieldName.ELIGIBILITY_DIVORCE_JURISDICTION_STATUS]:
    'divorce-jurisdiction-status',
  [FormFieldName.ELIGIBILITY_PENSION_LOSS_STATUS]: 'pension-loss-status',
  [FormFieldName.ELIGIBILITY_BUSINESS_STATE]: 'business-state',
  [FormFieldName.ELIGIBILITY_REFERRED_FROM]: 'referred-from',
  [FormFieldName.ELIGIBILITY_TRANSFERRING_TO]: 'transferring-to',

  [FormFieldName.ACCESS_SUPPORT_STATUS]: 'support-status',
  [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'support-request',
  [FormFieldName.ACCESS_SUPPORT_COMPANION]: 'support-companion',
  [FormFieldName.ACCESS_SUPPORT_COMPANION_NAME]: 'companion-name',
  [FormFieldName.ACCESS_SUPPORT_DETAILS]: 'support-details',
  [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'support-language-type',
  [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: 'support-language-other',

  [FormFieldName.APPOINTMENT_SLOT_SELECTION]: 'appointment-slot-selection',
  [FormFieldName.APPOINTMENT_DATE]: 'appointment-date',
  [FormFieldName.APPOINTMENT_FOUND_ACTION]: 'appointment-found-action',

  [FormFieldName.FIRST_NAME]: 'first-name',
  [FormFieldName.LAST_NAME]: 'last-name',
  [FormFieldName.EMAIL_ADDRESS]: 'email-address',
  [FormFieldName.PHONE_NUMBER]: 'phone-number',
  [FormFieldName.DATE_OF_BIRTH]: 'date-of-birth',
  [FormFieldName.MEMORABLE_WORD]: 'memorable-word',

  [FormFieldName.COMMUNICATION_METHOD]: 'communication-method',
  [FormFieldName.COMMUNICATION_LARGE_PRINT]: 'communication-large-print',
  [FormFieldName.COMMUNICATION_CONTACT_YOU]: 'communication-contact-you',

  [FormFieldName.LOOKUP_POSTCODE]: 'lookup-postcode',
  [FormFieldName.LOOKUP_ADDRESS_LINE_1]: 'lookup-address-line-1',
  [FormFieldName.ADDRESS_LINE_1]: 'address-line-1',
  [FormFieldName.ADDRESS_LINE_2]: 'address-line-2',
  [FormFieldName.CITY]: 'city',
  [FormFieldName.COUNTY]: 'county',
  [FormFieldName.POSTCODE]: 'postcode',
  [FormFieldName.COUNTRY]: 'country',

  [FormFieldName.REFERENCE_NUMBER]: 'reference-number',
};
