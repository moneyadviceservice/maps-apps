import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { page } from 'data/pages/register';
import { registerSessionOptions } from 'lib/sessions/registerSessionOptions';
import { withIronSession } from 'lib/sessions/withIronSession';
import {
  FIRST_REGISTER_PATH,
  OTP_REGISTER_PATH,
  SUCCESS_REDIRECT_PATH,
} from 'types/CONSTANTS';
import { IronSessionObject } from 'types/iron-session';
import { FieldType, InputErrorTypes } from 'types/register';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';
import { saveRegisterProgress } from 'utils/api/saveRegisterProgress';
import { validateCreateUser } from 'utils/validation/validateCreateUser';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

const inputs = page.createAccountPage.inputs;

/**
 * Validates form data before starting the EntraID sign up flow
 * @param req
 * @param res
 * @returns
 */
async function validateUser(req: NextApiRequest, res: NextApiResponse) {
  const validationPayload = inputs.reduce(
    (acc: Record<string, { value: string; type: FieldType }>, input) => {
      const value = req.body[input.key];
      acc[input.key] = {
        value: input.type === 'checkbox' ? value === 'on' : value,
        type: input.type,
      };
      return acc;
    },
    {},
  );

  const fcaNumber = req.session?.fcaData?.frnNumber;

  const report = await validateCreateUser(validationPayload, fcaNumber);

  if (!report.ok) {
    respond(req, res, {
      status: 400,
      data: { ...report },
      redirect: FIRST_REGISTER_PATH,
    });

    return { success: false };
  }

  return { success: true };
}

/**
 * Handles the initial sign-up request before the OTP is sent.
 * It validates the user, starts the sign-up flow with Entra, gets a challenge,
 * and stores the continuation token in the server-side session.
 */
async function signUpStart(
  req: NextApiRequest,
  res: NextApiResponse,
  resendOtp = false,
  errorType?: InputErrorTypes,
) {
  const {
    mail,
    givenName,
    surname,
    jobTitle,
    phone,
    individualReferenceNumber,
    confirmation,
  } = req.body;

  req.session.userData = {
    mail,
    givenName,
    surname,
    jobTitle,
    phone,
    individualReferenceNumber,
    confirmation,
  };
  await (req.session as IronSessionObject).save();

  const isBodyValid = await validateUser(req, res);

  if (!isBodyValid.success) return;

  const cookies = new Cookies(req, res);

  const userData = req.session.userData;

  const startResponse = await entraIdService.startSignUp(
    userData?.mail ?? mail,
    'oob redirect',
    {
      displayName: `${userData?.givenName ?? givenName} ${
        userData?.surname ?? surname
      }`,
      givenName: userData?.givenName ?? givenName,
      surname: userData?.surname ?? surname,
      jobTitle: userData?.jobTitle ?? jobTitle,
      mobilePhone: userData?.phone ?? phone,
      individualReferenceNumber:
        userData?.individualReferenceNumber ?? individualReferenceNumber,
    },
  );
  if (!startResponse.success) {
    console.error('Entra ID sign-up start failed', startResponse.error);

    return respond(req, res, {
      status: 400,
      data: errorFormat({ mail: { error: 'email_exists' } }),
      redirect: FIRST_REGISTER_PATH,
    });
  }

  const challengeResponse = await entraIdService.getChallenge(
    mail, // mail param not required but keeping until SFS is testing without this
    startResponse.continuation_token,
    'oob',
  );
  if (!challengeResponse.success) {
    return respond(req, res, {
      status: 500,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: FIRST_REGISTER_PATH,
    });
  }

  cookies.set('continuation_token', challengeResponse.continuation_token, {
    httpOnly: true,
    path: '/',
  });

  if (resendOtp) {
    // successfull resend, inform user OTP has been resent and to check their email
    return respond(req, res, {
      status: 400, // needs to be 400 to trigger OTP error display on frontend
      data: errorFormat({ otp: { error: errorType ?? 'expired_token' } }),
      redirect: OTP_REGISTER_PATH,
    });
  }

  return respond(req, res, {
    data: { success: true, otpSent: true },
    redirect: OTP_REGISTER_PATH,
  });
}

async function validateOtp(
  otp: string,
  res: NextApiResponse,
  req: NextApiRequest,
) {
  if (!otp || typeof otp !== 'string' || otp.length < 6) {
    console.error('Invalid OTP format received during validation');

    respond(req, res, {
      status: 400,
      data: errorFormat({ otp: { error: otp ? 'invalid' : 'required' } }),
      redirect: OTP_REGISTER_PATH,
    });

    return { success: false };
  }

  return { success: true };
}

/**
 * Handles the verification step of the sign-up process after the user submits the OTP.
 * It orchestrates the multi-step continuation flow with Entra ID.
 */
async function otpVerification(req: NextApiRequest, res: NextApiResponse) {
  const { otp, mail } = req.body;

  const isOtpBodyValid = await validateOtp(otp, res, req);

  if (!isOtpBodyValid.success) return;

  const email = mail ?? req.session.userData?.mail ?? '';

  const cookies = new Cookies(req, res);
  const continuation_token = cookies.get('continuation_token');

  if (!continuation_token) {
    console.error(
      'Continuation token not found in cookies during OTP verification',
    );

    return respond(req, res, {
      status: 400,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: OTP_REGISTER_PATH,
    });
  }

  // 1. Submit OTP
  const otpResponse = await entraIdService.submitOtp(
    email,
    otp,
    continuation_token,
  );
  if (!otpResponse.success) {
    console.error(
      'otpResponse.continuation_token',
      otpResponse.continuation_token,
    );
    // If token expired, guide user to restart
    if (otpResponse.error === 'expired_token') {
      console.error('OTP submission failed due to expired token');

      const resendOtp = true;
      return signUpStart(req, res, resendOtp, otpResponse.error);
    }

    return respond(req, res, {
      status: 400,
      data: errorFormat({ otp: { error: otpResponse.error } }),
      redirect: OTP_REGISTER_PATH,
    });
  }

  // 2. Get Final Sign-In Token
  const tokenResponse = await entraIdService.getToken(
    email,
    otpResponse.continuation_token,
  );
  if (!tokenResponse.id_token) {
    console.error(
      'Failed to retrieve id_token after OTP submission',
      tokenResponse.error,
    );

    return respond(req, res, {
      status: 500,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: OTP_REGISTER_PATH,
    });
  }

  await saveRegisterProgress({ session: req.session });

  return respond(req, res, {
    data: { success: true, id_token: tokenResponse.id_token },
    redirect: SUCCESS_REDIRECT_PATH,
  });
}

export default withIronSession(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    console.warn(
      `Received unsupported method ${req.method} on /api/register-user`,
    );

    return respond(req, res, {
      status: 405,
      headers: { Allow: 'POST' },
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: FIRST_REGISTER_PATH,
    });
  }

  const isOtpFlow = req.body.otp !== undefined;

  try {
    if (isOtpFlow) {
      return await otpVerification(req, res);
    } else {
      return await signUpStart(req, res);
    }
  } catch (error) {
    console.error('Sign up process failed:', error);

    return respond(req, res, {
      status: 500,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: FIRST_REGISTER_PATH,
    });
  }
},
registerSessionOptions);
