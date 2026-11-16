import { ResponseMessage } from '@maps-react/mhf/constants';
import { resolveNextSteps } from '@maps-react/mhf/form';
import { setStoreEntry } from '@maps-react/mhf/store';
import {
  runSubmissionStateMachine,
  SubmissionResult,
} from '@maps-react/mhf/submission';
import { type Language } from '@maps-react/utils/language';

import { Appointment, AppointmentPayload } from '../api';
import {
  ASYNC_ACTION_LOADING_STEP_MAP,
  ASYNC_ACTION_SUCCESS_STEP_MAP,
  AsyncAction,
  StepName,
} from '../constants';
import { BookingEntry } from '../types';
import { BookingSlotsPayload } from './../api/getBookingSlots';
import { buildBookingSlotsPayload } from './buildBookingSlotsPayload';
import { buildGetAppointmentPayload } from './buildGetAppointmentPayload';
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

  // If the action is an appointment lookup and an appointment is found in the response data, merge the appointment details into the entry data so we have them available for subsequent steps.
  if (action === AsyncAction.APPOINTMENT_LOOKUP) {
    const appointment: Appointment | undefined =
      entry.meta?.responseData?.appointment;

    if (appointment) {
      entry.data = mergeAppointmentIntoEntryData(entry, appointment);
    }
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
 * Merges the appointment details into the entry data.
 * @param entry
 * @param appointment
 * @returns
 */
export const mergeAppointmentIntoEntryData = (
  entry: BookingEntry,
  appointment: Appointment,
): BookingEntry['data'] => ({
  ...entry.data,
  ...appointment,
  isDoubleSlot: String(appointment.isDoubleSlot),
  isBslRequired: String(appointment.isBslRequired),
  isInterpreterRequired: String(appointment.isInterpreterRequired),
  flow: appointment.appointmentType,
});

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
  let payload: BookingSlotsPayload | AppointmentPayload;
  let submissionKey: string | AsyncAction = action;

  // Build payload per action
  switch (action) {
    case AsyncAction.BOOKING_AVAILABILITY:
      payload = buildBookingSlotsPayload(entry);
      submissionKey = `${action}-${crypto.randomUUID()}`;
      break;
    case AsyncAction.APPOINTMENT_LOOKUP:
      payload = buildGetAppointmentPayload(entry);
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
