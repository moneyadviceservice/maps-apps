import { GetServerSidePropsContext } from 'next';

import { getCurrentStep, getFlowSteps } from '.';
import { getStoreEntry } from '../../store';
import { getSessionId } from './getSessionId';

/**
 * Calculates the previous step in the current flow from the current store entry.
 * @param context
 * @returns {string | null} - The name of the previous step or null if the current step is the first step.
 */
export async function getBackStep(
  context: GetServerSidePropsContext,
): Promise<string | null> {
  const key = getSessionId(context);
  const { entry } = await getStoreEntry(key);
  const currentStep = getCurrentStep(context);
  const steps: string[] = getFlowSteps(entry);
  const currentStepIndex = steps.indexOf(currentStep);

  // If it's the first step, return null (gracefully handle this case)
  if (currentStepIndex <= 0) {
    return null;
  }

  // Return the previous step
  return steps[currentStepIndex - 1];
}
