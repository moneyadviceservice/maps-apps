export enum FlowName {
  DEFAULT = 'money-management',
  PENSIONS_STATE_PENSION = 'pensions-state-pension',
  PENSIONS_APPOINTMENTS = 'pensions-appointments',
  PENSIONS_GUIDANCE = 'pensions-guidance',
  DEBT_ADVICE = 'debt-advice',
  INSURANCE = 'insurance',
  INSURANCE_TRAVEL = 'insurance-travel',
  INSURANCE_OTHER = 'insurance-other',
  SCAMS = 'scams',
  MHPD = 'MHPD',
}

export enum StepName {
  GUIDANCE = 'guidance',
  ENQUIRY_TYPE = 'enquiry-type',
  KIND_OF_ENQUIRY = 'kind-of-enquiry',
  NAME = 'name',
  DATE_OF_BIRTH = 'date-of-birth',
  CONTACT_DETAILS = 'contact-details',
  ENQUIRY = 'enquiry',
  CONFIRMATION = 'confirmation',
  ABOUT_SCAMS = 'about-scams',
  ABOUT_DEBT = 'about-debt',
  ABOUT_INSURANCE = 'about-insurance',
}

export const SUB_TO_PARENT_FLOW_MAP: Record<string, string> = {
  [FlowName.INSURANCE_OTHER]: FlowName.INSURANCE,
  [FlowName.INSURANCE_TRAVEL]: FlowName.INSURANCE,
};
