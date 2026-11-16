import { AppointmentPayload } from '../api';
import { BookingEntry } from '../types';

/**
 * Builds the payload for fetching an appointment based on the booking entry.
 * @param entry
 * @returns
 */
export const buildGetAppointmentPayload = (
  entry: BookingEntry,
): AppointmentPayload => {
  if (!entry) {
    throw new Error('Booking entry is required');
  }

  const { day, month, year, appointmentId } = entry.data ?? {};

  if (
    typeof day !== 'string' ||
    typeof month !== 'string' ||
    typeof year !== 'string'
  ) {
    throw new TypeError('Date of birth is required to look up an appointment');
  }

  return {
    appointmentId: String(appointmentId),
    dob: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
  };
};
