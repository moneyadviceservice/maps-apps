import { page } from 'data/pages/register';
import { InputErrorTypes } from 'types/register';

import { getOtpErrorMessage } from '../getOtpErrorMessage';
import { generateSummaryErrors } from './generateSummaryErrors';

jest.mock('../getOtpErrorMessage');

describe('generateSummaryErrors', () => {
  const mockInputs = page.createAccountPage.inputs;

  const mockEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null if formErrors is null or undefined', () => {
    expect(generateSummaryErrors(null, mockInputs, mockEmail)).toBeNull();
    expect(generateSummaryErrors(undefined, mockInputs, mockEmail)).toBeNull();
  });

  it('should ignore fields where object is empty', () => {
    const formErrors = {};

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result).toEqual({});
  });

  it('should generate a standard error message for generic fields', () => {
    const formErrors = {
      givenName: { error: 'invalid' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result).toEqual({
      givenName: ['Please enter a valid first name'],
    });
  });

  it('should generate the correct message for radio fields', () => {
    const formErrors = {
      randomRadioField: { error: 'required' as InputErrorTypes },
    };
    const isRadio = true;

    const result = generateSummaryErrors(formErrors, mockInputs, '', isRadio);

    expect(result).toEqual({
      randomRadioField: ['Please select an option'],
    });
  });

  it('should return a specific message for email_exists error', () => {
    const formErrors = {
      mail: { error: 'email_exists' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result?.mail).toEqual(['This email address is already registered.']);
  });

  it('should call getOtpErrorMessage when the field is otp', () => {
    const formErrors = {
      otp: { error: 'expired' as InputErrorTypes },
    };
    const mockOtpMessage = 'Your code has expired.';
    (getOtpErrorMessage as jest.Mock).mockReturnValue(mockOtpMessage);

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(getOtpErrorMessage).toHaveBeenCalledWith('expired', mockEmail);
    expect(result?.otp).toEqual([mockOtpMessage]);
  });

  it('should use the field key as a fallback if the label is not found in inputs', () => {
    const formErrors = {
      unknownField: { error: 'required' as InputErrorTypes },
    };

    const result = generateSummaryErrors(formErrors, mockInputs, mockEmail);

    expect(result?.unknownField).toEqual(['Please enter a valid unknownfield']);
  });
});
