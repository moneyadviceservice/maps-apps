import { NextApiRequest, NextApiResponse } from 'next';

import { PATHS } from 'CONSTANTS';
import Cookies from 'cookies';
import { encrypt, generateCSRFToken } from 'lib/token';
import { validateReferrer } from 'lib/validateReferrer';
import { COOKIE_OPTIONS } from 'utils/session/config';
import { getExpireTimeDate } from 'utils/session/getExpireTimeDate';
import { z } from 'zod';

import { rateLimitMiddleware } from '@maps-react/utils/rateLimitMiddleware';

export type ErrorField = {
  field: string;
  type: string;
};

const loginSchema = z.object({
  referrerId: z
    .string()
    .nonempty({ error: 'required' })
    .pipe(
      z.string().min(8, { message: 'invalid' }).max(11, { message: 'invalid' }),
    ),
  language: z.string().min(2).max(2).optional(),
});

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<NextApiResponse<unknown> | undefined> {
  const { referrerId, language } = req.body;
  const cookies = new Cookies(req, res);
  const errors = validateRequest(req);
  const initialSession = await encrypt({
    referrerId: referrerId,
    loggingIn: true,
  });

  cookies.set('session', initialSession, COOKIE_OPTIONS);
  cookies.set('data', '', COOKIE_OPTIONS);

  if (errors.length) {
    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(302, `/${language}/${PATHS.LOGIN}/?${query}`);
    return;
  }

  try {
    const result = await validateReferrer(referrerId);

    if (result?.error) {
      throw result;
    }

    const sessionExpireTimeMinutes = Number(process.env.SESSION_EXPIRY_TIME);
    const sessionExpireTime = getExpireTimeDate(sessionExpireTimeMinutes);
    const sessionRefreshTimeMinutes = Number(process.env.SESSION_REFRESH_TIME);
    const sessionRefreshTime = getExpireTimeDate(sessionRefreshTimeMinutes);

    const updatedSession = await encrypt({
      referrerId: referrerId,
      correlationId: result?.validatedReferrerId?.correlationId,
      organisationName: result?.validatedReferrerId?.message,
      organisationConfirmed: false,
      expires: sessionExpireTime,
      sessionRefreshTime: sessionRefreshTime, // Must be less than sessionExpireTime or the cookie will be gone before refresh can occur
      loggingIn: true, // Only set to false after organisation confirmation (auth-confim.ts)
    });

    const csrfToken = generateCSRFToken();

    cookies.set('session', updatedSession, {
      ...COOKIE_OPTIONS,
      expires: sessionExpireTime,
    });

    if (csrfToken) {
      cookies.set('csrfToken', csrfToken, {
        ...COOKIE_OPTIONS,
        expires: sessionExpireTime,
      });
    }

    res.redirect(307, `/${language}/${PATHS.LOGIN}`);
    return;
  } catch (error) {
    console.error('Error verifying credentials:', error);

    errors.push({
      field: 'referrerId',
      type: 'invalid',
    });

    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(307, `/${language}/${PATHS.LOGIN}/?${query}`);
    return;
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
  return Number(process.env.SESSION_EXPIRY_TIME);
}

export default rateLimitMiddleware(handler, 10);
