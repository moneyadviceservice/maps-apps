import { type Language } from '@maps-react/utils/language';

import { fromDateKey } from '../../components/AppointmentDateTime/utils/buildAppointmentCalendarState';

// Initialise the time formatter for converting ISO date-time strings to 'HH:mm' format.
const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Europe/London',
});

/**
 * Converts an ISO date-time string to a formatted time label in 'HH:mm' format.
 * @param isoDateTime - The ISO date-time string to convert.
 * @returns A formatted time label in 'HH:mm' format.
 */
export const toTimeLabel = (isoDateTime?: string): string => {
  if (!isoDateTime) {
    return '';
  }

  const date = new Date(isoDateTime);
  return Number.isNaN(date.getTime()) ? '' : TIME_FORMATTER.format(date);
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
