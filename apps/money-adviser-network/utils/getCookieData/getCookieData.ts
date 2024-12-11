import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { decrypt, encrypt } from 'lib/token';

export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
} as Cookies.SetOption;

export async function setCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
  value: {
    [key: string]: Record<string, string | object>;
  },
) {
  const cookies = new Cookies(req, res);
  const cookie = cookies.get(name);
  if (cookie && value) {
    const currentValue = (await decrypt(cookie)).payload;

    const cookieData = {
      ...currentValue,
      ...value,
    };

    const data = await encrypt(cookieData);
    cookies.set(name, data, COOKIE_OPTIONS);
    return cookieData;
  } else {
    const data = await encrypt(value);
    cookies.set(name, data, COOKIE_OPTIONS);
    return value;
  }
}

export function clearCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
) {
  const cookies = new Cookies(req, res);
  cookies.set(name, '', COOKIE_OPTIONS);
}
