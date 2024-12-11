import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { encrypt } from 'lib/token';
import { verifyCredentials } from 'lib/verifyCredentials';
import { COOKIE_OPTIONS } from 'utils/getCookieData/getCookieData';

export type ErrorField = {
  field: string;
  type: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
    res.redirect(302, `/${language}/?${query}`);
    return;
  }

  // call the api to verify the credentials
  try {
    const result = await verifyCredentials({ username, password });
    cookies.set('accessToken', result?.access_token, {
      ...COOKIE_OPTIONS,
      expires: secondsToFutureDate(result?.expires_in),
    });

    res.redirect(302, `/${language}/money-adviser-network/start/q-1`);
  } catch (error) {
    errors.push({
      field: 'password',
      type: 'invalid',
    });

    const query = new URLSearchParams({
      errors: JSON.stringify(errors),
    }).toString();
    res.redirect(307, `/${language}/?${query}`);
  }
}

function validateRequest(req: NextApiRequest): ErrorField[] {
  const { username, password } = req.body;

  const errors = [];

  if (!username) {
    errors.push({
      field: 'username',
      type: 'required',
    });
  }

  if (username && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    errors.push({
      field: 'password',
      type: 'invalid',
    });
  }

  if (!password) {
    errors.push({
      field: 'password',
      type: 'required',
    });
  }

  return errors;
}

function secondsToFutureDate(seconds: number) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + seconds * 1000);
  return futureDate;
}
