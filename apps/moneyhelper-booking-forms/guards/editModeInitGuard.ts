import { GetServerSidePropsContext } from 'next';

import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import { getCurrentStep, getSessionId } from '@maps-react/mhf/utils';

import { StepName } from '../lib/constants';
import { BookingEntry } from '../lib/types';

const EDIT_MODE_ENTRY_STEPS = new Set<string>([
  StepName.APPOINTMENT_DATE_TIME,
  StepName.ACCESS_SUPPORT,
  StepName.ACCESS_OPTIONS,
  StepName.CONTACT_DETAILS,
  StepName.COMMUNICATION_PREFERENCES,
]);

/**
 * Sets editMode in store when user enters an allowlisted step with ?edit=true.
 */
export async function editModeInitGuard(
  context: GetServerSidePropsContext,
): Promise<void> {
  const edit = Array.isArray(context.query.edit)
    ? context.query.edit[0]
    : context.query.edit;

  if (edit !== 'true') {
    return;
  }

  const currentStep = getCurrentStep(context);
  if (!EDIT_MODE_ENTRY_STEPS.has(currentStep)) {
    return;
  }

  const key = getSessionId(context);
  if (!key) {
    return;
  }

  const entry = (await getStoreEntry(key)) as BookingEntry;
  if (!entry || entry.editMode === true) {
    return;
  }

  const nextEntry: BookingEntry = {
    ...entry,
    editMode: true,
  };

  await setStoreEntry(key, nextEntry);
}
