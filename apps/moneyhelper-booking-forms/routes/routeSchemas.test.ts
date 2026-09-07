import { validateDateOfBirth, validatePhoneNumber } from '@maps-react/mhf/form';

import { StepName } from '../lib/constants';
import { validateLanguage } from '../lib/form';
import { validationSchemas } from './routeSchemas';

jest.mock('@maps-react/mhf/form', () => ({
  validateDateOfBirth: jest.fn(),
  validatePhoneNumber: jest.fn(() => ({ isValid: true })),
}));

jest.mock('../lib/form', () => ({
  validateLanguage: jest.fn(),
}));

describe('routeSchemas wiring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls validateLanguage from ACCESS_LANGUAGE schema', () => {
    validationSchemas[StepName.ACCESS_LANGUAGE].safeParse({
      accessLanguageType: 'other',
      accessLanguageOther: '',
    });

    expect(validateLanguage).toHaveBeenCalled();
  });

  it('normalizes communication preference string into array', () => {
    const result = validationSchemas[
      StepName.COMMUNICATION_PREFERENCES
    ].safeParse({
      preferredMethodOfCommunication: 'email',
      largePrintCommunication: 'yes',
      contactYouCommunication: 'phone',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      const data = result.data as {
        preferredMethodOfCommunication: string[];
      };
      expect(data.preferredMethodOfCommunication).toEqual(['email']);
    }
  });

  it('keeps communication preferences as an array when already provided', () => {
    const result = validationSchemas[
      StepName.COMMUNICATION_PREFERENCES
    ].safeParse({
      preferredMethodOfCommunication: ['email', 'phone'],
      largePrintCommunication: 'yes',
      contactYouCommunication: 'phone',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      const data = result.data as {
        preferredMethodOfCommunication: string[];
      };
      expect(data.preferredMethodOfCommunication).toEqual(['email', 'phone']);
    }
  });

  it('normalizes empty communication preference to empty array', () => {
    const result = validationSchemas[
      StepName.COMMUNICATION_PREFERENCES
    ].safeParse({
      preferredMethodOfCommunication: '',
      largePrintCommunication: 'yes',
      contactYouCommunication: 'phone',
    });

    expect(result.success).toBe(false);
  });

  it('maps CONTACT_DETAILS day/month/year into validateDateOfBirth', () => {
    validationSchemas[StepName.CONTACT_DETAILS].safeParse({
      firstName: 'Jane',
      lastName: 'Doe',
      emailAddress: 'jane@example.com',
      phoneNumber: '07123456789',
      day: '10',
      month: '08',
      year: '1980',
      memorableWord: 'memory',
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
      referenceNumber: 'ABC123',
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
