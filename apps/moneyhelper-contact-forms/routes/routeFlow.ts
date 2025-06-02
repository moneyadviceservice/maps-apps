import { FlowName, StepName } from '../lib/constants';

// Define route flows
export const routeFlow = new Map<string, string[]>([
  [
    FlowName.DEFAULT,
    [
      StepName.ENQUIRY_TYPE,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
  [
    FlowName.SCAMS,
    [
      StepName.ENQUIRY_TYPE,
      StepName.ABOUT_SCAMS,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
  [
    FlowName.DEBT_ADVICE,
    [
      StepName.ENQUIRY_TYPE,
      StepName.ABOUT_DEBT,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
  [
    FlowName.INSURANCE,
    [StepName.ENQUIRY_TYPE, StepName.KIND_OF_ENQUIRY] as StepName[],
  ],
  [
    FlowName.INSURANCE_OTHER,
    [
      StepName.ENQUIRY_TYPE,
      StepName.KIND_OF_ENQUIRY,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
  [
    FlowName.INSURANCE_TRAVEL,
    [
      StepName.ENQUIRY_TYPE,
      StepName.KIND_OF_ENQUIRY,
      StepName.ABOUT_INSURANCE,
    ] as StepName[],
  ],
  [
    FlowName.PENSIONS_AND_RETIREMENT,
    [StepName.ENQUIRY_TYPE, StepName.KIND_OF_ENQUIRY] as StepName[],
  ],
  [
    FlowName.PENSIONS_STATE_PENSION,
    [
      StepName.ENQUIRY_TYPE,
      StepName.KIND_OF_ENQUIRY,
      StepName.ABOUT_STATE_PENSION,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
  [
    FlowName.PENSIONS_TRACING,
    [
      StepName.ENQUIRY_TYPE,
      StepName.KIND_OF_ENQUIRY,
      StepName.ABOUT_PENSION_TRACING,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
  [
    FlowName.MHPD,
    [
      StepName.ENQUIRY_TYPE,
      StepName.KIND_OF_ENQUIRY,
      StepName.ABOUT_MHPD,
      StepName.NAME,
      StepName.DATE_OF_BIRTH,
      StepName.CONTACT_DETAILS,
      StepName.ENQUIRY,
      StepName.CONFIRMATION,
    ] as StepName[],
  ],
]);
