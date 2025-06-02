export enum FlowName {
  DEFAULT = 'money-management',
  PENSIONS_AND_RETIREMENT = 'pensions-and-retirement',
  PENSIONS_STATE_PENSION = 'pensions-state-pension',
  PENSIONS_APPOINTMENTS = 'pensions-appointments',
  PENSIONS_GUIDANCE = 'pensions-guidance',
  PENSIONS_TRACING = 'pensions-tracing',
  DEBT_ADVICE = 'debt-advice',
  INSURANCE = 'insurance',
  INSURANCE_TRAVEL = 'insurance-travel',
  INSURANCE_OTHER = 'insurance-other',
  SCAMS = 'scams',
  MHPD = 'mhpd',
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
  ABOUT_STATE_PENSION = 'about-state-pension',
  ABOUT_PENSION_TRACING = 'about-pension-tracing',
  ABOUT_MHPD = 'about-mhpd',
}

export const SUB_TO_PARENT_FLOW_MAP: Record<string, string> = {
  [FlowName.INSURANCE_OTHER]: FlowName.INSURANCE,
  [FlowName.INSURANCE_TRAVEL]: FlowName.INSURANCE,
  [FlowName.PENSIONS_STATE_PENSION]: FlowName.PENSIONS_AND_RETIREMENT,
  [FlowName.PENSIONS_TRACING]: FlowName.PENSIONS_AND_RETIREMENT,
  [FlowName.MHPD]: FlowName.PENSIONS_AND_RETIREMENT,
};

export const DOB = {
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  year: {
    min: 1900,
    max: new Date().getFullYear(),
  },
};
