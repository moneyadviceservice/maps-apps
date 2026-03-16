/**
 * Duplicate of the same enums in apps/moneyhelper-contact-forms/src/lib/constants/index.ts
 * Kept in sync manually to ensure e2e tests are aligned with the actual application constants.
 */

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
