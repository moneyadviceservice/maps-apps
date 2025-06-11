import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { FormType } from 'data/form-data/org_signup';
import { sfsSignUp } from 'lib/notify/sfs-organisation-created';
import { getOrganisation } from 'lib/organisations';
import { createOrganisation } from 'lib/organisations/createOrganisation';
import { updateOrganisation } from 'lib/organisations/updateOrganisation';
import { getStoreEntry } from 'utils/store';
import { deleteStoreEntry } from 'utils/store/deleteStoreEntry';
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
    organisationName,
    continuation_token,
    orgLicenceNumber,
  } = req.body;

  const isExistingOrgUser = orgLicenceNumber !== FormType.NEW_ORG_USER;

  // validate org and email address to existing org
  if (isExistingOrgUser) {
    const validationError = await validateExistingOrgSignUp(
      orgLicenceNumber,
      emailAddress,
    );

    if (validationError) {
      res.json(validationError);
      return;
    }
  }

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

    if (!signUpContinueResponseOTP.continuation_token) {
      if (signUpContinueResponseOTP.error === 'expired_token') {
        await initSignUp(emailAddress, res);
      } else {
        return res.json({
          name: 'otp',
          error: signUpContinueResponseOTP.error,
        });
      }
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
        error: signUpContinueResponseAttr.error,
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
        error: signUpContinueResponsePassword.error,
      });
    }

    const signInTokenResponse = await signInToken({
      username: emailAddress,
      token: signUpContinueResponsePassword.continuation_token,
    });

    if (signInTokenResponse.id_token) {
      if (isExistingOrgUser) {
        const org = await getOrganisation(Number(orgLicenceNumber));
        // add email to organisation
        await updateOrganisation({
          licence_number: orgLicenceNumber,
          payload: {
            users: [
              ...org.users,
              {
                email: emailAddress,
              },
            ],
          },
        });

        return res.json({
          message: 'User signed up successfully id token',
          success: true,
          organisationName: org.name,
          id_token: signInTokenResponse.id_token,
        });
      } else {
        const cookies = new Cookies(req, res);
        const sessionId = cookies.get('fsid');
        const { entry } = await getStoreEntry(sessionId as string);

        await createOrganisation(entry, emailAddress);

        await sfsSignUp(
          firstName,
          emailAddress,
          organisationName,
          orgLicenceNumber,
          orgLicenceNumber !== FormType.NEW_ORG_USER,
        );

        await deleteStoreEntry(sessionId as string);

        cookies.set('fsid', '', { maxAge: 0 });

        return res.json({
          message: 'User signed up successfully id token',
          success: true,
          organisationName: organisationName,
          id_token: signInTokenResponse.id_token,
        });
      }
    }
  }

  try {
    await initSignUp(emailAddress, res);
  } catch (error) {
    console.error('Error during sign up process:', error);
    res.json({
      otp: false,
    });
  }
}

export const initSignUp = async (
  emailAddress: string,
  res: NextApiResponse,
) => {
  const signUpStartResponse = await signUpStart(emailAddress);

  if (signUpStartResponse.error) {
    res.json({
      name: 'emailAddress',
      error: signUpStartResponse.error,
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
};

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

const validateExistingOrgSignUp = async (
  orgLicenceNumber: string,
  emailAddress: string,
) => {
  const org = await getOrganisation(Number(orgLicenceNumber));

  const matchingEmail = org.users?.find(
    (user: { email: string }) =>
      user.email.split('@').pop() === emailAddress.split('@').pop(),
  );

  if (org.error || org.licence_status !== 'active') {
    return {
      name: 'orgLicenceNumber',
      error: 'not_found',
    };
  }

  if (!matchingEmail) {
    return {
      name: 'emailAddress',
      error: 'not_allowed',
    };
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
    password: z
      .string()
      .min(1, 'required')
      .refine(
        (password) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/.test(
            password,
          ),
        { message: 'strength' },
      ),
    confirmPassword: z
      .string()
      .min(1, 'required')
      .refine(
        (password) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/.test(
            password,
          ),
        { message: 'strength' },
      ),
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
