export type DateFormat = 'short' | 'long';

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(
  value: string | null | undefined,
  options?: { format?: DateFormat; fallback?: string },
): string {
  const { format = 'short', fallback = '—' } = options ?? {};

  if (!value) return fallback;

  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return fallback;

    const months = format === 'long' ? LONG_MONTHS : SHORT_MONTHS;
    const month = months[d.getUTCMonth()];
    const day = d.getUTCDate();
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');

    if (format === 'long') {
      return `${month} ${day}, ${d.getUTCFullYear()} ${hours}:${minutes}`;
    }

    return `${day} ${month} ${hours}:${minutes}`;
  } catch {
    return fallback;
  }
}
