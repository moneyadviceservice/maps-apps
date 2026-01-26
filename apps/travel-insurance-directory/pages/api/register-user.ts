import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import * as entraIdService from '@maps-react/entra-id/entraIdService';

/**
 * Handles the initial sign-up request before the OTP is sent.
 * It validates the user, starts the sign-up flow with Entra, gets a challenge,
 * and stores the continuation token in the server-side session.
 */
async function signUpStart(req: NextApiRequest, res: NextApiResponse) {
  const {
    emailAddress,
    firstName,
    lastName,
    jobTitle,
    mobilePhone,
    individualReferenceNumber,
  } = req.body;

  const cookies = new Cookies(req, res);

  const startResponse = await entraIdService.startSignUp(
    emailAddress,
    'oob redirect',
    {
      displayName: `${firstName} ${lastName}`,
      givenName: firstName,
      surname: lastName,
      jobTitle: jobTitle,
      mobilePhone: mobilePhone,
      individualReferenceNumber: individualReferenceNumber,
    },
  );
  if (!startResponse.success) {
    return res
      .status(400)
      .json({ name: 'emailAddress', error: startResponse.error });
  }

  const challengeResponse = await entraIdService.getChallenge(
    emailAddress, // not required but keeping until SFS is testing without this
    startResponse.continuation_token,
    'oob',
  );
  if (!challengeResponse.success) {
    return res.status(500).json({ error: 'Failed to get challenge' });
  }

  cookies.set('continuation_token', challengeResponse.continuation_token, {
    httpOnly: true,
    path: '/',
  });

  return res.status(200).json({ otpSent: true });
}

/**
 * Handles the verification step of the sign-up process after the user submits the OTP.
 * It orchestrates the multi-step continuation flow with Entra ID.
 */
async function otpVerification(req: NextApiRequest, res: NextApiResponse) {
  const { emailAddress, otp } = req.body;
  const cookies = new Cookies(req, res);
  const continuation_token = cookies.get('continuation_token');

  if (!continuation_token) {
    return res.status(400).json({ error: 'Continuation token not found.' });
  }

  // 1. Submit OTP
  const otpResponse = await entraIdService.submitOtp(
    emailAddress,
    otp,
    continuation_token,
  );
  if (!otpResponse.success) {
    // If token expired, guide user to restart
    if (otpResponse.error === 'expired_token') {
      return signUpStart(req, res);
    }
    return res.status(400).json({ name: 'otp', error: otpResponse.error });
  }

  // 2. Get Final Sign-In Token
  const tokenResponse = await entraIdService.getToken(
    emailAddress,
    otpResponse.continuation_token,
  );
  if (!tokenResponse.id_token) {
    return res.status(500).json({ error: 'Failed to retrieve final token.' });
  }
  return res
    .status(200)
    .json({ success: true, id_token: tokenResponse.id_token });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .setHeader('Allow', 'POST')
      .json({ error: 'Method Not Allowed' });
  }

  const isOtpFlow = !!req.body.otp;

  try {
    if (isOtpFlow) {
      return await otpVerification(req, res);
    } else {
      return await signUpStart(req, res);
    }
  } catch (error) {
    console.error('Sign up process failed:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}
