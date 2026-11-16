import { getDate, getMonth, getYear, set } from 'date-fns';

/**
 * Calculates the financial year range (min and max years) for a given date.
 *
 * @param date - The date for which the financial year is to be determined.
 * @param ignoreDay - Optional flag to ignore the day of the month when calculating the financial year.
 *                    If true, the date is adjusted to the 6th day of the month before calculation.
 *                    Defaults to `false`.
 * @returns An object containing the `min` and `max` years of the financial year.
 *          - `min`: The starting year of the financial year.
 *          - `max`: The ending year of the financial year.
 */
const getFinancialYear = (date: Date, ignoreDay = false) => {
  const compareDate = ignoreDay ? set(new Date(date), { date: 6 }) : date;

  const year = getYear(compareDate);
  const month = getMonth(compareDate); // 0-indexed, so 3 = April
  const day = getDate(compareDate);

  const baseYear = month < 3 || (month === 3 && day < 6) ? year - 1 : year;

  return { min: baseYear, max: baseYear + 1 };
};

/**
 * Determines if a given date falls in the next financial year relative to the current date.
 *
 * @param date - The date to evaluate.
 * @param ignoreDay - Optional. If `true`, the day of the month is ignored when determining the financial year. Defaults to `true`.
 * @returns A number indicating the relationship between the financial years:
 *          - `1` if the given date is in the next financial year.
 *          - `0` if the given date is in the current financial year.
 *          - `-1` if the given date is in a previous financial year.
 */
export const isNextFinancialYear = (date: Date, ignoreDay = true): number => {
  const currentFY = getFinancialYear(new Date());
  const dateFY = getFinancialYear(date, ignoreDay);

  return Math.sign(dateFY.min - currentFY.min);
};
