import type { BookingSlots } from '../../lib/api';

export type AppointmentDay = {
  date: string;
  slots: BookingSlots[number][];
};

export type AppointmentAvailability = {
  days: AppointmentDay[];
};

export type TranslationFn = (
  value: { en: string; cy: string },
  params?: Record<string, string>,
) => string;

export type LocaleCode = 'cy-GB' | 'en-GB';

type CalendarLegendKey = 'unavailable' | 'available' | 'selected';

export type CalendarLegendItem = {
  key: CalendarLegendKey;
  label: string;
};
