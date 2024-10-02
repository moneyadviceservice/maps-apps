import { FormData, FormFieldValidation, ValidationRules } from 'data/types';
import { Errors } from 'pages/[language]/mortgage-affordability-calculator';

type ValidationFieldVal = string | number | string[] | undefined;

const sanitizeValue = (
  value?: string | string[] | number | boolean,
): number => {
  if (typeof value === 'string') {
    return Number(value.replace(/,/g, ''));
  }
  return Number(value);
};

const shouldValidate = (validationVal: number, formVal: number) =>
  !isNaN(validationVal) && !isNaN(formVal);

const checkValidationRule = (
  rule: string,
  validationVal: number,
  fieldVal: number,
  multiplier?: number,
  otherFieldMultiplier?: number,
) => {
  const formVal = multiplier ? multiplier * fieldVal : fieldVal;
  const otherVal = otherFieldMultiplier
    ? otherFieldMultiplier * validationVal
    : validationVal;

  switch (rule) {
    case '<=':
      return formVal <= otherVal;
    case '>=':
      return formVal >= otherVal;
    case '<':
      return formVal < otherVal;
    case '>':
      return formVal > otherVal;
    default:
      return true;
  }
};

const loopThroughValidationRules = (
  rules: ValidationRules[],
  updatedData: FormData,
  fieldKey: string,
  errors: Errors,
) => {
  const currentErrors = { ...errors };
  const conditionalErrors: { [key: string]: string[] } = {};

  rules?.forEach(
    ({ condition, otherField, multiplier, otherFieldMultiplier, value }) => {
      const validationVal = sanitizeValue(
        (otherField && updatedData[`${otherField}`]) || value,
      );

      const formVal: ValidationFieldVal = sanitizeValue(updatedData[fieldKey]);

      if (shouldValidate(validationVal, formVal)) {
        const validationResult = checkValidationRule(
          condition,
          validationVal,
          formVal,
          multiplier,
          otherFieldMultiplier,
        );
        if (!validationResult && !currentErrors[fieldKey]) {
          // If validation result is false and no required error message
          conditionalErrors[fieldKey] = [''];
          if (otherField) conditionalErrors[otherField] = [''];
        } else if (currentErrors[fieldKey] && otherField) {
          // If required error on main field then remove conected field error (no longer valid)
          delete currentErrors[otherField];
        } else if (validationResult && !currentErrors[fieldKey]) {
          // If validation result is true and no required error
          delete currentErrors[fieldKey];
          otherField && delete currentErrors[otherField];
        }
      }
    },
  );

  return { currentErrors, conditionalErrors };
};

export const realtimeValidation = (
  currentStep: string,
  updatedData: FormData,
  fieldKey: string,
  realTimeErrors: Errors,
  fieldValidation: FormFieldValidation,
) => {
  let value = updatedData[fieldKey];
  if (typeof value === 'string') {
    value = value.replace(/,/g, '');
  }
  const formVal = Number(value);

  let updatedErrors = {
    ...realTimeErrors,
  };
  let ruleErrors: { [key: string]: string[] } = {};

  if (currentStep === 'annual-income') {
    if (fieldValidation.required && !formVal) {
      updatedErrors[fieldKey] = [
        fieldValidation.requiredInputMessage ?? 'Required field',
      ];
    } else {
      if (updatedData[fieldKey]) {
        delete updatedErrors[fieldKey];
      }
      if (fieldValidation?.rules) {
        const { currentErrors, conditionalErrors } = loopThroughValidationRules(
          fieldValidation.rules,
          updatedData,
          fieldKey,
          updatedErrors,
        );

        updatedErrors = { ...updatedErrors, ...currentErrors };
        ruleErrors = conditionalErrors;
      }
    }
  }

  return { ...updatedErrors, ...ruleErrors };
};
