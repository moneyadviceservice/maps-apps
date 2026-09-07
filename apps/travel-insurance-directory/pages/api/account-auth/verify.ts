import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { resolveAccountMainFirm } from 'lib/account/resolveAccountMainFirm';
import { accountAuthCookies } from 'lib/accountAuth/cookies';
import { accountAuthRoutes } from 'lib/accountAuth/routes';
import { withAccountSession } from 'lib/accountAuth/withAccountSession';
import { ensureSelfServeE2eFirm } from 'lib/ci/ensureSelfServeE2eFirm';
import { syncRegistrationSessionFromFirm } from 'lib/register/syncRegistrationSessionFromFirm';
import { IronSessionObject } from 'types/iron-session';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

import {
  getSignInChallenge,
  startSignIn,
  submitSignInOtp,
} from '@maps-react/entra-id/entraIdService';

type AccountSignInTokenResponse = {
  error?: string;
  error_description?: string;
  error_codes?: unknown;
  id_token?: string;
};

const { continuation: CONTINUATION_COOKIE, loginEmail: EMAIL_COOKIE } =
  accountAuthCookies;

const ACCOUNT_COOKIE_PATH = '/account';
const EMAIL_COOKIE_MAX_AGE_SECONDS = 60 * 15;

async function resendOtpIfPossible({
  email,
  cookies,
}: {
  email: string;
  cookies: Cookies;
}) {
  const startResponse = await startSignIn(email, 'oob redirect');
  if (!startResponse.success) return;

  const challengeResponse = await getSignInChallenge(
    email,
    startResponse.continuation_token,
    'oob redirect',
  );
  if (!challengeResponse.success) return;

  const secureCookie =
    process.env.NETLIFY === 'true' && process.env.NETLIFY_DEV !== 'true';

  cookies.set(CONTINUATION_COOKIE, challengeResponse.continuation_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookie,
    path: '/',
  });
  cookies.set(EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookie,
    path: ACCOUNT_COOKIE_PATH,
    maxAge: EMAIL_COOKIE_MAX_AGE_SECONDS,
  });
}

function isCodeExpiredResponse(
  tokenResponse: AccountSignInTokenResponse,
): boolean {
  if (!tokenResponse || typeof tokenResponse !== 'object') return false;

  const tr = tokenResponse as Record<string, unknown>;
  const errorDescription = tr.error_description;
  const errorCodes = tr.error_codes;

  return (
    (Array.isArray(errorCodes) &&
      errorCodes.some((c) => typeof c === 'number' && c === 70019)) ||
    (typeof errorDescription === 'string' &&
      errorDescription.includes('AADSTS70019'))
  );
}

async function maybeHandleInvalidGrant({
  tokenResponse,
  email,
  cookies,
  req,
  res,
}: {
  tokenResponse: AccountSignInTokenResponse;
  email: string;
  cookies: Cookies;
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  if (tokenResponse?.error !== 'invalid_grant') return null;

  if (isCodeExpiredResponse(tokenResponse)) {
    try {
      await resendOtpIfPossible({ email, cookies });
    } catch (error) {
      console.error('Account sign-in resend failed:', error);
    }

    return respond(req, res, {
      status: 400,
      data: errorFormat({ otp: { error: 'expired_token' } }),
      redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
    });
  }

  return respond(req, res, {
    status: 400,
    data: errorFormat({ otp: { error: 'invalid_grant' } }),
    redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
  });
}

export default withAccountSession(async function handler(
  req: NextApiRequest & { session: IronSessionObject },
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return respond(req, res, {
      status: 405,
      headers: { Allow: 'POST' },
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: accountAuthRoutes.pages.login,
    });
  }

  const email = (req.body?.email ?? '').toString().trim();
  const otp = (req.body?.otp ?? '').toString().trim();

  if (!email) {
    return respond(req, res, {
      status: 400,
      data: errorFormat({ email: { error: 'required' } }),
      redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
    });
  }

  if (!otp || otp.length < 6) {
    return respond(req, res, {
      status: 400,
      data: errorFormat({ otp: { error: otp ? 'invalid' : 'required' } }),
      redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
    });
  }

  const cookies = new Cookies(req, res);
  const continuation_token = cookies.get(CONTINUATION_COOKIE);

  if (!continuation_token) {
    return respond(req, res, {
      status: 400,
      data: errorFormat({ otp: { error: 'expired_token' } }),
      redirect: accountAuthRoutes.pages.login,
    });
  }

  try {
    const tokenResponse = await submitSignInOtp(otp, continuation_token);
    if (!tokenResponse?.id_token) {
      const invalidGrantResponse = await maybeHandleInvalidGrant({
        tokenResponse,
        email,
        cookies,
        req,
        res,
      });
      if (invalidGrantResponse) return invalidGrantResponse;

      return respond(req, res, {
        status: 500,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
      });
    }

    req.session.isAccountAuthenticated = true;
    req.session.accountEmail = email;
    req.session.accountIdToken = tokenResponse.id_token;

    if (process.env.CI === 'true') {
      await ensureSelfServeE2eFirm(req.session);
    } else {
      const { firm } = await resolveAccountMainFirm(req.session);
      if (firm) {
        syncRegistrationSessionFromFirm(req.session, firm);
      }
    }

    await req.session.save();

    cookies.set(CONTINUATION_COOKIE, '', { path: '/' });
    cookies.set(EMAIL_COOKIE, '', {
      path: ACCOUNT_COOKIE_PATH,
      expires: new Date(0),
    });

    return respond(req, res, {
      data: { success: true },
      redirect: accountAuthRoutes.pages.accountHome,
    });
  } catch (error) {
    console.error('Account sign-in verify failed:', error);
    return respond(req, res, {
      status: 500,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
    });
  }
});
