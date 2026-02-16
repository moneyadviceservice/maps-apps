import { FormEvent } from 'react';

import { FormFlowType, FormStep } from 'data/form-data/org_signup';

import { validateUserForm } from '../validation/user';
import { submitUser } from './submitUser';

jest.mock('../validation/user');

describe('submitUser', () => {
  let mockEvent: Partial<FormEvent<HTMLFormElement>>;
  let setSubmitButtonDisabled: jest.Mock;
  let setExistingOrgSignup: jest.Mock;
  let setEmailAddress: jest.Mock;
  let switchFormStep: jest.Mock;
  let handleUserErrors: jest.Mock;
  let handleOtpErrors: jest.Mock;
  let resetFormErrors: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();

    setSubmitButtonDisabled = jest.fn();
    setExistingOrgSignup = jest.fn();
    setEmailAddress = jest.fn();
    switchFormStep = jest.fn();
    handleUserErrors = jest.fn();
    handleOtpErrors = jest.fn();
    resetFormErrors = jest.fn();

    // Mock form with email + otp input
    const form = document.createElement('form');
    const emailInput = document.createElement('input');
    emailInput.name = 'emailAddress';
    emailInput.value = 'user@example.com';
    form.appendChild(emailInput);

    const otpInput = document.createElement('input');
    otpInput.name = 'otp';
    otpInput.value = '123456';
    form.appendChild(otpInput);

    mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: form,
    };

    globalThis.fetch = jest.fn();
  });

  it('calls handleUserErrors on validation failure', async () => {
    (validateUserForm as jest.Mock).mockReturnValue({
      success: false,
      errors: { emailAddress: { message: 'Invalid' } },
    });

    await submitUser({
      e: mockEvent as FormEvent<HTMLFormElement>,
      formFlowType: FormFlowType.NEW_ORG,
      setSubmitButtonDisabled,
      setExistingOrgSignup,
      setEmailAddress,
      switchFormStep,
      handleUserErrors,
      handleOtpErrors,
      resetFormErrors,
    });

    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(true);
    expect(handleUserErrors).toHaveBeenCalled();
    expect(resetFormErrors).not.toHaveBeenCalled();
  });

  it('submits successfully and switches to SUCCESS', async () => {
    (validateUserForm as jest.Mock).mockReturnValue({
      success: true,
      data: { emailAddress: 'user@example.com' },
    });

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest
        .fn()
        .mockResolvedValue({ success: true, organisationName: 'Org' }),
    });

    await submitUser({
      e: mockEvent as FormEvent<HTMLFormElement>,
      formFlowType: FormFlowType.EXISTING_ORG,
      setSubmitButtonDisabled,
      setExistingOrgSignup,
      setEmailAddress,
      switchFormStep,
      handleUserErrors,
      handleOtpErrors,
      resetFormErrors,
    });

    expect(resetFormErrors).toHaveBeenCalled();
    expect(setExistingOrgSignup).toHaveBeenCalledWith({
      orgName: 'Org',
      isExisting: true,
    });
    expect(switchFormStep).toHaveBeenCalledWith(FormStep.SUCCESS);
  });

  it('handles OTP required response from API', async () => {
    (validateUserForm as jest.Mock).mockReturnValue({
      success: true,
      data: { emailAddress: 'user@example.com' },
    });

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest
        .fn()
        .mockResolvedValue({ success: false, continuation_token: 'abc' }),
    });

    await submitUser({
      e: mockEvent as FormEvent<HTMLFormElement>,
      formFlowType: FormFlowType.NEW_ORG,
      setSubmitButtonDisabled,
      setExistingOrgSignup,
      setEmailAddress,
      switchFormStep,
      handleUserErrors,
      handleOtpErrors,
      resetFormErrors,
    });

    expect(setEmailAddress).toHaveBeenCalledWith('user@example.com');
    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(false);
    expect(switchFormStep).toHaveBeenCalledWith(FormStep.OTP);
  });

  it('calls handleOtpErrors on API error', async () => {
    (validateUserForm as jest.Mock).mockReturnValue({
      success: true,
      data: { emailAddress: 'user@example.com' },
    });

    const apiError = { name: 'otp', error: 'invalid' };
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(apiError),
    });

    await submitUser({
      e: mockEvent as FormEvent<HTMLFormElement>,
      formFlowType: FormFlowType.NEW_ORG,
      setSubmitButtonDisabled,
      setExistingOrgSignup,
      setEmailAddress,
      switchFormStep,
      handleUserErrors,
      handleOtpErrors,
      resetFormErrors,
    });

    expect(handleOtpErrors).toHaveBeenCalledWith(apiError, 'user@example.com');
  });

  it('handles fetch rejection', async () => {
    (validateUserForm as jest.Mock).mockReturnValue({
      success: true,
      data: { emailAddress: 'user@example.com' },
    });

    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error'),
    );

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      /** no empty */
    });

    await submitUser({
      e: mockEvent as FormEvent<HTMLFormElement>,
      formFlowType: FormFlowType.NEW_ORG,
      setSubmitButtonDisabled,
      setExistingOrgSignup,
      setEmailAddress,
      switchFormStep,
      handleUserErrors,
      handleOtpErrors,
      resetFormErrors,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in handleSubmitUser:',
      expect.any(Error),
    );
    expect(setSubmitButtonDisabled).toHaveBeenCalledWith(false);

    consoleSpy.mockRestore();
  });
});
