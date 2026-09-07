import { validateForm } from './validateForm';

describe('validateForm', () => {
  it('should return isValid true and empty errors if all required fields are present', () => {
    const formData = {
      'q-annual-income': '30,000.00',
      'q-take-home': '1,800.00',
    };
    const validationRule = {
      'annual-income': {
        required: true,
      },
      'take-home': { required: true },
    };

    const result = validateForm(formData, validationRule);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return isValid false and error message when required fields are missing', () => {
    const formData = {
      'q-annual-income': '',
      'q-take-home': '',
    };
    const validationRule = {
      'annual-income': {
        required: true,
      },
      'take-home': {
        required: true,
      },
    };
    const result = validateForm(formData, validationRule);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual({
      'annual-income': 'required',
      'take-home': 'required',
    });
  });
});
