import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { accountAuthCookies } from 'lib/accountAuth/cookies';
import { accountAuthRoutes } from 'lib/accountAuth/routes';
import { errorFormat } from 'utils/api/errorFormat';
import { respond } from 'utils/api/respond';

import {
  getSignInChallenge,
  startSignIn,
} from '@maps-react/entra-id/entraIdService';
import { validateEmail } from '@maps-react/utils/validateEmail';

const { continuation: CONTINUATION_COOKIE, loginEmail: EMAIL_COOKIE } =
  accountAuthCookies;

const ACCOUNT_COOKIE_PATH = '/account';

export default async function handler(
  req: NextApiRequest,
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
  if (!email) {
    return respond(req, res, {
      status: 400,
      data: errorFormat({ email: { error: 'required' } }),
      redirect: accountAuthRoutes.pages.login,
    });
  }

  if (!validateEmail(email)) {
    return respond(req, res, {
      status: 400,
      data: errorFormat({ email: { error: 'invalid' } }),
      redirect: accountAuthRoutes.pages.login,
    });
  }

  try {
    const startResponse = await startSignIn(email, 'oob redirect');
    if (!startResponse.success) {
      console.warn('Account sign-in startSignIn failed', {
        email,
        error: startResponse.error,
        error_description: (startResponse as { error_description?: string })
          .error_description,
      });
      return respond(req, res, {
        status: 400,
        data: errorFormat({
          email: { error: 'user_not_found' },
        }),
        redirect: accountAuthRoutes.pages.login,
      });
    }

    const challengeResponse = await getSignInChallenge(
      email,
      startResponse.continuation_token,
      'oob redirect',
    );
    if (!challengeResponse.success) {
      return respond(req, res, {
        status: 500,
        data: errorFormat({ page: { error: 'general_error' } }),
        redirect: accountAuthRoutes.pages.login,
      });
    }

    const cookies = new Cookies(req, res);
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
    });

    return respond(req, res, {
      data: { success: true, otpSent: true },
      redirect: `${accountAuthRoutes.pages.login}?showOtp=true`,
    });
  } catch (error) {
    console.error('Account sign-in start failed:', error);
    return respond(req, res, {
      status: 500,
      data: errorFormat({ page: { error: 'general_error' } }),
      redirect: accountAuthRoutes.pages.login,
    });
  }
}
