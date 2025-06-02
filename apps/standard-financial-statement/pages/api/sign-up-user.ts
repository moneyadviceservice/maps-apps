import type { NextApiRequest, NextApiResponse } from 'next';

import { z } from 'zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    firstName,
    lastName,
    emailAddress,
    tel,
    jobTitle,
    password,
    otp,
    continuation_token,
  } = req.body;

  console.log('req.body', req.body);

  if (otp) {
    const urlParamsChallenge = new URLSearchParams();
    urlParamsChallenge.append('client_id', process.env.ENTRA_CLIENT_ID ?? '');
    urlParamsChallenge.append('grant_type', 'oob');
    urlParamsChallenge.append('continuation_token', `${continuation_token}`);
    urlParamsChallenge.append('oob', `${otp}`);
    urlParamsChallenge.append('username', `${emailAddress}`);

    const signUpContinueResponseOTP = await signUpContinue(
      urlParamsChallenge.toString(),
    );

    console.log('signUpContinueResponseOTP', signUpContinueResponseOTP);

    if (!signUpContinueResponseOTP.continuation_token) {
      return res.json({
        message: 'otp signUpContinueResponseOTP error',
      });
    }

    const urlParamsChallengeAtt = new URLSearchParams();
    urlParamsChallengeAtt.append(
      'client_id',
      process.env.ENTRA_CLIENT_ID ?? '',
    );

    urlParamsChallengeAtt.append('username', `${emailAddress}`);
    urlParamsChallengeAtt.append(
      'continuation_token',
      `${signUpContinueResponseOTP.continuation_token}`,
    );

    urlParamsChallengeAtt.append('grant_type', 'attributes');

    urlParamsChallengeAtt.append(
      'attributes',
      `${JSON.stringify({
        displayName: `${firstName} ${lastName}`,
        givenName: firstName,
        surname: lastName,
        jobTitle: jobTitle,
        mobilePhone: tel,
      })}`,
    );

    const signUpContinueResponseAttr = await signUpContinue(
      urlParamsChallengeAtt.toString(),
    );

    if (!signUpContinueResponseAttr.continuation_token) {
      return res.json({
        message: 'attributes signUpContinueResponseAttr error',
      });
    }

    const urlParamsChallengePassword = new URLSearchParams();
    urlParamsChallengePassword.append(
      'client_id',
      process.env.ENTRA_CLIENT_ID ?? '',
    );

    urlParamsChallengePassword.append(
      'continuation_token',
      `${signUpContinueResponseAttr.continuation_token}`,
    );

    urlParamsChallengePassword.append('username', `${emailAddress}`);

    urlParamsChallengePassword.append('grant_type', 'password');
    urlParamsChallengePassword.append('password', `${password}`);

    const signUpContinueResponsePassword = await signUpContinue(
      urlParamsChallengePassword.toString(),
    );

    if (!signUpContinueResponsePassword.continuation_token) {
      return res.json({
        message: 'attributes signUpContinueResponsePassword error',
      });
    }

    const signInTokenResponse = await signInToken({
      username: emailAddress,
      token: signUpContinueResponsePassword.continuation_token,
    });

    console.log('signInTokenResponse', signInTokenResponse);

    if (signInTokenResponse.id_token) {
      return res.json({
        message: 'User signed up successfully id token',
        id_token: signInTokenResponse.id_token,
      });
    }

    return res.json({
      message: 'User signed up successfully',
      response: signUpContinueResponsePassword,
    });
  }

  try {
    const signUpStartResponse = await signUpStart(emailAddress);

    if (signUpStartResponse.error) {
      res.json({
        message: 'signUpStartResponse error',
      });
    }

    if (signUpStartResponse.continuation_token) {
      const signUpChallangeResponse = await signUpChallange(
        emailAddress,
        signUpStartResponse.continuation_token,
      );

      if (signUpChallangeResponse.continuation_token) {
        res.json({
          continuation_token: signUpChallangeResponse.continuation_token,
        });
      }
    }
  } catch (error) {
    console.error('Error during sign up process:', error);
    res.json({
      otp: false,
    });
  }
}

export const signUpStart = async (username: string) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID ?? '');
  urlParams.append('challenge_type', 'oob password redirect');
  urlParams.append('username', `${username}`);
  try {
    const response = await fetch(
      `${process.env.ENTRA_CLIENT_URL}/signup/v1.0/start`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: urlParams.toString(),
      },
    );

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const signUpChallange = async (
  username: string,
  continuation_token: string,
) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID ?? '');
  urlParams.append('challenge_type', 'oob password redirect');
  urlParams.append('continuation_token', `${continuation_token}`);
  urlParams.append('username', `${username}`);
  try {
    const response = await fetch(
      `${process.env.ENTRA_CLIENT_URL}/signup/v1.0/challenge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: urlParams.toString(),
      },
    );

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const signUpContinue = async (urlParams: string) => {
  try {
    const response = await fetch(
      `${process.env.ENTRA_CLIENT_URL}/signup/v1.0/continue`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: urlParams,
      },
    );

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const signInToken = async ({
  username,
  token,
}: {
  username: string;
  token: string;
}) => {
  const urlParams = new URLSearchParams();
  urlParams.append('client_id', process.env.ENTRA_CLIENT_ID ?? '');
  urlParams.append('username', `${username}`);
  urlParams.append('continuation_token', token);
  urlParams.append('scope', 'openid offline_access');
  urlParams.append('grant_type', 'continuation_token');
  try {
    const response = await fetch(
      `${process.env.ENTRA_CLIENT_URL}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: urlParams.toString(),
      },
    );

    return response.json();
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export const userSchema = z
  .object({
    orgLicenceNumber: z.string().min(1, 'required').optional(),
    firstName: z.string().min(1, 'required'),
    lastName: z.string().min(1, 'required'),
    emailAddress: z.string().min(1, 'required').email('invalid'),
    tel: z.string().min(1, 'required'),
    jobTitle: z.string().min(1, 'required'),
    password: z.string().min(1, 'required'),
    confirmPassword: z.string().min(1, 'required'),
    codeOfConduct: z.boolean().refine((val) => val === true),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'invalid_type',
        message: 'match',
        path: ['confirmPassword'],
        expected: 'string',
        received: 'string',
      });

      ctx.addIssue({
        code: 'invalid_type',
        message: 'match',
        path: ['password'],
        expected: 'string',
        received: 'string',
      });
    }
  });
