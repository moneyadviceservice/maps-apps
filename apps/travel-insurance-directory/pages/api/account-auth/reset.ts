import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { accountAuthCookies } from 'lib/accountAuth/cookies';
import { accountAuthRoutes } from 'lib/accountAuth/routes';
import { respond } from 'utils/api/respond';

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
      data: { error: true },
      redirect: accountAuthRoutes.pages.login,
    });
  }

  const cookies = new Cookies(req, res);
  cookies.set(CONTINUATION_COOKIE, '', {
    path: '/',
    expires: new Date(0),
  });
  cookies.set(EMAIL_COOKIE, '', {
    path: ACCOUNT_COOKIE_PATH,
    expires: new Date(0),
  });

  return respond(req, res, {
    data: { success: true },
    redirect: accountAuthRoutes.pages.login,
  });
}
