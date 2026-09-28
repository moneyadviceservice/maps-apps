import type { AppointmentAvailabilityResponse, LocaleCode } from '../types';

/**
 * Converts a Date object to a string key in the format 'YYYY-MM-DD'.
 * @param date - The Date object to convert.
 * @returns A string representing the date in 'YYYY-MM-DD' format.
 */
export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Converts a 'YYYY-MM-DD' date key to a local Date object.
 * @param dateKey - The date key to convert.
 * @returns A Date object, or undefined if the value is invalid.
 */
export const fromDateKey = (dateKey?: string): Date | undefined => {
  if (!dateKey) return undefined;

  const [yearText, monthText, dayText] = dateKey.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
};

type BuildAppointmentCalendarStateArgs = {
  availabilityData: AppointmentAvailabilityResponse;
  localeCode: LocaleCode;
  selected: Date | undefined;
};

/**
 * Builds the derived appointment calendar state needed by the component.
 * @param availabilityData - The appointment availability data fetched from the API.
 * @param localeCode - The locale code for formatting dates.
 * @param selected - The currently selected date.
 * @returns The derived appointment calendar state.
 */
export const buildAppointmentCalendarState = ({
  availabilityData,
  localeCode,
  selected,
}: BuildAppointmentCalendarStateArgs) => {
  const slotsByDate = new Map(
    availabilityData.days.map((day) => [day.date, day.slots]),
  );
  const availableDateKeys = new Set(slotsByDate.keys());
  const firstAvailableDate = fromDateKey(availabilityData.days[0]?.date);
  const selectedDateKey = selected ? toDateKey(selected) : '';
  const selectedDateLabel = selected
    ? selected.toLocaleDateString(localeCode, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';
  const selectedSlots = selected ? slotsByDate.get(selectedDateKey) ?? [] : [];
  const timeOptions = selectedSlots.map((slot) => ({
    text: slot.time,
    value: slot.id,
  }));

  return {
    availableDateKeys,
    firstAvailableDate,
    selectedDateKey,
    selectedDateLabel,
    selectedSlots,
    slotsByDate,
    timeOptions,
  };
};
