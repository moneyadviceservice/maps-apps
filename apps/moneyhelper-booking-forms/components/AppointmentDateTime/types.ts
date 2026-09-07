type AppointmentSlot = {
  id: string;
  time: string;
};

type AppointmentDay = {
  date: string;
  slots: AppointmentSlot[];
};

export type AppointmentAvailabilityResponse = {
  days: AppointmentDay[];
};

export type GetBookingSlotId = {
  slotId: string;
  secondSlotId?: string;
};

export type GetBookingSlot = {
  startDateTime: string;
  slotIds: GetBookingSlotId[];
};

export type GetBookingSlotsResponse = {
  status: boolean;
  message: number;
  bookingSlots: GetBookingSlot[];
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
