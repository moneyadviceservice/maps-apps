import { GetServerSidePropsContext } from 'next';

import { getStoreEntry } from '../store';
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
  const entry = await getStoreEntry(key);
  const currentStepIndex = entry?.stepIndex ?? 0;
  const backStep =
    currentStepIndex > 0 ? entry?.steps?.[currentStepIndex - 1] : null;

  return backStep ?? null;
}
