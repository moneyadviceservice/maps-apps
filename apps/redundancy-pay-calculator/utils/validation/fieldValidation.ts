/**
 * Validates a given day string to ensure it represents a valid day of the month.
 *
 * @param day - The day as a string to validate.
 * @returns `true` if the day is invalid (not a number, less than 1, or greater than 31),
 *          otherwise `false`.
 */
export const validateDay = (day: string) => {
  const parsedDay = Number(day);
  return isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31;
};

/**
 * Validates whether the given month string represents a valid month.
 *
 * @param month - The month as a string to validate.
 * @returns `true` if the month is invalid (not a number, less than 1, or greater than 12),
 *          otherwise `false`.
 */
export const validateMonth = (month: string) => {
  const parsedMonth = Number(month);
  return isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12;
};

/**
 * Validates whether a given string represents a valid year in the format of four digits.
 *
 * @param year - The string to validate as a year.
 * @returns `true` if the string does not match the format of a four-digit year, otherwise `false`.
 */
export const validateYear = (year: string) => !/^\d{4}$/.test(year);

/**
 * Validates a date string based on the question number and returns an object
 * indicating whether there are errors in the day, month, or year components.
 *
 * @param date - The date string to validate, expected in the format "DD-MM-YYYY" or "MM-YYYY".
 * @param questionNbr - The question number that determines the validation logic:
 *   - `2`: Validates day, month, and year.
 *   - `3` or `4`: Validates only month and year.
 * @returns An object with boolean flags indicating validation errors:
 *   - `dayError`: `true` if the day is invalid, `false` otherwise.
 *   - `monthError`: `true` if the month is invalid, `false` otherwise.
 *   - `yearError`: `true` if the year is invalid, `false` otherwise.
 */
export const validateDate = (date: string, questionNbr: number) => {
  let dayError = false;
  let monthError = false;
  let yearError = false;

  if (!date || date.trim() === '') {
    return { dayError, monthError, yearError };
  }

  const dateParts = date.split('-');

  if (questionNbr === 2) {
    const [day, month, year] = dateParts.map((part) => parseInt(part, 10));

    dayError = validateDay(String(day));
    monthError = validateMonth(String(month));
    yearError = validateYear(String(year));
  }

  if (questionNbr === 3 || questionNbr === 4) {
    const [month, year] = dateParts.map((part) => parseInt(part, 10));

    monthError = validateMonth(String(month));
    yearError = validateYear(String(year));
  }

  return { dayError, monthError, yearError };
};
