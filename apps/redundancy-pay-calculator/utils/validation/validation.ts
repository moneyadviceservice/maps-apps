import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { FORM_FIELDS } from '../../data/types';
import {
  calculateAgeAtEmploymentStart,
  calculateAgeToday,
  isEmploymentAfterRedundancy,
  isEmploymentStartInFuture,
  isRedundancyAfterStartOfYear,
  isRedundancyBeforeEndOfNextYear,
  isValidDate,
} from './dateValidation';
import { validateDate } from './fieldValidation';

export type DateValues = {
  dayError: boolean;
  monthError: boolean;
  yearError: boolean;
};

/**
 * Validates the answers provided for a specific question in the redundancy pay calculator.
 *
 * @param questionNbr - The number of the question being validated.
 * @param data - The input data provided for the question.
 * @param storedData - The previously stored data from the query, containing answers to other questions.
 * @returns A record of field errors, where the keys are field names and the values indicate whether the field has an error.
 *
 * The function performs validation based on the question number:
 * - Question 2: Validates the date of birth.
 * - Question 3: Validates the redundancy date.
 * - Question 4: Validates the employment start date.
 * - Question 5: Validates specific data for question 5 such as income and frequency.
 * - Question 7: Validates specific data for question 7, contractual pay amount if known.
 *
 * Derived values such as age, employment status, and date validity are calculated to assist in the validation process.
 */
export const validateAnswers = (
  questionNbr: number,
  data: string,
  storedData: DataFromQuery,
) => {
  const dateValues: DateValues = validateDate(data, questionNbr);
  const fieldErrors: Record<string, boolean> = {};

  const dateOfBirth = storedData['q-2'];
  const redundancyDate = storedData['q-3'];
  const employmentStartDate = storedData['q-4'];

  const {
    age,
    employmentAfterRedundancy,
    employmentStartInFuture,
    redundancyAfterStartOfYear,
    redundancyBeforeEndOfNextYear,
    validDateOfBirth,
  } = calculateDerivedValues(dateOfBirth, redundancyDate, employmentStartDate);

  switch (questionNbr) {
    case 2:
      validateQuestion2(dateValues, dateOfBirth, validDateOfBirth, fieldErrors);
      break;
    case 3:
      validateQuestion3(
        dateValues,
        redundancyAfterStartOfYear,
        redundancyBeforeEndOfNextYear,
        fieldErrors,
      );
      break;
    case 4:
      validateQuestion4(
        dateValues,
        age,
        employmentAfterRedundancy,
        employmentStartInFuture,
        fieldErrors,
      );
      break;
    case 5:
      validateQuestion5(data, fieldErrors);
      break;
    case 7:
      validateQuestion7(data, fieldErrors);
      break;
    default:
      break;
  }

  return fieldErrors;
};

/**
 * Calculates derived values based on the provided dates: date of birth, redundancy date,
 * and employment start date. The function evaluates various conditions and returns an
 * object containing the results.
 *
 * @param dateOfBirth - The date of birth of the individual in string format.
 * @param redundancyDate - The redundancy date in string format.
 * @param employmentStartDate - The employment start date in string format.
 * @returns An object containing the following derived values:
 * - `age`: The age of the individual at the employment start date, or `null` if not calculable.
 * - `employmentAfterRedundancy`: A boolean indicating if the employment start date is after the redundancy date, or `null` if not calculable.
 * - `employmentStartInFuture`: A boolean indicating if the employment start date is in the future, or `null` if not calculable.
 * - `redundancyAfterStartOfYear`: A boolean indicating if the redundancy date is after the start of the year.
 * - `redundancyBeforeEndOfNextYear`: A boolean indicating if the redundancy date is before the end of the next year.
 * - `validDateOfBirth`: A boolean indicating if the provided date of birth is valid.
 */
const calculateDerivedValues = (
  dateOfBirth: string,
  redundancyDate: string,
  employmentStartDate: string,
) => {
  let age = null;
  let employmentAfterRedundancy = null;
  let employmentStartInFuture = null;
  let redundancyAfterStartOfYear = false;
  let redundancyBeforeEndOfNextYear = false;
  let validDateOfBirth = false;

  if (dateOfBirth && redundancyDate && employmentStartDate) {
    age = calculateAgeAtEmploymentStart(dateOfBirth, employmentStartDate);
    employmentAfterRedundancy = isEmploymentAfterRedundancy(
      redundancyDate,
      employmentStartDate,
    );
    employmentStartInFuture = isEmploymentStartInFuture(employmentStartDate);
  }

  if (dateOfBirth) validDateOfBirth = isValidDate(dateOfBirth);
  if (redundancyDate) {
    redundancyAfterStartOfYear = isRedundancyAfterStartOfYear(redundancyDate);
    redundancyBeforeEndOfNextYear =
      isRedundancyBeforeEndOfNextYear(redundancyDate);
  }

  return {
    age,
    employmentAfterRedundancy,
    employmentStartInFuture,
    redundancyAfterStartOfYear,
    redundancyBeforeEndOfNextYear,
    validDateOfBirth,
  };
};
/**
 * Assigns date-related errors to the provided fieldErrors object based on the dateValues.
 *
 * @param dateValues - An object containing boolean flags for day, month, and year errors.
 * @param fieldErrors - A record of field errors to be updated.
 */
const assignDateErrors = (
  dateValues: DateValues,
  fieldErrors: Record<string, boolean>,
) => {
  if (dateValues.dayError) fieldErrors[FORM_FIELDS.day] = true;
  if (dateValues.monthError) fieldErrors[FORM_FIELDS.month] = true;
  if (dateValues.yearError) fieldErrors[FORM_FIELDS.year] = true;
};

/**
 * Validates the date format and assigns errors to the fieldErrors object.
 *
 * @param date - The date string to validate.
 * @param questionNbr - The question number for which the date is being validated.
 * @param fieldErrors - A record of field errors to be updated.
 */
const hasNoDateErrors = (dateValues: DateValues) =>
  !dateValues.dayError && !dateValues.monthError && !dateValues.yearError;

/**
 * Sets an error flag for a specific field in the provided fieldErrors object
 * if the given condition is true.
 *
 * @param condition - A boolean value that determines whether to set the error.
 * @param field - The name of the field for which the error should be set.
 * @param fieldErrors - An object where the keys are field names and the values
 * are booleans indicating whether an error exists for the corresponding field.
 */
const setError = (
  condition: boolean,
  field: string,
  fieldErrors: Record<string, boolean>,
) => {
  if (condition) fieldErrors[field] = true;
};

/**
 * Sets error flags for month and year fields based on the provided date values.
 *
 * @param dateValues - An object containing error flags for month and year.
 * @param fieldErrors - A record object where the keys represent field names and the values are booleans indicating whether the field has an error.
 */
const setMonthYearErrors = (
  dateValues: DateValues,
  fieldErrors: Record<string, boolean>,
) => {
  setError(dateValues.monthError, FORM_FIELDS.month, fieldErrors);
  setError(dateValues.yearError, FORM_FIELDS.year, fieldErrors);
};

/**
 * Validates the input for question 2 by checking date values, date of birth, and age constraints.
 *
 * @param dateValues - An object containing the date values to validate.
 * @param dateOfBirth - A string representing the user's date of birth.
 * @param validDateOfBirth - A boolean indicating whether the provided date of birth is valid.
 * @param fieldErrors - A record object to store field-specific error states.
 *
 * @remarks
 * - This function assigns errors to the `fieldErrors` object based on the validation logic.
 * - If the date of birth is invalid, an error is set for the invalid date field.
 * - If the user's age (calculated from the date of birth) is less than 15, an underage error is set.
 */
const validateQuestion2 = (
  dateValues: DateValues,
  dateOfBirth: string,
  validDateOfBirth: boolean,
  fieldErrors: Record<string, boolean>,
) => {
  assignDateErrors(dateValues, fieldErrors);

  if (!validDateOfBirth) {
    setError(true, FORM_FIELDS.invalidDate, fieldErrors);
  } else {
    const ageToday = calculateAgeToday(dateOfBirth);
    if (ageToday < 15) {
      setError(ageToday < 15, FORM_FIELDS.underAge, fieldErrors);
    }
  }
};

/**
 * Validates the redundancy date based on the provided date values and conditions.
 *
 * @param dateValues - An object containing the date values to validate.
 * @param redundancyAfterStartOfYear - A boolean indicating whether the redundancy date is after the start of the year.
 * @param redundancyBeforeEndOfNextYear - A boolean indicating whether the redundancy date is before the end of the next year.
 * @param fieldErrors - A record object to track field-specific validation errors.
 *
 * @remarks
 * This function first checks for any errors in the month and year fields using `setMonthYearErrors`.
 * If no date errors are found, it validates the redundancy date against the specified conditions
 * (`redundancyAfterStartOfYear` and `redundancyBeforeEndOfNextYear`) and updates the `fieldErrors` object accordingly.
 */
const validateQuestion3 = (
  dateValues: DateValues,
  redundancyAfterStartOfYear: boolean,
  redundancyBeforeEndOfNextYear: boolean,
  fieldErrors: Record<string, boolean>,
) => {
  setMonthYearErrors(dateValues, fieldErrors);

  if (hasNoDateErrors(dateValues)) {
    setError(
      !redundancyAfterStartOfYear,
      FORM_FIELDS.redundancyDateMin,
      fieldErrors,
    );
    setError(
      !redundancyBeforeEndOfNextYear,
      FORM_FIELDS.redundancyDateMax,
      fieldErrors,
    );
  }
};

/**
 * Validates the inputs for question 4 (employment start date), in the redundancy pay calculator.
 *
 * @param dateValues - An object containing date-related values for validation.
 * @param age - The age of the user, which can be a number or null.
 * @param employmentAfterRedundancy - A boolean or null indicating if employment starts after redundancy.
 * @param employmentStartInFuture - A boolean or null indicating if employment starts in the future.
 * @param fieldErrors - A record object to track field-specific validation errors.
 *
 * The function performs the following validations:
 * - Ensures the user's age is at least 15 years old.
 * - Checks if employment starts after the redundancy date.
 * - Checks if employment starts in the future.
 * - Validates the month and year values in the provided date object.
 */
const validateQuestion4 = (
  dateValues: DateValues,
  age: number | null,
  employmentAfterRedundancy: boolean | null,
  employmentStartInFuture: boolean | null,
  fieldErrors: Record<string, boolean>,
) => {
  setError(
    typeof age === 'number' && age < 15,
    FORM_FIELDS.userAtLeast15YearsOld,
    fieldErrors,
  );
  setError(
    !!employmentAfterRedundancy,
    FORM_FIELDS.employmentStartDateAfterRedundancyDate,
    fieldErrors,
  );
  setError(
    !!employmentStartInFuture,
    FORM_FIELDS.employmentStartDateInFuture,
    fieldErrors,
  );

  setMonthYearErrors(dateValues, fieldErrors);
};

/**
 * Validates the input data for question 5 by checking the value entered
 * in the MoneyInpuut field.
 * If no value is entered, it sets an error for the corresponding field in the `fieldErrors` object.
 *
 * @param data - The input data as a string, expected to contain a comma-separated list
 *               where the last value represents the salary to validate.
 * @param fieldErrors - An object that tracks validation errors for specific fields.
 *                      The function updates this object if an error is detected.
 */
const validateQuestion5 = (
  data: string,
  fieldErrors: Record<string, boolean>,
) => {
  const value = Number(data?.split(',').pop()?.trim());
  const noSalaryProvided = [0, 1, 2].includes(value);
  setError(noSalaryProvided, FORM_FIELDS.salary, fieldErrors);
};

/**
 * Validates the input for question 7 by checking if the provided data is empty, consists of only whitespace, or equals '0'.
 * If the validation fails, it sets an error for the specified field in the fieldErrors object.
 *
 * @param data - The input data to validate as a string.
 * @param fieldErrors - An object where field names are keys and boolean values indicate if an error exists.
 */
const validateQuestion7 = (
  data: string,
  fieldErrors: Record<string, boolean>,
) => {
  const isEmptyOrZero = !data || data.trim() === '' || data === '0';
  setError(isEmptyOrZero, FORM_FIELDS.additionalRedundancyPay, fieldErrors);
};
