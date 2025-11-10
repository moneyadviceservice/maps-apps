import { differenceInYears } from 'date-fns';

import {
  MAXIMUM_YEARS_OF_EMPLOYMENT,
  MINIMUM_YEARS_OF_EMPLOYMENT,
  MONTHS_IN_YEAR,
  WEEKLY_PAY_CAP,
  WEEKLY_PAY_CAP_NI,
  WEEKLY_PAY_CAP_NI_PRE_2025,
  WEEKLY_PAY_CAP_PRE_2025,
  WEEKS_IN_YEAR,
} from '../../CONSTANTS';

export type Salary = {
  amount: number;
  frequency: number; // 0 - yearly, 1 - monthly, 2 - weekly
};

export type StatutoryRedundancyPayInput = {
  dateOfBirth: string; // "dd-mm-yyyy"
  salary: Salary;
  jobStart: string; // "mm-yyyy"
  jobEnd: string; // "mm-yyyy"
  country: number; // 0 - england, 1 - scotland, 2 - wales, 3 - northen ireland
};

export type StatutoryRedundancyPayResult = {
  amount: number;
  entitlementWeeks: number;
};

/**
 * Calculates the statutory redundancy pay based on the provided input.
 *
 * @param input - An object containing the necessary details to calculate redundancy pay:
 *   - `dateOfBirth`: The date of birth of the employee in DD/MM/YYYY format.
 *   - `jobStart`: The start date of the job in MM/YYYY format.
 *   - `jobEnd`: The end date of the job in MM/YYYY format.
 *   - `salary`: The annual salary of the employee.
 *   - `country`: The country where the job is located.
 *
 * @returns An object containing:
 *   - `amount`: The total statutory redundancy pay amount (rounded to the nearest whole number).
 *   - `entitlementWeeks`: The total number of entitlement weeks based on the employee's age and years of service.
 *
 * The calculation considers:
 * - The employee's age at the end of the job to determine the redundancy rate.
 * - The number of years of employment, capped at a maximum limit.
 * - The weekly pay, capped based on the country and job end date.
 *
 * If the employee has fewer years of employment than the minimum required, the result will be zero.
 */
export const calculateStatutoryRedundancyPay = (
  input: StatutoryRedundancyPayInput,
): StatutoryRedundancyPayResult => {
  const dateOfBirth = getDateFromDMY(input.dateOfBirth);
  const jobStart = getDateFromMY(input.jobStart);
  const jobEnd = getDateFromMY(input.jobEnd);

  const yearsOfEmployment = calculateYearsOfEmployment(
    jobStart,
    jobEnd,
    MAXIMUM_YEARS_OF_EMPLOYMENT,
  );

  const result = {
    amount: 0.0,
    entitlementWeeks: 0.0,
  };

  if (yearsOfEmployment >= MINIMUM_YEARS_OF_EMPLOYMENT) {
    const weeklyPayCap = getWeeklyPayCap(input.country, input.jobEnd);
    if (
      weeklyPayCap !== undefined &&
      yearsOfEmployment >= MINIMUM_YEARS_OF_EMPLOYMENT
    ) {
      const weeklyPay = calculateWeeklyPay(input.salary, weeklyPayCap);
      const jobEndDate = getDateFromMY(input.jobEnd);
      const jobEndAge = calculateAgeOnDate(dateOfBirth, jobEndDate);

      // Work backwards from redundancy date for the number of years worked (to the cap)
      for (let year = 0; year < yearsOfEmployment; year++) {
        const age = jobEndAge - year - 1;
        const rate = getRateForAge(age);

        result.amount += weeklyPay * rate;
        result.entitlementWeeks += rate;
      }

      result.amount = Math.round(result.amount);
    }
  }

  return result;
};

/**
 * Determines the redundancy pay rate based on the age of an individual.
 *
 * @param age - The age of the individual.
 * @returns The redundancy pay rate:
 * - 0.5 if the age is less than 22.
 * - 1.0 if the age is between 22 and 40 (inclusive).
 * - 1.5 if the age is 41 or older.
 */
const getRateForAge = (age: number) => {
  if (age < 22) return 0.5;
  if (age < 41) return 1.0;
  return 1.5;
};

/**
 * Calculates the weekly pay based on the provided salary and a cap value.
 *
 * @param salary - An object representing the salary details, including the amount and frequency.
 *                 The frequency can be:
 *                 - 0: Annual salary
 *                 - 1: Monthly salary
 *                 - Any other value: Weekly salary
 * @param cap - The maximum allowable weekly pay. If the calculated weekly pay exceeds this value,
 *              the cap will be returned instead.
 * @returns The calculated weekly pay, capped at the specified maximum value if necessary.
 */
const calculateWeeklyPay = (salary: Salary, cap: number) => {
  let weeklyPay = 0.0;

  if (salary.frequency === 0) {
    weeklyPay = salary.amount / WEEKS_IN_YEAR;
  } else if (salary.frequency === 1) {
    weeklyPay = (salary.amount * MONTHS_IN_YEAR) / WEEKS_IN_YEAR;
  } else {
    weeklyPay = salary.amount;
  }

  return weeklyPay <= cap ? weeklyPay : cap;
};

/**
 * Calculates the yearly pay based on the provided salary object.
 *
 * @param salary - An object containing the salary details.
 *   - `amount`: The numeric value of the salary.
 *   - `frequency`: The frequency of the salary payment.
 *     - `0`: Yearly salary.
 *     - `1`: Monthly salary.
 *     - `2`: Weekly salary.
 * @returns The calculated yearly pay as a number.
 */
export const calculateYearlyPay = (salary: Salary) => {
  if (salary.frequency === 0) {
    return salary.amount;
  } else if (salary.frequency === 1) {
    return salary.amount * MONTHS_IN_YEAR;
  } else {
    return salary.amount * WEEKS_IN_YEAR;
  }
};

/**
 * Determines the weekly pay cap based on the country and the job end date.
 *
 * @param country - The country code. Use `3` for Ireland, and any other number for England, Scotland, or Wales.
 * @param jobEnd - The job end date in the format "MM-YYYY".
 * @returns The applicable weekly pay cap based on the country and job end date.
 */
const getWeeklyPayCap = (country: number, jobEnd: string) => {
  const [month, year] = jobEnd.split('-');
  const jobEndDate = new Date(`${year}-${month}-01`);

  const cutoffDate = new Date('2025-03-31');

  // Ireland
  if (country === 3) {
    if (jobEndDate > cutoffDate) {
      return WEEKLY_PAY_CAP_NI;
    } else {
      return WEEKLY_PAY_CAP_NI_PRE_2025;
    }
  }

  // England, Scotland, Wales
  if (country !== 3) {
    if (jobEndDate >= cutoffDate) {
      return WEEKLY_PAY_CAP;
    } else {
      return WEEKLY_PAY_CAP_PRE_2025;
    }
  }
};

const calculateAgeOnDate = (dateOfBirth: Date, date: Date) =>
  differenceInYears(date, dateOfBirth);

/**
 * Calculates the number of years of employment between a start date and an end date,
 * applying a cap to the maximum number of years that can be returned.
 *
 * @param start - The start date of employment.
 * @param end - The end date of employment.
 * @param cap - The maximum number of years to be considered.
 * @returns The number of years of employment, capped at the specified maximum.
 */
const calculateYearsOfEmployment = (start: Date, end: Date, cap: number) => {
  const delta = differenceInYears(end, start);

  return delta <= cap ? delta : cap;
};

/**
 * Converts a date string in the format "DD-MM-YYYY" into a JavaScript Date object.
 *
 * @param date - The date string in "DD-MM-YYYY" format.
 * @returns A JavaScript Date object representing the given date.
 */
export const getDateFromDMY = (date: string) => {
  const parts = date.split('-');

  const day = Number(parts[0]);
  const monthIndex = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  return new Date(year, monthIndex, day);
};

/**
 * Converts a date string in the format "MM-YYYY" into a JavaScript Date object.
 * The resulting Date object represents the first day of the specified month and year.
 *
 * @param date - A string representing the date in the format "MM-YYYY".
 * @returns A Date object corresponding to the first day of the specified month and year.
 */
export const getDateFromMY = (date: string) => {
  const parts = date.split('-');

  const day = 1;
  const monthIndex = Number(parts[0]) - 1;
  const year = Number(parts[1]);

  return new Date(year, monthIndex, day);
};
