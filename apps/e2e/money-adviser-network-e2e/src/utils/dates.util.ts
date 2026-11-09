import { IBookingSlot } from '@data/mock-data';

/**
 * Checks if the current system clock is within office hours.
 * This introduces risk that the application has different outcomes depending
 * on external variables.
 *
 * My suggestion would be
 * - Set the system clock in the pipeline to inside office hours.
 */
export function isInOfficeHours() {
  const now = new Date();

  const day = now.getDay();
  if (day === 0 || day === 6) {
    return false;
  }

  const start = new Date(now);
  start.setHours(9, 0, 0, 0);

  const end = new Date(now);
  end.setHours(15, 30, 0, 0);

  return now >= start && now <= end;
}

export function formatSlot<T extends IBookingSlot>(bookingSlots: T) {
  // Ignoring this rule as the data needs to be this way as its a payload.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { SlotName, ReaminingCapacity, SlotType } = bookingSlots;

  const dateMatch = /(\d{2}-\d{2}-\d{4})/.exec(SlotName);

  const date = dateMatch
    ? new Date(dateMatch[1].split('-').reverse().join('-'))
    : null;

  if (!date) {
    throw new Error(
      'Something went wrong trying to turn mock data into a label string.',
    );
  }

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);

  const time = SlotType === 'AM' ? '9am to 12pm' : '1pm to 4pm';

  return `${formattedDate} - ${time}${
    ReaminingCapacity === '0' ? ' - No slots available' : ''
  }` as const;
}
