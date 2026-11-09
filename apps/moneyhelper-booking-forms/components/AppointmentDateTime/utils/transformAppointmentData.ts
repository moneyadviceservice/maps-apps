import { type Language } from '@maps-react/utils/language';

import { BookingSlots } from '../../../lib/api';
import type { AppointmentAvailability, AppointmentDay } from '../types';
import { fromDateKey } from './buildAppointmentCalendarState';

const toDateKeyFromIso = (isoDateTime: string) => isoDateTime.slice(0, 10);

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

/**
 * Transforms raw booking slot data into a structured appointment availability format, grouping slots by day.
 * @param data
 * @returns
 */
export function transformAppointmentData(
  data: BookingSlots,
): AppointmentAvailability {
  const dayMap = new Map<string, AppointmentDay>();

  // Group slots by day, preserving all slot IDs for each available time.
  data.forEach((bookingSlot) => {
    const dateKey = toDateKeyFromIso(bookingSlot.startDateTime);
    const day = dayMap.get(dateKey) ?? { date: dateKey, slots: [] };

    day.slots.push(bookingSlot);
    dayMap.set(dateKey, day);
  });

  // Sort days by date in ascending order.
  const days = Array.from(dayMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return { days };
}

/**
 * Parses the selected appointment value stored by the form and returns its
 * date, start date-time, and slot IDs.
 * @param value - The JSON-encoded selection value containing the date, start date-time, and slot IDs.
 * @returns An object with the parsed date, startDateTime, and slotIds.
 */
export const getAppointmentSelectionValues = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }
  return JSON.parse(value) as {
    date: string;
    startDateTime: string;
    slotIds: BookingSlots[number]['slotIds'];
  };
};
