import {
  endOfYear,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isValid,
  isWithinInterval,
  parse,
  startOfYear,
} from 'date-fns';

/**
 * Parses a date string in the specified format and returns a Date object.
 *
 * @param dateStr - The date string to be parsed.
 * @param format - The format of the date string. Defaults to 'dd-MM-yyyy'.
 * @returns A Date object representing the parsed date.
 *
 * @example
 * ```typescript
 * const date = parseDMY('25-12-2023');
 * console.log(date); // Outputs: Mon Dec 25 2023 ...
 * ```
 *
 * @throws Will throw an error if the date string does not match the specified format.
 */
const parseDMY = (dateStr: string, format = 'dd-MM-yyyy'): Date =>
  parse(dateStr, format, new Date());

/**
 * Parses a date string in the format "MM-YYYY" and returns a Date object.
 *
 * @param dateStr - The date string in the format "MM-YYYY".
 * @returns A Date object representing the first day of the specified month and year.
 *
 * @example
 * ```typescript
 * const date = parseMY("03-2023");
 * console.log(date); // Outputs: Wed Mar 01 2023 00:00:00 GMT+0000 (Coordinated Universal Time)
 * ```
 */
const parseMY = (dateStr: string): Date => {
  const [month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
};

/**
 * Determines whether the current date is before the user's birthday in the current year.
 *
 * @param today - The current date.
 * @param birthDate - The user's birth date.
 * @returns `true` if the current date is before the user's birthday this year, otherwise `false`.
 */
const isBeforeBirthdayThisYear = (today: Date, birthDate: Date): boolean => {
  const birthMonth = getMonth(birthDate);
  const birthDay = getDate(birthDate);

  return (
    getMonth(today) < birthMonth ||
    (getMonth(today) === birthMonth && getDate(today) < birthDay)
  );
};

/**
 * Validates whether a given date string is in a valid format and represents a valid date.
 *
 * The function expects the date string to be in the format `DD-MM-YYYY` or'MM-YYYY` ,
 * where the year is always the last part and must be 4 digits long.
 *
 * @param dateString - The date string to validate.
 * @returns `true` if the date string is valid, `false` otherwise.
 */
export const isValidDate = (dateString: string): boolean => {
  const parts = dateString.split('-');

  // Year will always be on the end
  if (parts[parts.length - 1].length != 4) return false;

  const parsedDate = parseDMY(dateString);
  return isValid(parsedDate);
};

/**
 * Calculates the age of an individual at the start of their employment.
 *
 * @param dob - The date of birth of the individual in the format "DD/MM/YYYY".
 * @param employmentStartDate - The employment start date in the format "MM/YYYY".
 * @returns The age of the individual at the start of their employment. Returns 0 if either `dob` or `employmentStartDate` is not provided.
 */
export const calculateAgeAtEmploymentStart = (
  dob: string,
  employmentStartDate: string,
): number => {
  if (!dob || !employmentStartDate) return 0;

  const birthDate = parseDMY(dob);
  const startDate = parseMY(employmentStartDate);

  let age = getYear(startDate) - getYear(birthDate);

  if (
    isBefore(
      startDate,
      new Date(getYear(startDate), getMonth(birthDate), getDate(birthDate)),
    )
  ) {
    age -= 1;
  }

  return age;
};

/**
 * Calculates the age of a person based on their date of birth (DOB) as of today.
 *
 * @param dob - The date of birth in string format (expected format: DD-MM-YYYY).
 * @returns The calculated age as a number. Returns 0 if the DOB is not provided.
 */
export const calculateAgeToday = (dob: string): number => {
  if (!dob) return 0;

  const today = new Date();
  const birthDate = parseDMY(dob);

  let age = getYear(today) - getYear(birthDate);
  if (isBeforeBirthdayThisYear(today, birthDate)) {
    age -= 1;
  }

  return age;
};

/**
 * Checks if the employment start date is after the redundancy date.
 *
 * @param redundancyDate - The redundancy date in string format (expected format: MM-YYYY).
 * @param employmentStartDate - The employment start date in string format (expected format: MM-YYYY).
 * @returns `true` if the employment start date is after the redundancy date, otherwise `false`.
 */
export const isEmploymentAfterRedundancy = (
  redundancyDate: string,
  employmentStartDate: string,
): boolean => {
  if (!redundancyDate || !employmentStartDate) return false;

  const redundancy = parseMY(redundancyDate);
  const startDate = parseMY(employmentStartDate);

  return isAfter(startDate, redundancy);
};

/**
 * Checks if the provided employment start date is in the future.
 *
 * @param employmentStartDate - The employment start date as a string in the format 'MM-YYYY'.
 * @returns `true` if the employment start date is in the future, otherwise `false`.
 */
export const isEmploymentStartInFuture = (
  employmentStartDate: string,
): boolean => {
  if (!employmentStartDate) return false;

  const startDate = parseMY(employmentStartDate);
  return isAfter(startDate, new Date());
};

/**
 * Validates whether the provided redundancy date is within the valid range.
 * The valid range is from the start of the current year to the end of the next year.
 *
 * @param redundancyDate - The redundancy date as a string in the format 'MM-yyyy'.
 * @returns `true` if the redundancy date is valid and falls within the specified range, otherwise `false`.
 */
export const isRedundancyDateValid = (redundancyDate: string): boolean => {
  if (!redundancyDate) return false;

  const redundancy = parse(redundancyDate, 'MM-yyyy', new Date());
  const currentYear = new Date().getFullYear();

  return isWithinInterval(redundancy, {
    start: startOfYear(new Date(currentYear, 0)),
    end: endOfYear(new Date(currentYear + 1, 0)),
  });
};

/**
 * Checks if the given redundancy date is on or after the start of the current year.
 *
 * @param redundancyDate - The redundancy date as a string in a valid date format.
 * @returns `true` if the redundancy date is on or after January 1st of the current year, otherwise `false`.
 */
export const isRedundancyAfterStartOfYear = (
  redundancyDate: string,
): boolean => {
  if (!redundancyDate) return false;

  const redundancy = parseMY(redundancyDate);
  const startOfYear = new Date(getYear(new Date()), 0, 1);

  return !isBefore(redundancy, startOfYear);
};

/**
 * Checks if the given redundancy date is before or on the last day of the next calendar year.
 *
 * @param redundancyDate - The redundancy date in string format to validate.
 * @returns `true` if the redundancy date is before or on December 31st of the next year, otherwise `false`.
 */
export const isRedundancyBeforeEndOfNextYear = (
  redundancyDate: string,
): boolean => {
  if (!redundancyDate) return false;

  const redundancy = parseMY(redundancyDate);
  const endOfNextYear = new Date(getYear(new Date()) + 1, 11, 31);

  return !isAfter(redundancy, endOfNextYear);
};
