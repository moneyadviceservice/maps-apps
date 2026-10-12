import { InputErrorTypes } from 'types/register';

export const getOtpErrorMessage = (
  errorType: InputErrorTypes,
  email: string,
): string => {
  const messages: Record<string, string> = {
    required: 'Please enter the one-time passcode',
    invalid:
      'Incorrect one-time passcode. Please check the code and try again.',
    invalid_grant:
      'Incorrect one-time passcode. Please check the code and try again.',
    expired_token: `This one-time passcode has expired. We have sent a new code to ${email}. Please enter the new code below.`,
  };

  return messages[errorType] || 'Please enter the one-time passcode';
};
