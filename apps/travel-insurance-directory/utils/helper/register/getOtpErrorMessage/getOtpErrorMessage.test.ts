import { InputErrorTypes } from 'types/register';

import { getOtpErrorMessage } from './getOtpErrorMessage';

describe('getOtpErrorMessage', () => {
  const mockEmail = 'test@example.com';

  it('should return the correct message for a "required" error', () => {
    const result = getOtpErrorMessage('required' as InputErrorTypes, mockEmail);
    expect(result).toBe('Please enter the one-time passcode');
  });

  it('should return the correct message for an "invalid" error', () => {
    const result = getOtpErrorMessage('invalid' as InputErrorTypes, mockEmail);
    expect(result).toBe(
      'Incorrect one-time passcode. Please check the code and try again.',
    );
  });

  it('should return a message containing the email for an "expired_token" error', () => {
    const result = getOtpErrorMessage(
      'expired_token' as InputErrorTypes,
      mockEmail,
    );

    expect(result).toContain(mockEmail);
    expect(result).toBe(
      `This one-time passcode has expired. We have sent a new code to ${mockEmail}. Please enter the new code below.`,
    );
  });

  it('should return required if the errorType does not match a known key', () => {
    const result = getOtpErrorMessage(
      'unknown_error' as InputErrorTypes,
      mockEmail,
    );
    expect(result).toBe('Please enter the one-time passcode');
  });
});
