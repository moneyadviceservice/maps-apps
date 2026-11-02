import { ResponseData } from '@maps-react/mhf/types';

import {
  BookingSlotsPayload,
  getBookingLookup,
  getBookingSlots,
  getCreateBooking,
} from '../api';
import { AsyncAction } from '../constants';
import { BookingEntry } from '../types';

export type SubmitActionHandler = ({
  entry,
  payload,
}: {
  entry: BookingEntry;
  payload: BookingSlotsPayload;
}) => Promise<ResponseData>;

const runBookingCreate: SubmitActionHandler = async () => {
  const { status, message } = await getCreateBooking();

  // Mock response for initial integration while BOOKING_CREATE API wiring is in progress.
  return {
    status,
    message,
  };
};

const runGetBookingSlots: SubmitActionHandler = async ({ entry, payload }) => {
  if (!entry) {
    throw new Error('Booking entry is required');
  }

  if (!payload) {
    throw new Error('Booking slots payload is required');
  }

  const url = process.env.BOOKING_SLOTS_URL;
  const code = process.env.BOOKING_SLOTS_CODE;

  if (!code || !url) {
    throw new Error(
      'API code or URL for booking slots is not set in environment variables',
    );
  }

  const { bookingSlots } = await getBookingSlots(url, code, payload);

  return { bookingSlots };
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
 * are delegated by `runSubmitFlow` to the shared submission state machine.
 */
export const submitActionHandlerMap: Record<AsyncAction, SubmitActionHandler> =
  {
    [AsyncAction.BOOKING_AVAILABILITY]: runGetBookingSlots,
    [AsyncAction.BOOKING_CREATE]: runBookingCreate,
    [AsyncAction.BOOKING_LOOKUP]: runBookingLookup,
  };
