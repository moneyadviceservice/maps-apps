import { GetServerSidePropsContext } from 'next';

import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { StepName } from '../lib/constants';
import { BookingEntry } from '../lib/types';

/**
 * Clears editMode in store when the user lands on confirm-details.
 */
export async function clearEditModeGuard(
  context: GetServerSidePropsContext,
): Promise<void> {
  const currentStep = getCurrentStep(context);
  if (currentStep !== StepName.CONFIRM_DETAILS) {
    return;
  }

  const key = getSessionId(context);
  if (!key) {
    return;
  }

  const entry = (await getStoreEntry(key)) as BookingEntry;
  if (entry?.editMode !== true) {
    return;
  }

  const nextEntry: BookingEntry = {
    ...entry,
    editMode: false,
  };

  await setStoreEntry(key, nextEntry);
}
