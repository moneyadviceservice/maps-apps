import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { FormType } from 'data/form-data/org_signup';
import * as entraIdService from 'lib/entra/signup/entraIdService';
import { sfsSignUp } from 'lib/notify/sfs-organisation-created';
import { getOrganisation } from 'lib/organisations';
import { createOrganisation } from 'lib/organisations/createOrganisation';
import { updateOrganisation } from 'lib/organisations/updateOrganisation';
import { deleteStoreEntry, getStoreEntry } from 'utils/store';

/**
 * Handles the initial sign-up request before the OTP is sent.
 * It validates the user, starts the sign-up flow with Entra, gets a challenge,
 * and stores the continuation token in the server-side session.
 */
async function handleInitialSignUp(req: NextApiRequest, res: NextApiResponse) {
  const { emailAddress, orgLicenceNumber } = req.body;
  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');
  const { entry, store } = await getStoreEntry(sessionId as string);
  const isExistingOrgUser = entry?.data?.flow !== FormType.NEW_ORG;

  if (isExistingOrgUser) {
    const validationError = await validateExistingOrgSignUp(
      orgLicenceNumber,
      emailAddress,
    );
    if (validationError) {
      console.error('validationError', validationError);
      return res.status(400).json(validationError);
    }
  }

  const startResponse = await entraIdService.startSignUp(emailAddress);
  if (!startResponse.success) {
    return res
      .status(400)
      .json({ name: 'emailAddress', error: startResponse.error });
  }

  const challengeResponse = await entraIdService.getChallenge(
    emailAddress,
    startResponse.continuation_token,
  );
  if (!challengeResponse.success) {
    return res.status(500).json({ error: 'Failed to get challenge' });
  }

  // Securely store the token in the session instead of sending to client
  await store.setJSON(sessionId as string, {
    data: {
      ...entry.data,
    },
    continuation_token: challengeResponse.continuation_token,
  });

  return res.status(200).json({ otpSent: true });
}

/**
 * Handles the verification step of the sign-up process after the user submits the OTP.
 * It orchestrates the multi-step continuation flow with Entra ID.
 */
async function handleOtpVerification(
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
    orgLicenceNumber,
    organisationName,
  } = req.body;
  const cookies = new Cookies(req, res);
  const sessionId = cookies.get('fsid');

  if (!sessionId) {
    return res.status(400).json({ error: 'Session not found.' });
  }

  const { entry } = await getStoreEntry(sessionId);
  const initialToken = entry?.continuation_token;
  const isExistingOrgUser = entry?.data?.flow !== FormType.NEW_ORG;

  if (!initialToken) {
    return res
      .status(400)
      .json({ error: 'Continuation token missing. Please try again.' });
  }

  // 1. Submit OTP
  const otpResponse = await entraIdService.submitOtp(
    emailAddress,
    otp,
    initialToken,
  );
  if (!otpResponse.success) {
    // If token expired, guide user to restart
    if (otpResponse.error === 'expired_token') {
      return handleInitialSignUp(req, res);
    }
    return res.status(400).json({ name: 'otp', error: otpResponse.error });
  }

  // 2. Submit Attributes
  const attributesResponse = await entraIdService.submitAttributes(
    emailAddress,
    {
      displayName: `${firstName} ${lastName}`,
      givenName: firstName,
      surname: lastName,
      jobTitle,
      mobilePhone: tel,
    },
    otpResponse.continuation_token,
  );
  if (!attributesResponse.success) {
    return res.status(400).json({ error: attributesResponse.error });
  }

  // 3. Submit Password
  const passwordResponse = await entraIdService.submitPassword(
    emailAddress,
    password,
    attributesResponse.continuation_token,
  );
  if (!passwordResponse.success) {
    console.error('passwordResponse', passwordResponse);

    if (passwordResponse.suberror === 'password_banned') {
      return res
        .status(400)
        .json({ name: 'password', error: 'password_banned' });
    }

    return res
      .status(400)
      .json({ name: 'password', error: passwordResponse.error });
  }

  // 4. Get Final Sign-In Token
  const tokenResponse = await entraIdService.getToken(
    emailAddress,
    passwordResponse.continuation_token,
  );
  if (!tokenResponse.id_token) {
    return res.status(500).json({ error: 'Failed to retrieve final token.' });
  }

  // 5. Perform Post-Sign-Up Business Logic
  let finalOrgName = organisationName;
  if (isExistingOrgUser) {
    const org = await getOrganisation(Number(orgLicenceNumber));
    await updateOrganisation({
      licence_number: orgLicenceNumber,
      payload: { users: [...org.users, { email: emailAddress }] },
    });
    finalOrgName = org.name;
  } else {
    const data = await createOrganisation(entry, emailAddress);
    await sfsSignUp(
      firstName,
      emailAddress,
      data?.response?.name as string,
      String(data?.response?.licence_number),
    );
  }

  // 6. Clean up session and respond
  await deleteStoreEntry(sessionId);
  cookies.set('fsid', '', { maxAge: 0 });

  return res.status(200).json({
    success: true,
    organisationName: finalOrgName,
    id_token: tokenResponse.id_token,
  });
}

// --- MAIN API HANDLER ---
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

  try {
    // Delegate to the appropriate handler based on whether an OTP is present
    if (req.body.otp) {
      return await handleOtpVerification(req, res);
    } else {
      return await handleInitialSignUp(req, res);
    }
  } catch (error) {
    console.error('Sign up process failed:', error);
    return res.status(500).json({ error: 'An unexpected error occurred.' });
  }
}

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
