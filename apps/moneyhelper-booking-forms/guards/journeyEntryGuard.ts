import { GetServerSidePropsContext } from 'next';

import { getStoreEntry, setStoreEntry } from '@maps-react/mhf/store';
import {
  getCurrentStep,
  getLanguage,
  getSessionId,
} from '@maps-react/mhf/utils';

import {
  INITIAL_STEP_JOURNEY_TYPE_MAP,
  JOURNEY_TYPE_INITIAL_STEP_MAP,
} from '../lib/constants';
import { BookingEntry } from '../lib/types';

/**
 * Guard that resets an existing entry when the user enters a different journey while already having an entry in store.
 * Exits early if:
 * - The current step does not have a journey type mapping
 * - There is no session ID
 * - There is no existing entry in store
 * - The existing entry is already in the requested journey
 *
 * If the guard does not exit early, it will reset the existing entry to the initial state of the requested journey based on the current step.
 * @param context
 * @returns
 */
export async function journeyEntryGuard(
  context: GetServerSidePropsContext,
): Promise<void> {
  const currentStep = getCurrentStep(context);
  const requestedJourneyType = INITIAL_STEP_JOURNEY_TYPE_MAP[currentStep];

  if (!requestedJourneyType) {
    return; // Exit
  }

  const key = getSessionId(context);
  if (!key) {
    return; // Exit
  }

  const entry = (await getStoreEntry(key)) as BookingEntry | undefined;
  if (!entry) {
    return; // Exit
  }

  const existingJourneyType = entry.data.journeyType;
  if (existingJourneyType === requestedJourneyType) {
    return; // Exit
  }

  const locale = getLanguage(context.params?.language);
  await setStoreEntry(key, {
    data: {
      flow: '',
      locale,
      journeyType: requestedJourneyType,
    },
    steps: [JOURNEY_TYPE_INITIAL_STEP_MAP[requestedJourneyType]],
    stepIndex: 0,
    errors: {},
  });
}
