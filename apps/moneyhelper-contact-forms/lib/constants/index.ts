export enum FlowName {
  BASE = 'base',

  /**** Main Flows ****/
  MONEY_MANAGEMENT = 'money-management',
  PENSIONS_AND_RETIREMENT = 'pensions-and-retirement',
  DEBT_ADVICE = 'debt-advice',
  INSURANCE = 'insurance',
  SCAMS = 'scams',

  /**** PENSIONS_AND_RETIREMENT Flow ****/
  PENSIONS_APPOINTMENTS = 'pensions-appointments',
  PENSIONS_TRACING = 'pensions-tracing',
  MHPD = 'mhpd',
  PENSIONS_GUIDANCE = 'pensions-guidance',

  /**** INSURANCE Flow ****/
  INSURANCE_TRAVEL = 'insurance-travel',
  INSURANCE_OTHER = 'insurance-other',

  /**** PENSIONS_APPOINTMENTS Flow  ****/
  APPOINTMENT_PENSION_WISE = 'appointment-pension-wise',
  APPOINTMENT_DIVORCE = 'appointment-divorce',
}

export enum StepName {
  GUIDANCE = 'guidance',
  ENQUIRY_TYPE = 'enquiry-type',
  INSURANCE_TYPE = 'insurance-type',
  PENSION_TYPE = 'pension-type',
  APPOINTMENT_TYPE = 'appointment-type',
  NAME = 'name',
  DATE_OF_BIRTH = 'date-of-birth',
  CONTACT_DETAILS = 'contact-details',
  ENQUIRY = 'enquiry',
  CONFIRMATION = 'confirmation',
  ABOUT_SCAMS = 'about-scams',
  ABOUT_DEBT = 'about-debt',
  ABOUT_INSURANCE = 'about-insurance',
  ABOUT_PENSION_TRACING = 'about-pension-tracing',
  ABOUT_MHPD = 'about-mhpd',
  ABOUT_MONEY_MANAGEMENT = 'about-money-management',
  ABOUT_PENSION_WISE = 'about-pension-wise',
  ABOUT_PENSION_DIVORCE = 'about-pension-divorce',
  LOADING = 'loading',
  ERROR = 'error',
}

export enum Guards {
  COOKIE_GUARD = 'cookieGuard',
  VALIDATE_STEP_GUARD = 'validateStepGuard',
  AUTO_ADVANCE_GUARD = 'autoAdvanceGuard',
}

/**
 * Date of Birth validation constants.
 */
export const DOB = {
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  year: {
    min: 1900,
    max: new Date().getFullYear(),
  },
};

/**
 * Error message lookup for various error codes returned by the API.
 * https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1174/Azure-Function?anchor=response-to-react-webform-%22363974458063450487685701587858ae%22-%221e31ac0375494852a7fd5a9596257e04%22
 */
export const ERROR_MESSAGES: Record<string, string> = {
  '100':
    'Validation Failure – Invalid Payload. Your form submission is not valid.',
  '101':
    'Too Many Open Cases – Case Limit Reached for This Case Type. There was an issue in lodging your enquiry. Please contact us through another method.',
  '102':
    'Generic Failure – Contact/Case/CaseType Creation Issue in D365. Something went wrong while trying to create Case.',
  '103': 'Unknown error.',
  '104': 'Form submission failed. Please try again later.',
};

/**
 * A map for steps that require static headings regardless of the flow selected by the user. i.e. they are not dynamic based on the flow.
 */
export const HEADING_MAP: Record<string, string> = {
  [StepName.INSURANCE_TYPE]: StepName.INSURANCE_TYPE,
  [StepName.PENSION_TYPE]: StepName.PENSION_TYPE,
  [StepName.APPOINTMENT_TYPE]: StepName.APPOINTMENT_TYPE,
};

/**
 * Mapping of flow names to enquiry types and kind of enquiry.
 * Required to form the payload.
 */
export const FLOW_TO_ENQUIRY_MAP: Record<
  string,
  { enquiryType: string; kindofEnquiry?: number }
> = {
  [FlowName.MONEY_MANAGEMENT]: {
    enquiryType: 'money management',
    kindofEnquiry: 9,
  },
  [FlowName.PENSIONS_GUIDANCE]: {
    enquiryType: 'pensions - guidance',
    kindofEnquiry: 1,
  },
  [FlowName.DEBT_ADVICE]: { enquiryType: 'debt advice', kindofEnquiry: 10 },
  [FlowName.SCAMS]: { enquiryType: 'scams' },
  [FlowName.PENSIONS_TRACING]: {
    enquiryType: 'pensions - state pension',
    kindofEnquiry: 3,
  },
  [FlowName.APPOINTMENT_PENSION_WISE]: {
    enquiryType: 'pensions - appointments',
    kindofEnquiry: 4,
  },
  [FlowName.APPOINTMENT_DIVORCE]: {
    enquiryType: 'pensions - appointments',
    kindofEnquiry: 5,
  },
  [FlowName.MHPD]: { enquiryType: 'MHPD', kindofEnquiry: 7 },
  [FlowName.INSURANCE_TRAVEL]: {
    enquiryType: 'insurance - travel',
  },
  [FlowName.INSURANCE_OTHER]: {
    enquiryType: 'insurance - other',
    kindofEnquiry: 8,
  },
};
