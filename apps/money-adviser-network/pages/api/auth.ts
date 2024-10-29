import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { verifyCredentials } from 'lib/verifyCredentials';
import { encrypt } from 'lib/token';

export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
} as Cookies.SetOption;

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

    cookies.set('accessToken', result?.accessToken, {
      ...COOKIE_OPTIONS,
      expires: result?.expiresOn as Date,
    });

    res.redirect(302, `/${language}/money-adviser-network/q-1`);
  } catch (error) {
    const errCode = (error as { errorCode: string })?.errorCode;
    if (errCode === 'invalid_request') {
      errors.push({
        field: 'username',
        type: 'invalid',
      });

      errors.push({
        field: 'password',
        type: 'invalid',
      });
    }

    if (errCode === 'invalid_grant') {
      errors.push({
        field: 'password',
        type: 'invalid',
      });
    }

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
      field: 'username',
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
