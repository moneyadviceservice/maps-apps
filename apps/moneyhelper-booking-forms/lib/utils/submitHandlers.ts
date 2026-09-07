import { Language } from '@maps-react/mhf/utils';

import { getBookingLookup, getCreateBooking } from '../api';
import { AsyncAction, ResponseMessage } from '../constants';
import { ResponseData, SubmissionEntry } from '../types';

export type SubmitActionHandler = ({
  entry,
  locale,
}: {
  entry: SubmissionEntry;
  locale: Language;
}) => Promise<ResponseData>;

const runBookingCreate: SubmitActionHandler = async () => {
  const { status, message } = await getCreateBooking();

  // Mock response for initial integration while BOOKING_CREATE API wiring is in progress.
  return {
    status,
    message,
  };
};

const runBookingAvailability: SubmitActionHandler = async () => {
  throw new Error(ResponseMessage.FORM_HANDLER_ERROR);
};

const runBookingLookup: SubmitActionHandler = async ({ entry }) => {
  const { data, status, message } = await getBookingLookup();

  // Add Mock access support details to the entry data for use in subsequent steps.
  entry.data = {
    ...entry.data,
    ...data,
  };

  return {
    status,
    message,
  };
};

/**
 * Maps each async action to its API handler.
 *
 * Handlers should return only the normalized API response payload; orchestration
 * concerns (submission state transitions, stale detection, redirecting, and meta writes)
 * are handled by `runSubmissionStateMachine`.
 */
export const submitActionHandlerMap: Record<AsyncAction, SubmitActionHandler> =
  {
    [AsyncAction.BOOKING_AVAILABILITY]: runBookingAvailability,
    [AsyncAction.BOOKING_CREATE]: runBookingCreate,
    [AsyncAction.BOOKING_LOOKUP]: runBookingLookup,
  };
