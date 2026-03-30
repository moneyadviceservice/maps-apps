import { RouteFlow, RouteFlowValue } from '@maps-react/mhf/types';

import { FlowName, StepName } from '../lib/constants';

/**
 * Route flow configuration for multi-path user journeys.
 *
 * The form handler applies a "git rebase" style update at junction steps:
 * keep completed history, replace future steps, then splice in the chosen flow.
 *
 * Example:
 * A -> B -> C -> D  becomes  A -> B -> X -> Y
 * when user changes branch at B.
 *
 * Each flow entry defines ordered `steps` to append from that branch point.
 * @see ../README.md
 * @see ../../../libs/shared/mhf/README.md
 * @see form-handler.mts
 */
export const routeFlow: RouteFlow = new Map<string, RouteFlowValue>([
  // Journey: Start / Appointment Type
  [
    FlowName.BASE,
    {
      steps: [StepName.APPOINTMENT_TYPE],
    },
  ],
  // Journey: PW Appointment -> DC eligibility check
  [
    FlowName.PENSION_WISE,
    {
      steps: [
        StepName.PENSION_WISE_APPOINTMENT,
        StepName.ELIGIBILITY_DEFINED_CONTRIBUTION,
      ],
    },
  ],
  // Journey: SE Appointment -> Booking section
  [
    FlowName.SELF_EMPLOYED,
    {
      steps: [
        StepName.SELF_EMPLOYED_APPOINTMENT,
        StepName.ELIGIBILITY_BUSINESS_STATE,
        StepName.SELF_EMPLOYED_PRE_APPOINTMENT,
      ],
    },
  ],
  // Journey: Divorce Appointment -> Divorce eligibility section
  [
    FlowName.DIVORCE_SEPARATION,
    {
      steps: [
        StepName.DIVORCE_APPOINTMENT,
        StepName.ELIGIBILITY_FINANCIAL_SETTLEMENT,
      ],
    },
  ],
  // Journey: PL Appointment -> PL eligibility section
  [
    FlowName.PENSION_LOSS,
    {
      steps: [
        StepName.PENSION_LOSS_APPOINTMENT,
        StepName.ELIGIBILITY_PENSION_LOSS,
      ],
    },
  ],
  // Journey: DC pass -> Over 50 check
  [
    FlowName.ELIGIBILITY_DC_PASS,
    {
      steps: [StepName.ELIGIBILITY_OVER_50],
    },
  ],
  // Journey: Over 50 pass -> UK pensions check
  [
    FlowName.ELIGIBILITY_OVER_50_PASS,
    {
      steps: [StepName.ELIGIBILITY_UK_PENSIONS],
    },
  ],
  // Journey: Over 50 fail -> Age exceptions check
  [
    FlowName.ELIGIBILITY_OVER_50_FAIL,
    {
      steps: [StepName.ELIGIBILITY_AGE_EXCEPTIONS],
    },
  ],
  // Journey: Age exceptions pass -> UK pensions check
  [
    FlowName.ELIGIBILITY_AGE_EXC_PASS,
    {
      steps: [StepName.ELIGIBILITY_UK_PENSIONS],
    },
  ],
  // Journey: PW eligibility fail -> Terminal (not eligible)
  [
    FlowName.ELIGIBILITY_PW_FAIL,
    {
      steps: [StepName.PENSION_WISE_NOT_ELIGIBLE],
    },
  ],
  // Journey: FS pass -> Booking section
  [
    FlowName.ELIGIBILITY_FS_PASS,
    {
      steps: [StepName.DIVORCE_PRE_APPOINTMENT],
    },
  ],
  // Journey: FS fail -> Terminal (not eligible)
  [
    FlowName.ELIGIBILITY_FS_FAIL,
    {
      steps: [StepName.DIVORCE_NOT_ELIGIBLE],
    },
  ],
  // Journey: PL eligibility pass -> Booking section
  [
    FlowName.ELIGIBILITY_PL_PASS,
    {
      steps: [StepName.PENSION_LOSS_PRE_APPOINTMENT],
    },
  ],
  // Journey: PL eligibility fail -> Terminal (not eligible)
  [
    FlowName.ELIGIBILITY_PL_FAIL,
    {
      steps: [StepName.PENSION_LOSS_NOT_ELIGIBLE],
    },
  ],
]);
