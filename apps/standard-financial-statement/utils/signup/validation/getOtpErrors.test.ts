import { QuestionOrg } from 'data/form-data/org_signup';
import * as userSignupData from 'data/form-data/user_signup';

import useTranslation from '@maps-react/hooks/useTranslation';

import { getOtpErrors } from './getOtpErrors';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('data/form-data/user_signup');

describe('getOtpErrors', () => {
  const zMock = jest.fn((msg) => msg.en);

  const inputs: QuestionOrg[] = [
    {
      name: 'emailAddress',
      title: 'Email',
      errors: { invalid: 'Invalid email', required: 'Required' },
      questionNbr: 2,
      group: 'none',
      type: 'none',
      answers: [],
    },
    {
      name: 'password',
      title: 'Password',
      errors: { password_banned: 'Password banned', required: 'Required' },
      questionNbr: 2,
      group: 'none',
      type: 'none',
      answers: [],
    },
  ];

  const email = 'user@example.com';

  beforeEach(() => {
    jest.resetAllMocks();
    (useTranslation as jest.Mock).mockReturnValue({ z: zMock });

    (userSignupData.userFormOTP as jest.Mock).mockReturnValue([
      {
        name: 'otp',
        title: 'OTP Code',
        errors: { invalid: 'Invalid code' },
      },
    ]);
  });

  it('returns mapped error for known field', () => {
    const response = { name: 'password', error: 'password_banned' };

    const result = getOtpErrors(zMock, response, inputs, email);

    expect(result).toEqual({
      password: ['Password - Password banned'],
    });
  });

  it('returns mapped error for OTP field', () => {
    const response = { name: 'otp', error: 'invalid' };

    const result = getOtpErrors(zMock, response, [], email);

    expect(result).toEqual({
      otp: ['OTP Code - Invalid code'],
    });
  });
});
