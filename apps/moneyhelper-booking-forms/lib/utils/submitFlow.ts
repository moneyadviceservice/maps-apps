import { ResponseMessage } from '@maps-react/mhf/constants';
import { resolveNextSteps } from '@maps-react/mhf/form';
import { setStoreEntry } from '@maps-react/mhf/store';
import {
  runSubmissionStateMachine,
  SubmissionResult,
} from '@maps-react/mhf/submission';
import { type Language } from '@maps-react/utils/language';

import {
  ASYNC_ACTION_LOADING_STEP_MAP,
  ASYNC_ACTION_SUCCESS_STEP_MAP,
  AsyncAction,
  StepName,
} from '../constants';
import { BookingEntry } from '../types';
import { BookingSlotsPayload } from './../api/getBookingSlots';
import { buildBookingSlotsPayload } from './buildBookingSlotsPayload';
import { submitActionHandlerMap } from './submitHandlers';

/**
 * Determines the next step for the given async action and redirects accordingly.
 * @param entry
 * @param key
 * @param locale
 * @param action
 * @returns
 */
export async function advanceStepAndRedirect(
  entry: BookingEntry,
  key: string,
  locale: Language,
  action: AsyncAction,
): Promise<SubmissionResult> {
  const successStep = ASYNC_ACTION_SUCCESS_STEP_MAP[action];

  if (entry.steps[entry.stepIndex] !== successStep) {
    resolveNextSteps(entry, successStep);
    entry.stepIndex++;
    await setStoreEntry(key, entry);
  }

  return {
    redirect: {
      destination: `/${locale}/${successStep}`,
      permanent: false,
    },
  };
}

/**
 * Main function to handle the submit flow for async actions.
 * Supplies booking handlers and routing to the shared submission state machine.
 * Each action replaces the single latest-response slot in entry.meta.
 * @param entry
 * @param key
 * @param locale
 * @param action
 * @returns
 */
export async function runSubmitFlow({
  entry,
  key,
  locale,
  action,
}: {
  entry: BookingEntry;
  key: string;
  locale: Language;
  action: AsyncAction;
}): Promise<SubmissionResult> {
  let payload: BookingSlotsPayload;
  let submissionKey: string | AsyncAction = action;

  // Build payload per action
  switch (action) {
    case AsyncAction.BOOKING_AVAILABILITY:
      payload = buildBookingSlotsPayload(entry);
      submissionKey = `${action}-${crypto.randomUUID()}`;
      break;
  }

  return runSubmissionStateMachine({
    entry,
    key,
    locale,
    submissionKey,
    loadingDestination: `/${locale}/${ASYNC_ACTION_LOADING_STEP_MAP[action]}`,
    errorDestination: (status: string) =>
      `/${locale}/${StepName.ERROR}?status=${encodeURIComponent(status)}`,
    resolveErrorStatus: (error: unknown) =>
      error instanceof Error &&
      Object.values<string>(ResponseMessage).includes(error.message)
        ? error.message
        : ResponseMessage.GENERIC_ERROR,
    submit: (entry) => submitActionHandlerMap[action]({ entry, payload }),
    onSuccess: (entry, key, locale) =>
      advanceStepAndRedirect(entry, key, locale, action),
  });
}
