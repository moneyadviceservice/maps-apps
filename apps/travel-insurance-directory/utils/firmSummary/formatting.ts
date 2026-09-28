export const formatCurrency = (amount: number | null): string => {
  if (amount === null) return '';
  return `£${amount.toLocaleString()}`;
};

/** Format 24h time (e.g. "09:00:00") as "9am" or "5pm" */
export const formatTimeAmPm = (time: string | null): string => {
  if (!time) return '';
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number.parseInt(hoursStr, 10);
  const minutes = minutesStr ? Number.parseInt(minutesStr, 10) : 0;
  if (hours === 12 && minutes === 0) return '12pm';
  if (hours === 0 && minutes === 0) return '12am';
  const suffix = hours >= 12 ? 'pm' : 'am';
  let displayHour: number;
  if (hours > 12) {
    displayHour = hours - 12;
  } else if (hours === 0) {
    displayHour = 12;
  } else {
    displayHour = hours;
  }
  return minutes > 0
    ? `${displayHour}:${minutesStr}${suffix}`
    : `${displayHour}${suffix}`;
};
