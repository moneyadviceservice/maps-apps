import {
  FormData,
  FormFieldValidation,
  ValidationRules,
} from '@maps-react/pension-tools/types/forms';
import { Errors } from 'pages/[language]/';

import { realtimeValidation } from './realtimeValidation';

describe('realtimeValidation', () => {
  const currentStep = 'annual-income';
  let updatedData: FormData;
  let fieldKey: string;
  let realTimeErrors: Errors;
  let fieldValidation: FormFieldValidation;

  beforeEach(() => {
    updatedData = {};
    fieldKey = 'q-primary-income';
    realTimeErrors = {};
    fieldValidation = {
      required: false,
      requiredInputMessage: 'This field is required',
      rules: [],
    };
  });

  const ruleLessThan: ValidationRules = {
    condition: '<',
    value: 60000,
    multiplier: 1,
    otherFieldMultiplier: 1,
  };

  const ruleMoreThan: ValidationRules = {
    ...ruleLessThan,
    condition: '>',
  };

  it('should add a required error if the field is required and touched but not filled', () => {
    fieldValidation.required = true;

    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({ [fieldKey]: ['This field is required'] });
  });

  it('should remove the required error if the field is filled', () => {
    fieldValidation.required = true;
    updatedData[fieldKey] = '50000';
    realTimeErrors![fieldKey] = ['This field is required'];

    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({});
  });

  it('should validate a rule with condition "<"', () => {
    updatedData[fieldKey] = '50000';
    fieldValidation.rules = [ruleLessThan];

    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({});
  });

  it('should invalidate a rule with condition "<"', () => {
    updatedData[fieldKey] = '70000';
    fieldValidation.rules = [ruleLessThan];

    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({ [fieldKey]: [''] });
  });

  it('should validate a rule with condition ">"', () => {
    updatedData[fieldKey] = '70000';
    fieldValidation.rules = [ruleMoreThan];

    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({});
  });

  it('should invalidate a rule with condition ">"', () => {
    updatedData[fieldKey] = '50000';
    fieldValidation.rules = [ruleMoreThan];

    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({ [fieldKey]: [''] });
  });

  it('should handle required and rule validation simultaneously', () => {
    fieldValidation.required = true;
    fieldValidation.rules = [ruleLessThan];

    // Case where field is not filled
    updatedData[fieldKey] = '';
    let result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({ [fieldKey]: ['This field is required'] });

    // Case where field is filled and satisfies rule
    updatedData[fieldKey] = '50000';
    result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({});

    // Case where field is filled but does not satisfy rule
    updatedData[fieldKey] = '70000';
    result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({ [fieldKey]: [''] });
  });

  it('should handle validation with other fields', () => {
    // Case where other field is filled and rule is satisfied
    const otherField = 'q-secondary-income';
    updatedData[fieldKey] = '50000';
    updatedData[otherField] = '30000';
    fieldValidation.rules = [{ ...ruleMoreThan, otherField }];

    const satisfiedResult = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(satisfiedResult).toEqual({});

    // Case where other field is filled and rule is not satisfied
    updatedData[fieldKey] = '50000';
    updatedData[otherField] = '70000';
    fieldValidation.rules = [{ ...ruleMoreThan, otherField }];

    const unSatisfiedResult = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(unSatisfiedResult).toEqual({ [fieldKey]: [''], [otherField]: [''] });
  });

  it('should handle edge cases gracefully', () => {
    const result = realtimeValidation(
      currentStep,
      updatedData,
      fieldKey,
      realTimeErrors,
      fieldValidation,
    );

    expect(result).toEqual({});
  });
});
