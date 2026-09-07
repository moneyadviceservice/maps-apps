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
  ADDRESS_DETAILS = 'address-details',
  ADDRESS_CONFIRMATION = 'address-confirmation',
  CONFIRM_DETAILS = 'confirm-details',

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

export enum SubmissionState {
  IDLE = 'idle',
  IN_PROGRESS = 'in_progress',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum ResponseMessage {
  GENERIC_ERROR = '103',
  SUBMISSION_FAILED = '104',
  FORM_HANDLER_ERROR = '105',
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

/********* CONSTANTS *********/
export const NEXT_STEP_VALUE_DELIMITER = '|';

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
