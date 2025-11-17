/*eslint-disable no-console */
import { GetServerSidePropsContext } from 'next';

import { getCurrentStep, getFlowSteps, getSessionId } from '../lib/utils';
import { getStoreEntry, setStoreEntry } from '../store';

/**
 * Performs validation on the current step in the flow by getting the current step from the url and checking this with the stepIndex in the store.
 * It prevents the user from skipping forward in the flow.
 * It also updates the stepIndex in the store and clears errors when the step changes. (When the user goes back to a previous step)
 * @param context
 * @returns {Promise<void>}
 * @throws {Error} If the step is invalid
 */
export async function validateStepGuard(
  context: GetServerSidePropsContext,
): Promise<void> {
  const key = getSessionId(context);
  const entry = await getStoreEntry(key);
  const steps: string[] = getFlowSteps(entry);
  const currentStep = getCurrentStep(context);

  const currentStepIndex = steps.indexOf(currentStep);
  if (steps.length > 0 && currentStepIndex === -1) {
    throw new Error(`[getSessionId] Invalid step: ${currentStep}`);
  }
  // Redirect back to the user's current step if they try to skip forward
  if (currentStepIndex > entry.stepIndex) {
    console.warn(
      `[getSessionId] User tried to skip forward from step ${entry.stepIndex} to step ${currentStepIndex}. Redirecting back to step ${entry.stepIndex}.`,
    );
    const lang = entry.data.lang;
    const destination = `/${lang}/${steps[entry.stepIndex]}`;
    context.res.writeHead(303, { Location: destination });
    context.res.end();
    return;
  }
  // Update the stepIndex and clear errors if the step does not match the currentStepIndex
  if (entry.stepIndex !== currentStepIndex && key) {
    entry.stepIndex = currentStepIndex;
    entry.errors = {};
    await setStoreEntry(key, entry);
  }
}
