/**
 * Constructs a purchase date string from individual day, month, and year components.
 * The DateInput component expects a date in the format "day-month-year".
 *
 * @param day - The day value (optional)
 * @param month - The month value (optional)
 * @param year - The year value (optional)
 * @returns A formatted date string or empty string if no values provided
 */
export const constructPurchaseDate = (
  day?: string | null,
  month?: string | null,
  year?: string | null,
): string => {
  // If all components are provided, return formatted date
  if (day && month && year) {
    return `${day}-${month}-${year}`;
  }

  // If any component is provided, return partial date
  if (day || month || year) {
    return `${day || ''}-${month || ''}-${year || ''}`;
  }

  // Return empty string if no components provided
  return '';
};
