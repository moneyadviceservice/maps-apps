import { ErrorType } from '@maps-react/form/types';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  fieldErrorMessages,
  radioInputsErrorMessages,
} from '../../data/form-content/errors';
import { FORM_FIELDS } from '../../data/types';
import { isValidDate } from '../validation/dateValidation';

type Translation = ReturnType<typeof useTranslation>['z'];

/**
 * Adds an error to the provided error object if an error for the specified question
 * does not already exist. Ensures that duplicate errors for the same question are avoided.
 *
 * @param errorObj - The object containing an array of errors to which the new error will be added.
 * @param question - The identifier for the question associated with the error.
 * @param message - The error message to be added for the specified question.
 */
const addError = (
  errorObj: { errors: ErrorType[] },
  question: number,
  message: string,
) => {
  if (!errorObj.errors.some((e) => e.question === question)) {
    errorObj.errors.push({ question, message });
  }
};

/**
 * Handles errors related to radio input questions by checking if the specified
 * question is within the allowed set and adding the corresponding error to the
 * provided error object if applicable.
 *
 * @param question - The question number to check for radio input errors.
 * @param radioInputErrors - An array of error objects containing details about
 * radio input errors, including the question number and error message.
 * @param errorObj - An object containing an `errors` array where the identified
 * error will be added if a match is found.
 */
const handleRadioInputErrors = (
  question: number,
  radioInputErrors: ErrorType[],
  errorObj: { errors: ErrorType[] },
) => {
  if ([1, 6].includes(question)) {
    const radioError = radioInputErrors.find(
      (error) => error.question === question,
    );
    if (radioError) {
      addError(errorObj, question, radioError.message);
    }
  }
};

/**
 * Handles date-related errors by checking for missing fields and adding an error to the provided error object.
 *
 * @param dateFields - An array of strings representing the names of date fields to validate.
 * @param question - The question number associated with the error.
 * @param inputFieldErrors - A record where the keys are field names and the values indicate whether the field has an error (true if there is an error).
 * @param fieldErrors - A record where the keys are field names and the values are error messages associated with those fields.
 * @param errorObj - An object containing an `errors` array where new errors will be added.
 */
const handleDateErrors = (
  dateFields: string[],
  question: number,
  inputFieldErrors: Record<string, boolean>,
  fieldErrors: Record<string, string>,
  errorObj: { errors: ErrorType[] },
) => {
  const missingFields = dateFields.filter((field) => inputFieldErrors[field]);
  const dateError = fieldErrors[missingFields.join('')];
  if (dateError) {
    addError(errorObj, question, String(dateError));
  }
};

/**
 * Validates a full date and adds an error to the error object if the date is invalid.
 *
 * @param question - The question number associated with the validation.
 * @param fieldErrors - A record containing error messages mapped by field keys.
 * @param errorObj - An object containing an array of errors to which validation errors will be added.
 * @param dateOfBirth - (Optional) The date of birth to validate. If not provided, an empty string will be used.
 */
const validateFullDate = (
  question: number,
  fieldErrors: Record<string, string>,
  errorObj: { errors: ErrorType[] },
  dateOfBirth?: string,
) => {
  if (!isValidDate(dateOfBirth ?? '')) {
    addError(errorObj, question, fieldErrors[FORM_FIELDS.invalidDate]);
  }
};

/**
 * Handles field errors for a specific question in the redundancy pay calculator.
 *
 * This function processes input field errors, adds appropriate error messages,
 * and validates date-related fields based on the question number.
 *
 * @param question - The question number for which errors are being handled.
 * @param inputFieldErrors - A record of boolean flags indicating errors for specific input fields.
 * @param fieldErrors - A record mapping field names to their corresponding error messages.
 * @param errorObj - An object containing an array of errors to be updated.
 * @param dateOfBirth - (Optional) The user's date of birth, used for specific validations.
 */
const handleFieldErrors = (
  question: number,
  inputFieldErrors: Record<string, boolean>,
  fieldErrors: Record<string, string>,
  errorObj: { errors: ErrorType[] },
  dateOfBirth?: string,
) => {
  // Helper function to handle adding errors
  const addErrorsForFields = (fields: string[], question: number) => {
    fields.forEach((field) => {
      if (inputFieldErrors[field]) {
        addError(errorObj, question, fieldErrors[field]);
      }
    });
  };

  // Handle date errors for questions 2, 3, and 4
  const handleDateForQuestion = (fields: string[], question: number) => {
    handleDateErrors(fields, question, inputFieldErrors, fieldErrors, errorObj);
  };

  switch (question) {
    case 2:
      handleDateForQuestion(
        [FORM_FIELDS.day, FORM_FIELDS.month, FORM_FIELDS.year],
        question,
      );
      addErrorsForFields([FORM_FIELDS.underAge], question);

      if (
        !inputFieldErrors[FORM_FIELDS.day] &&
        !inputFieldErrors[FORM_FIELDS.month] &&
        !inputFieldErrors[FORM_FIELDS.year]
      ) {
        validateFullDate(question, fieldErrors, errorObj, dateOfBirth);
      }
      break;

    case 3:
      handleDateForQuestion([FORM_FIELDS.month, FORM_FIELDS.year], question);
      addErrorsForFields(
        [FORM_FIELDS.redundancyDateMin, FORM_FIELDS.redundancyDateMax],
        question,
      );
      break;

    case 4:
      handleDateForQuestion(
        [FORM_FIELDS.day, FORM_FIELDS.month, FORM_FIELDS.year],
        question,
      );
      addErrorsForFields(
        [
          FORM_FIELDS.userAtLeast15YearsOld,
          FORM_FIELDS.employmentStartDateAfterRedundancyDate,
          FORM_FIELDS.employmentStartDateInFuture,
        ],
        question,
      );
      break;

    case 5:
      addErrorsForFields([FORM_FIELDS.salary], question);
      break;

    case 7:
      addErrorsForFields([FORM_FIELDS.additionalRedundancyPay], question);
      break;
  }
};

/**
 * Generates an object containing error messages based on the provided inputs.
 *
 * @param question - The current question number being validated.
 * @param inputFieldErrors - A record of input field error states, where the key is the field name and the value is a boolean indicating if there's an error.
 * @param hasError - A boolean indicating if there are any errors to process.
 * @param z - The translation object used for retrieving localized error messages.
 * @param dateOfBirth - (Optional) The user's date of birth, used for specific error validation.
 * @returns An object containing an array of error messages (`errors`).
 */
export const getErrors = (
  question: number,
  inputFieldErrors: Record<string, boolean>,
  hasError: boolean,
  z: Translation,
  dateOfBirth?: string,
): { errors: ErrorType[] } => {
  const errorObj = { errors: [] as ErrorType[] };
  const radioInputErrors = radioInputsErrorMessages(z);
  const fieldErrors = fieldErrorMessages(z);

  if (!hasError) return errorObj;

  // Handle radio input errors for questions 1 and 6
  handleRadioInputErrors(question, radioInputErrors, errorObj);

  // Handle specific errors for each question
  handleFieldErrors(
    question,
    inputFieldErrors,
    fieldErrors,
    errorObj,
    dateOfBirth,
  );

  return errorObj;
};
