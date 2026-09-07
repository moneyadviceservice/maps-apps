import { Language } from '@maps-react/mhf/utils';

import {
  AppointmentAvailabilityResponse,
  GetBookingSlot,
  GetBookingSlotsResponse,
} from '../types';
import { fromDateKey } from './buildAppointmentCalendarState';

const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Europe/London',
});

const SLOT_SELECTION_DELIMITER = '::';

const toDateKeyFromIso = (isoDateTime: string) => isoDateTime.slice(0, 10);

const toTimeLabel = (isoDateTime: string) =>
  TIME_FORMATTER.format(new Date(isoDateTime));

export const encodeSlotSelection = (slotId: string, timeLabel: string) =>
  `${slotId}${SLOT_SELECTION_DELIMITER}${timeLabel}`;

export const decodeSlotSelection = (value?: string) => {
  if (!value) {
    return null;
  }

  const separatorIndex = value.indexOf(SLOT_SELECTION_DELIMITER);
  if (separatorIndex < 1) {
    return null;
  }

  const slotId = value.slice(0, separatorIndex);
  const timeLabel = value.slice(
    separatorIndex + SLOT_SELECTION_DELIMITER.length,
  );

  if (!slotId || !timeLabel) {
    return null;
  }

  return { slotId, timeLabel };
};

/**
 * Formats a YYYY-MM-DD appointment date for display in English or Welsh.
 * Falls back to the original value when parsing fails.
 */
export const transformDate = (
  appointmentDateString: string,
  locale: Language,
) => {
  const appointmentDateValue = fromDateKey(appointmentDateString);

  if (!appointmentDateValue) {
    return appointmentDateString;
  }

  return appointmentDateValue.toLocaleDateString(
    locale === 'cy' ? 'cy-GB' : 'en-GB',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  );
};

export function transformAppointmentData(
  response: GetBookingSlotsResponse,
): AppointmentAvailabilityResponse {
  if (!response.status) {
    throw new Error(String(response.message));
  }

  const dayMap = new Map<
    string,
    AppointmentAvailabilityResponse['days'][number]
  >();

  response.bookingSlots.forEach((bookingSlot: GetBookingSlot) => {
    // Check if there are any slotIds available for the bookingSlot, and if so, only get the first slotId, as we only need to store and send the first slotId. If there are no slotIds, skip this bookingSlot.
    const hasSlots = bookingSlot.slotIds.length > 0;
    const firstSlotId = hasSlots ? bookingSlot.slotIds[0].slotId : '';

    if (!hasSlots || !firstSlotId) {
      return;
    }

    const dateKey = toDateKeyFromIso(bookingSlot.startDateTime);
    const timeLabel = toTimeLabel(bookingSlot.startDateTime);

    let day = dayMap.get(dateKey);
    if (!day) {
      day = { date: dateKey, slots: [] };
      dayMap.set(dateKey, day);
    }

    day.slots.push({
      id: encodeSlotSelection(firstSlotId, timeLabel),
      time: timeLabel,
    });
  });

  const days = Array.from(dayMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return { days };
}
