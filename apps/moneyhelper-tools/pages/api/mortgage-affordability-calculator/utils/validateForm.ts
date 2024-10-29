import { FormData, FormValidationObj, ValidationRules } from 'data/types';

type ValidationFieldVal = string | number | string[] | undefined;

const checkValidationRule = (
  rule: string,
  validationVal: number,
  fieldVal: number,
  multiplier?: number,
) => {
  const formVal = multiplier ? multiplier * fieldVal : fieldVal;

  switch (rule) {
    case '<=':
      return formVal <= validationVal;
    case '>=':
      return formVal >= validationVal;
    case '<':
      return formVal < validationVal;
    case '>':
      return formVal > validationVal;
    default:
      return true;
  }
};

const parseFieldValue = (value: ValidationFieldVal | boolean): number => {
  if (typeof value === 'string') {
    return Number(value.replace(/,/g, ''));
  }
  return typeof value === 'number' ? value : NaN;
};

const validateFieldRule = (
  field: ValidationFieldVal,
  rule: string,
  formData: FormData,
  validationRuleItem: ValidationRules,
  errors: { [key: string]: string },
) => {
  const { condition, otherField, multiplier, value } = validationRuleItem;
  let validationVal = otherField ? formData[`q-${otherField}`] : value;
  validationVal = parseFieldValue(validationVal);
  const formVal = parseFieldValue(field);

  if (isNaN(validationVal) || isNaN(formVal)) return;

  const validationResult = checkValidationRule(
    condition,
    validationVal,
    formVal,
    multiplier,
  );

  if (!validationResult) {
    errors[rule] = 'condition';
    if (otherField) errors[otherField] = 'no-message';
  }
};

const validateField = (
  rule: string,
  field: ValidationFieldVal,
  validationRuleObj: FormValidationObj,
  formData: FormData,
  errors: { [key: string]: string },
  userNotSeen: { [key: string]: string },
) => {
  const ruleObj = validationRuleObj[rule];
  const isRequired = ruleObj?.required;
  const rules = ruleObj?.rules;
  const fieldNotDisplayed = ruleObj?.userNotSeen;

  if (isRequired && fieldNotDisplayed) {
    userNotSeen[rule] = `q-${rule}`;
  } else if (isRequired && !field) {
    errors[rule] = 'required';
  } else if (rules?.length && field) {
    rules.forEach((validationRuleItem: ValidationRules) => {
      validateFieldRule(field, rule, formData, validationRuleItem, errors);
    });
  }
};

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
  userNotSeen: { [key: string]: string };
}

export const validateForm = (
  formData: FormData,
  validationRuleObj: FormValidationObj,
): ValidationResult => {
  const errors: { [key: string]: string } = {};
  const userNotSeen: { [key: string]: string } = {};

  Object.keys(validationRuleObj).forEach((rule) => {
    const field = formData[`q-${rule}`];
    validateField(
      rule,
      field,
      validationRuleObj,
      formData,
      errors,
      userNotSeen,
    );
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    userNotSeen,
  };
};
