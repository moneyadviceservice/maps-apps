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
]);
