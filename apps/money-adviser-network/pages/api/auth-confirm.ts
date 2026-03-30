import { NextApiRequest, NextApiResponse } from 'next';

import { PATHS, QUESTION_PREFIX } from 'CONSTANTS';
import Cookies from 'cookies';
import { decrypt, encrypt } from 'lib/token';
import { COOKIE_OPTIONS } from 'utils/session/config';
import { getExpireTimeDate } from 'utils/session/getExpireTimeDate';

import { rateLimitMiddleware } from '@maps-react/utils/rateLimitMiddleware';

export type ErrorField = {
  field: string;
  type: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<NextApiResponse<unknown> | undefined> {
  const { language, confirmOrganisation } = req.body;

  const cookies = new Cookies(req, res);

  const errors = [];

  let session = null;
  if (req.cookies.session) {
    session = (await decrypt(req.cookies.session)).payload;
  }

  if (!session || !confirmOrganisation) {
    errors.push({
      field: 'confirmOrganisation',
      type: 'required',
    });
  }

  if (errors.length) {
    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(302, `/${language}/${PATHS.LOGIN}/?${query}`);
    return;
  }

  try {
    const sessionExpireTimeMinutes = Number(process.env.SESSION_EXPIRY_TIME);
    const sessionExpireTime = getExpireTimeDate(sessionExpireTimeMinutes);
    const sessionRefreshTimeMinutes = Number(process.env.SESSION_REFRESH_TIME);
    const sessionRefreshTime = getExpireTimeDate(sessionRefreshTimeMinutes);

    const newSession = await encrypt({
      ...session,
      organisationConfirmed: true,
      expires: sessionExpireTime,
      sessionRefreshTime: sessionRefreshTime, // Must be less than sessionExpireTime or the cookie will be gone before refresh can occur
      loggingIn: false,
    });

    cookies.set('session', newSession, {
      ...COOKIE_OPTIONS,
      expires: sessionExpireTime,
    });

    res.redirect(302, `/${language}/${PATHS.START}/${QUESTION_PREFIX}1`);

    return;
  } catch (error) {
    console.error('Error verifying organisation:', error);

    errors.push({
      field: 'confirmOrganisation',
      type: 'required',
    });

    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(307, `/${language}/${PATHS.LOGIN}/?${query}`);
    return;
  }
}

export default rateLimitMiddleware(handler, 10);
