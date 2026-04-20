import { FlowName, PRE_APPOINTMENT_STEP_BY_FLOW, StepName } from '../constants';
import { BookingEntry } from '../types';

/**
 * Returns the pre-appointment step for a validated flow.
 * Throws when flow is missing or when there is no mapped pre-appointment step.
 * @param entry
 * @returns
 */
export const getPreAppointmentStep = (
  entry: BookingEntry | undefined,
): StepName => {
  const flow = entry?.data?.flow as FlowName;

  if (!flow) {
    throw new Error('[getPreAppointmentStep] Flow missing from entry data.');
  }

  const nextStep = PRE_APPOINTMENT_STEP_BY_FLOW[flow];

  if (!nextStep) {
    throw new Error(
      `[getPreAppointmentStep] No pre-appointment step mapping found for flow: ${flow}`,
    );
  }

  return nextStep;
};
