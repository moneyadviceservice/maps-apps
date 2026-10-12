import { FlowName, StepName } from '../lib/constants';
import { ContactFlowConfigMap } from '../lib/types';

/**
 * Central configuration for flows in the app. Each flow can have custom properties that influence app behavior.
 * EG:
 *  - autoAdvanceStep is a look up key used by autoAdvanceGuard
 *  - showBookingReferenceField to drive UI differences in the appointment booking reference field
 *  - phoneNumberRequired to drive validation logic and UI differences in phone number field
 *
 * @see flowConfig
 */
export const flowConfig: ContactFlowConfigMap = new Map([
  [FlowName.BASE, {}],
  [FlowName.MONEY_MANAGEMENT, {}],
  [FlowName.SCAMS, {}],
  [FlowName.DEBT_ADVICE, {}],
  [FlowName.INSURANCE, {}],
  [FlowName.INSURANCE_OTHER, {}],
  [FlowName.INSURANCE_TRAVEL, {}],
  [FlowName.PENSIONS_AND_RETIREMENT, {}],
  [FlowName.PENSIONS_TRACING, {}],
  [FlowName.PENSIONS_GUIDANCE, {}],
  [
    FlowName.MHPD,
    {
      autoAdvanceStep: StepName.ABOUT_MHPD,
    },
  ],
  [FlowName.PENSIONS_APPOINTMENTS, {}],
  [
    FlowName.APPOINTMENT_PENSION_WISE,
    {
      showBookingReferenceField: true,
      phoneNumberRequired: true,
    },
  ],
  [
    FlowName.APPOINTMENT_DIVORCE,
    {
      showBookingReferenceField: true,
      phoneNumberRequired: true,
    },
  ],
]);
