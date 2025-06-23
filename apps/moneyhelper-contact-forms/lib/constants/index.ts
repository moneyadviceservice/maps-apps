export enum FlowName {
  DEFAULT = 'money-management',
  PENSIONS_AND_RETIREMENT = 'pensions-and-retirement',
  DEBT_ADVICE = 'debt-advice',
  INSURANCE = 'insurance',
  SCAMS = 'scams',

  /**** PENSIONS_AND_RETIREMENT Flow ****/
  PENSIONS_STATE_PENSION = 'pensions-state-pension',
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
  // APPOINTMENT_SELF_EMPLOYED = 'appointment-self-employed',
}

export enum StepName {
  GUIDANCE = 'guidance',
  ENQUIRY_TYPE = 'enquiry-type',
  INSURANCE_TYPE = 'insurance-type',
  PENSIONS_AND_RETIREMENT = 'pensions-and-retirement',
  APPOINTMENT_TYPE = 'appointment-type',
  NAME = 'name',
  DATE_OF_BIRTH = 'date-of-birth',
  CONTACT_DETAILS = 'contact-details',
  ENQUIRY = 'enquiry',
  CONFIRMATION = 'confirmation',
  ABOUT_SCAMS = 'about-scams',
  ABOUT_DEBT = 'about-debt',
  ABOUT_INSURANCE = 'about-insurance',
  ABOUT_STATE_PENSION = 'about-state-pension',
  ABOUT_PENSION_TRACING = 'about-pension-tracing',
  ABOUT_MHPD = 'about-mhpd',
  ABOUT_PENSION_WISE = 'about-pension-wise',
  ABOUT_PENSION_DIVORCE = 'about-pension-divorce',
  LOADING = 'loading',
  ERROR = 'error',
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
 * List of flows that require a booking reference.
 * Used to determine if the booking reference field should be displayed on the enquiry step.
 */
export const FLOWS_WITH_BOOKING_REFERENCE = [
  FlowName.APPOINTMENT_PENSION_WISE,
  FlowName.APPOINTMENT_DIVORCE,
];

/**
 * List of flows that require a phone number.
 * Drives phone number validation (see isPhoneNumberRequired.ts), and used to drive UI logic so that the label does / doesn't include the word "optional".
 *
 */
export const FLOWS_WITH_REQUIRED_PHONE_NUMBER = [
  FlowName.APPOINTMENT_PENSION_WISE,
  FlowName.APPOINTMENT_DIVORCE,
];

/**
 * Mapping of flow names to enquiry types and kind of enquiry.
 */
export const FLOW_TO_ENQUIRY_MAP: Record<
  string,
  { enquiryType: string; kindofEnquiry?: number }
> = {
  [FlowName.DEFAULT]: { enquiryType: 'money management' },
  [FlowName.PENSIONS_GUIDANCE]: { enquiryType: 'pensions - guidance' },
  [FlowName.DEBT_ADVICE]: { enquiryType: 'debt advice' },
  [FlowName.SCAMS]: { enquiryType: 'scams' },
  [FlowName.PENSIONS_STATE_PENSION]: {
    enquiryType: 'pensions - state pension',
    kindofEnquiry: 2,
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
