import { FlowName, StepName } from '../lib/constants';
import { ContactRouteFlow } from '../lib/types';

/**
 * Route flow configuration for multi-path user journeys.
 *
 * Flows are spliced into the steps array using a git rebase pattern in the form-handler. (see form-handler.mts for details)
 *
 * Two types of flows:
 * 1. Junction flows (ENQUIRY_TYPE, INSURANCE_TYPE, etc.) - present a choice, lead to another flow
 * 2. Terminal flows (CONFIRMATION, ABOUT_INSURANCE, etc.) - the final path after all choices are made
 *
 * Each flow consists of:
 * - `steps`: Ordered array of step names
 * - `autoAdvanceStep`: (optional) Enter into this flow automatically (e.g., via ?aa=mhpd)
 * - `showBookingReferenceField`: (optional) Conditionally displays the booking reference field on enquiry step
 * - `phoneNumberRequired`: (optional) Enforces phone number validation on the enquiry step
 * @see routeFlow usage in form-handler.mts
 */
export const routeFlow: ContactRouteFlow = new Map([
  [
    FlowName.BASE,
    {
      steps: [StepName.ENQUIRY_TYPE],
    },
  ],
  [
    FlowName.MONEY_MANAGEMENT,
    {
      steps: [
        StepName.ABOUT_MONEY_MANAGEMENT,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
    },
  ],
  [
    FlowName.SCAMS,
    {
      steps: [
        StepName.ABOUT_SCAMS,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
    },
  ],
  [
    FlowName.DEBT_ADVICE,
    {
      steps: [
        StepName.ABOUT_DEBT,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
    },
  ],
  [
    FlowName.INSURANCE,
    {
      steps: [StepName.INSURANCE_TYPE],
    },
  ],
  [
    FlowName.INSURANCE_OTHER,
    {
      steps: [
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
    },
  ],
  [
    FlowName.INSURANCE_TRAVEL,
    {
      steps: [StepName.ABOUT_INSURANCE],
    },
  ],
  [
    FlowName.PENSIONS_AND_RETIREMENT,
    {
      steps: [StepName.PENSION_TYPE],
    },
  ],
  [
    FlowName.PENSIONS_TRACING,
    {
      steps: [
        StepName.ABOUT_PENSION_TRACING,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
    },
  ],
  [
    FlowName.MHPD,
    {
      steps: [
        StepName.ABOUT_MHPD,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
      autoAdvanceStep: StepName.ABOUT_MHPD,
    },
  ],
  [
    FlowName.PENSIONS_APPOINTMENTS,
    {
      steps: [StepName.APPOINTMENT_TYPE],
    },
  ],
  [
    FlowName.APPOINTMENT_PENSION_WISE,
    {
      steps: [
        StepName.ABOUT_PENSION_WISE,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
      showBookingReferenceField: true,
      phoneNumberRequired: true,
    },
  ],
  [
    FlowName.APPOINTMENT_DIVORCE,
    {
      steps: [
        StepName.ABOUT_PENSION_DIVORCE,
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
      showBookingReferenceField: true,
      phoneNumberRequired: true,
    },
  ],
  [
    FlowName.PENSIONS_GUIDANCE,
    {
      steps: [
        StepName.NAME,
        StepName.DATE_OF_BIRTH,
        StepName.CONTACT_DETAILS,
        StepName.ENQUIRY,
        StepName.LOADING,
        StepName.CONFIRMATION,
      ],
    },
  ],
]);
