import { FlowName, StepName } from '../lib/constants';
import { BookingFlowConfigMap } from '../lib/types';

/**
 * Central configuration for flows in the app. Each flow can have custom properties that influence app behavior.
 * - autoAdvanceStep is a look up key used by autoAdvanceGuard
 *
 * @see flowConfig
 */
export const flowConfig: BookingFlowConfigMap = new Map([
  [FlowName.PENSION_WISE, {}],
  [FlowName.SELF_EMPLOYED, {}],
  [FlowName.DIVORCE_SEPARATION, {}],
  [FlowName.PENSION_LOSS, {}],
  [
    FlowName.PENSION_SAFE_GUARDING,
    { autoAdvanceStep: StepName.PENSION_SAFEGUARDING_APPOINTMENT },
  ],
]);
