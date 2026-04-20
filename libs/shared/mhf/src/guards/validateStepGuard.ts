/*eslint-disable no-console */
import { GetServerSidePropsContext } from 'next';

import { getStoreEntry, setStoreEntry } from '../store';
import { getCurrentStep, getSessionId } from '../utils';

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
  const { steps } = entry;

  // if this is undefined we skip the step validation
  if (!steps) {
    return;
  }

  // if there is no flow and stepIndex is not 0, this is an invalid state, as the user should have a flow assigned before progressing past the first step. We throw an error to prevent further execution and highlight the issue in monitoring.
  if (!entry.data.flow && entry.stepIndex > 0) {
    throw new TypeError(
      `[validateStepGuard] Missing flow in entry data at stepIndex ${entry.stepIndex}`,
    );
  }

  const currentStep = getCurrentStep(context);

  const currentStepIndex = steps.indexOf(currentStep);
  if (steps.length > 0 && currentStepIndex === -1) {
    throw new TypeError(`[validateStepGuard] Invalid step: ${currentStep}`);
  }
  // Redirect back to the user's current step if they try to skip forward
  if (currentStepIndex > entry.stepIndex) {
    console.warn(
      `[validateStepGuard] User tried to skip forward from step ${entry.stepIndex} to step ${currentStepIndex}. Redirecting back to step ${entry.stepIndex}.`,
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
