import { FieldType } from '@maps-react/pension-tools/types/forms';

import { validateForm } from './validateForm';

describe('validateForm', () => {
  it('should return isValid true and empty errors if all required fields are present', () => {
    const tab = '1';
    const formData = {
      'q-baby-due': '9',
      'q-additional-info': 'Some additional information',
    };
    const validationRules = [
      {
        'baby-due': {
          required: true,
          requiredPageMessage: 'Please select a timeframe',
        },
        'additional-info': { required: true },
      },
      { 'next-tab-field': { required: true } },
    ];
    const result = validateForm(tab, formData, validationRules);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return isValid false and errors if required fields are missing', () => {
    const tab = '1';
    const formData = {};
    const validationRules = [
      {
        'baby-due': {
          required: true,
          requiredPageMessage: 'Please select a timeframe',
        },
        'additional-info': { required: true },
      },
      { 'next-tab-field': { required: true } },
    ];
    const result = validateForm(tab, formData, validationRules);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      'baby-due': 'Please select a timeframe',
      'additional-info': 'Required field',
    });
  });

  it('should handle input-currency-with-select field types', () => {
    const tab = '1';
    const formData = {
      'q-amount-i-can-save-i': '20',
      'q-amount-i-can-save-s': '30',
    };
    const validationRules = [
      {
        'amount-i-can-save': {
          required: true,
          requiredPageMessage: 'Please select a timeframe',
          type: 'input-currency-with-select' as FieldType,
        },
      },
    ];
    const result = validateForm(tab, formData, validationRules);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
