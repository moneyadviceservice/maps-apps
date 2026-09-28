import { BusinessClosureStatus } from 'lib/getBusinessClosureStatus/getBusinessClosureStatus';

export const isInOfficeHours = (
  businessClosureStatus?: BusinessClosureStatus,
): boolean => {
  if (businessClosureStatus?.closed) {
    return false;
  }

  const timeZone = 'Europe/London';
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);

  const dayPart = parts.find((p) => p.type === 'weekday');
  const hourPart = parts.find((p) => p.type === 'hour');
  const minutePart = parts.find((p) => p.type === 'minute');

  if (!dayPart || !hourPart || !minutePart) {
    throw new Error(
      'Could not format the current time correctly. Required parts are missing.',
    );
  }

  const day = dayPart.value;
  const hour = parseInt(hourPart.value, 10);
  const minute = parseInt(minutePart.value, 10);

  if (day === 'Saturday' || day === 'Sunday') {
    return false;
  }

  const nowInMinutes = hour * 60 + minute;
  const startInMinutes = 9 * 60; // 9:00 AM
  const endInMinutes = 15 * 60 + 30; // 3:30 PM (15:30)

  return nowInMinutes >= startInMinutes && nowInMinutes <= endInMinutes;
};
