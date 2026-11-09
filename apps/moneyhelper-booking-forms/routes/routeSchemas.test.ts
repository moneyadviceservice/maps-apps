import { validateDateOfBirth, validatePhoneNumber } from '@maps-react/mhf/form';

import { FormFieldName, StepName } from '../lib/constants';
import { validateAccessOptions, validateLanguage } from '../lib/form';
import { validationSchemas } from './routeSchemas';

jest.mock('@maps-react/mhf/form', () => ({
  validateDateOfBirth: jest.fn(),
  validatePhoneNumber: jest.fn(() => ({ isValid: true })),
}));

jest.mock('../lib/form', () => ({
  validateAccessOptions: jest.fn(),
  validateLanguage: jest.fn(),
}));

describe('routeSchemas wiring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls validateLanguage from ACCESS_LANGUAGE schema', () => {
    validationSchemas[StepName.ACCESS_LANGUAGE].safeParse({
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_TYPE]: 'other',
      [FormFieldName.ACCESS_SUPPORT_LANGUAGE_OTHER]: '',
    });

    expect(validateLanguage).toHaveBeenCalled();
  });

  it('calls validateAccessOptions from ACCESS_OPTIONS schema', () => {
    validationSchemas[StepName.ACCESS_OPTIONS].safeParse({
      [FormFieldName.ACCESS_SUPPORT_REQUEST]: 'none-requested',
      [FormFieldName.ACCESS_SUPPORT_COMPANION]: '',
      [FormFieldName.ACCESS_SUPPORT_DETAILS]: '',
    });

    expect(validateAccessOptions).toHaveBeenCalled();
  });

  it('normalizes communication preference string into array', () => {
    const result = validationSchemas[
      StepName.COMMUNICATION_PREFERENCES
    ].safeParse({
      [FormFieldName.COMMUNICATION_METHOD]: 'email',
      [FormFieldName.COMMUNICATION_LARGE_PRINT]: 'yes',
      [FormFieldName.COMMUNICATION_CONTACT_YOU]: 'phone',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      const data = result.data as {
        [FormFieldName.COMMUNICATION_METHOD]: string[];
      };
      expect(data[FormFieldName.COMMUNICATION_METHOD]).toEqual(['email']);
    }
  });

  it('keeps communication preferences as an array when already provided', () => {
    const result = validationSchemas[
      StepName.COMMUNICATION_PREFERENCES
    ].safeParse({
      [FormFieldName.COMMUNICATION_METHOD]: ['email', 'phone'],
      [FormFieldName.COMMUNICATION_LARGE_PRINT]: 'yes',
      [FormFieldName.COMMUNICATION_CONTACT_YOU]: 'phone',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      const data = result.data as {
        [FormFieldName.COMMUNICATION_METHOD]: string[];
      };
      expect(data[FormFieldName.COMMUNICATION_METHOD]).toEqual([
        'email',
        'phone',
      ]);
    }
  });

  it('normalizes empty communication preference to empty array', () => {
    const result = validationSchemas[
      StepName.COMMUNICATION_PREFERENCES
    ].safeParse({
      [FormFieldName.COMMUNICATION_METHOD]: '',
      [FormFieldName.COMMUNICATION_LARGE_PRINT]: 'yes',
      [FormFieldName.COMMUNICATION_CONTACT_YOU]: 'phone',
    });

    expect(result.success).toBe(false);
  });

  it('maps CONTACT_DETAILS day/month/year into validateDateOfBirth', () => {
    validationSchemas[StepName.CONTACT_DETAILS].safeParse({
      [FormFieldName.FIRST_NAME]: 'Jane',
      [FormFieldName.LAST_NAME]: 'Doe',
      [FormFieldName.EMAIL_ADDRESS]: 'jane@example.com',
      [FormFieldName.PHONE_NUMBER]: '07123456789',
      day: '10',
      month: '08',
      year: '1980',
      [FormFieldName.MEMORABLE_WORD]: 'memory',
    });

    expect(validatePhoneNumber).toHaveBeenCalledWith('07123456789');
    expect(validateDateOfBirth).toHaveBeenCalledWith(
      {
        day: '10',
        month: '08',
        year: '1980',
      },
      expect.anything(),
    );
  });

  it('maps FIND_APPOINTMENT day/month/year into validateDateOfBirth', () => {
    validationSchemas[StepName.FIND_APPOINTMENT].safeParse({
      [FormFieldName.REFERENCE_NUMBER]: 'ABC123',
      day: '11',
      month: '09',
      year: '1975',
    });

    expect(validateDateOfBirth).toHaveBeenCalledWith(
      {
        day: '11',
        month: '09',
        year: '1975',
      },
      expect.anything(),
    );
  });

  it('handles non-object preprocess input for CONTACT_DETAILS and FIND_APPOINTMENT', () => {
    validationSchemas[StepName.CONTACT_DETAILS].safeParse(undefined);
    validationSchemas[StepName.FIND_APPOINTMENT].safeParse(undefined);

    expect(validateDateOfBirth).not.toHaveBeenCalled();
  });
});
