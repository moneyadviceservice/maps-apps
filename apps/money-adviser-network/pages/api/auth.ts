import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { getConfigurationSetting } from 'lib/featureConfig';
import { encrypt, extractUserId, generateCSRFToken } from 'lib/token';
import { verifyCredentials } from 'lib/verifyCredentials';
import {
  COOKIE_OPTIONS,
  getExpireTimeDate,
} from 'utils/getCookieData/getCookieData';
import { z } from 'zod';

import { rateLimitMiddleware } from '@maps-react/utils/rateLimitMiddleware';
import { PATHS, QUESTION_PREFIX } from 'CONSTANTS';

/**
 * API handler for authentication.
 *
 * This function handles the authentication process for the user. It validates the request,
 * verifies the credentials, sets the necessary cookies, and redirects the user based on the result.
 *
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 *
 * @returns void
 */

export type ErrorField = {
  field: string;
  type: string;
};

const loginSchema = z.object({
  username: z.string().min(1, 'required'),
  password: z.string().min(1, 'required'),
  language: z.string().optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password, language } = req.body;
  const cookies = new Cookies(req, res);
  const errors = validateRequest(req);
  const session = await encrypt({
    username: username,
    password: password,
  });

  cookies.set('user', session, COOKIE_OPTIONS);
  cookies.set('data', '', COOKIE_OPTIONS);

  if (errors.length) {
    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(302, `/${language}/${PATHS.LOGIN}/?${query}`);
    return;
  }

  // call the api to verify the credentials
  try {
    const result = await verifyCredentials({ username, password });

    if (result?.error) {
      throw result;
    }

    const expireTimeConfig = await getExpireTimeConfig();
    const expireTime = getExpireTimeDate(expireTimeConfig);

    const session = await encrypt({
      token: result?.access_token,
      expires: expireTime,
      expireConfig: expireTimeConfig,
    });

    const sessionRefresh = await encrypt({
      refresh_token: result?.refresh_token,
      expires: expireTime,
      expireConfig: expireTimeConfig,
    });

    const userId = await extractUserId(result?.id_token);

    const csrfToken = generateCSRFToken();

    cookies.set('accessToken', session, {
      ...COOKIE_OPTIONS,
      expires: expireTime,
    });

    cookies.set('refreshToken', sessionRefresh, {
      ...COOKIE_OPTIONS,
      expires: expireTime,
    });

    if (userId) {
      cookies.set('userId', userId, {
        ...COOKIE_OPTIONS,
        expires: expireTime,
      });
    }

    if (csrfToken) {
      cookies.set('csrfToken', csrfToken, {
        ...COOKIE_OPTIONS,
        expires: expireTime,
      });
    }

    const user = await encrypt({
      username: username,
      expires: expireTime,
    });

    cookies.set('user', user, COOKIE_OPTIONS);

    res.redirect(302, `/${language}/${PATHS.START}/${QUESTION_PREFIX}1`);
  } catch (error) {
    errors.push({
      field: 'password',
      type: 'invalid',
    });

    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(307, `/${language}/${PATHS.LOGIN}/?${query}`);
  }
}

export async function generateAndSetCsrfToken(cookies: Cookies) {
  const expireTimeConfig = await getExpireTimeConfig();
  const expireTime = getExpireTimeDate(expireTimeConfig);

  const csrfToken = generateCSRFToken();

  cookies.set('csrfToken', csrfToken, {
    ...COOKIE_OPTIONS,
    expires: expireTime,
  });

  return csrfToken;
}

function validateRequest(req: NextApiRequest): ErrorField[] {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return result.error.issues.map((issue) => ({
      field: issue.path[0] as string,
      type: issue.message,
    }));
  }

  return [];
}

export async function getExpireTimeConfig() {
  try {
    const expireTime = await getConfigurationSetting('man-login-expire');
    return Number(expireTime);
  } catch (error) {
    return Number(process.env.ENTRA_EXPIRY_TIME);
  }
}

export default rateLimitMiddleware(handler);
