import { RouteFlow, RouteFlowValue } from '@maps-react/mhf/types';

import { FlowName, StepName } from '../lib/constants';

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
 * @see routeFlow usage in form-handler.mts
 */
export const routeFlow: RouteFlow = new Map<string, RouteFlowValue>([
  [
    FlowName.BASE,
    {
      steps: [StepName.APPOINTMENT_TYPE],
    },
  ],
  [
    FlowName.PENSION_WISE,
    {
      steps: [
        StepName.PENSION_WISE_APPOINTMENT,
        StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
      ],
      // CONTINUES TO ACCESS NEEDS SECTION
    },
  ],
  [
    FlowName.ELIGIBILITY_DC_PASS,
    {
      steps: [StepName.ELIGIBILITY_OVER_50],
    },
  ],
  [
    FlowName.ELIGIBILITY_OVER_50_PASS,
    {
      steps: [StepName.ELIGIBILITY_UK_PENSIONS],
    },
  ],
  [
    FlowName.ELIGIBILITY_OVER_50_FAIL,
    {
      steps: [StepName.ELIGIBILITY_AGE_EXCEPTIONS],
    },
  ],
  [
    FlowName.ELIGIBILITY_AGE_EXC_PASS,
    {
      steps: [StepName.ELIGIBILITY_UK_PENSIONS],
    },
  ],
  [
    FlowName.ELIGIBILITY_PENSION_WISE_FAIL,
    {
      steps: [StepName.PENSION_WISE_NOT_ELIGIBLE],
    },
  ],
]);
