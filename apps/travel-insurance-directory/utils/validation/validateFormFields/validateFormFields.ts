import {
  ApiFormValidationState,
  CustomInputValidation,
  FieldResult,
  FieldType,
} from 'types/register';

import { validateEmail } from '@maps-react/utils/validateEmail';

import { validateIRN } from '../validateIRN';

interface FieldInput {
  value: string;
  type: FieldType;
  required: boolean;
  customValidation?: CustomInputValidation;
}

export interface ValidationInput {
  [key: string]: FieldInput;
}

const REGEX = {
  phone: /^\+?[\d\s\-()]{7,15}$/,
  url: /^https?:\/\/[^\s$.?#].[^\s]*$/,
  postcode: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
  timeRegex: /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/,
};

const typeValidators: Partial<
  Record<
    FieldType,
    (val: string, customValidation?: CustomInputValidation) => boolean
  >
> = {
  email: (val) => validateEmail(val),
  phone: (val) => REGEX.phone.test(val),
  url: (val) => REGEX.url.test(val),
  postcode: (val) => REGEX.postcode.test(val),
  hour_min: (val) => REGEX.timeRegex.test(val),
};

const compareValues = (
  value: string,
  compareToValue: string,
  validationType?: 'lessThan' | 'greaterThan',
): boolean => {
  if (validationType === 'lessThan') {
    return value < compareToValue;
  } else if (validationType === 'greaterThan') {
    return value > compareToValue;
  } else {
    return true; // If no validationType is provided, consider it valid
  }
};

const isValueEmpty = (
  value: string | boolean | undefined | null,
  type: FieldType,
): boolean => {
  if (type === 'checkbox') return !value;
  return value === undefined || value === null || String(value).trim() === '';
};

/**
 * Validates an individual form field based on its requirements, type, and custom rules.
 */
async function validateSingleField(
  key: string,
  field: FieldInput,
  fcaNumber?: string,
): Promise<FieldResult> {
  const { value, type, required, customValidation } = field;

  // 1. Handle Empty Values
  if (isValueEmpty(value, type)) {
    if (!required) return { ok: true };

    return {
      error: 'required',
      ...(customValidation?.hideErrorWhen && {
        hideErrorWhen: customValidation.hideErrorWhen,
      }),
    };
  }

  // 2. Handle Specific IRN Validation
  if (key === 'individualReferenceNumber') {
    const isIrnValid = await validateIRN(value, fcaNumber);
    return isIrnValid ? { ok: true } : { error: 'invalid' };
  }

  // 3. Handle Type/Format Validation
  const validateType = typeValidators[type];
  if (validateType && !validateType(value)) {
    return { error: 'invalid' };
  }

  // 4. Handle Custom Comparison Validation
  if (customValidation?.compareToValue) {
    const { compareToValue, validationType } = customValidation;
    if (!compareValues(value, compareToValue, validationType)) {
      return { error: 'custom_error' };
    }
  }

  // 5. Default to Valid
  return { ok: true };
}

export async function validateFormFields(
  payload: ValidationInput,
  fcaNumber?: string,
): Promise<ApiFormValidationState> {
  const results: Record<string, FieldResult> = {};

  for (const [key, field] of Object.entries(payload)) {
    results[key] = await validateSingleField(key, field, fcaNumber);
  }

  const isFormValid = Object.values(results).every((res) => 'ok' in res);

  return {
    ok: isFormValid,
    fields: results,
    error: !isFormValid,
  };
}
