/**
 * Utility functions for date formatting in Playwright tests
 */

/**
 * Formats a date string to a specified format
 * @param dateString - The date string to format (can be ISO string, date object, or date string)
 * @param format - The desired output format (e.g., 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY')
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, format: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString());
}

/**
 * Converts a date to a human-readable format (e.g., "1st January 2024")
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDateToReadable(dateString: string | Date): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${getOrdinalSuffix(day)} ${month} ${year}`;
}

/**
 * Converts a date to ISO format (YYYY-MM-DD)
 * @param dateString - The date string to format
 * @returns ISO formatted date string
 */
export function formatDateToISO(dateString: string | Date): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  return date.toISOString().split('T')[0];
}

/**
 * Converts a date to UK format (DD/MM/YYYY)
 * @param dateString - The date string to format
 * @returns UK formatted date string
 */
export function formatDateToUK(dateString: string | Date): string {
  return formatDate(dateString, 'DD/MM/YYYY');
}

/**
 * Converts a date to US format (MM/DD/YYYY)
 * @param dateString - The date string to format
 * @returns US formatted date string
 */
export function formatDateToUS(dateString: string | Date): string {
  return formatDate(dateString, 'MM/DD/YYYY');
}
