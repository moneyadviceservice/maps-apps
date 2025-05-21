import { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { CookieData } from 'data/questions/types';
import { decrypt, encrypt } from 'lib/token';
import { FLOW } from 'utils/getQuestions';

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
  currentFlow?: FLOW,
) {
  const cookies = new Cookies(req, res);
  const cookie = cookies.get(name);
  let cookieData;
  if (cookie && value) {
    const currentValue = (await decrypt(cookie)).payload;
    const currentFlowValue =
      currentFlow && (currentValue[currentFlow] as CookieData);

    cookieData = currentFlow
      ? {
          ...currentValue,
          [currentFlow]: {
            ...currentFlowValue,
            ...value,
          },
        }
      : {
          ...currentValue,
          ...value,
        };
  } else {
    cookieData = currentFlow ? { [currentFlow]: value } : value;
  }
  const data = await encrypt(cookieData);
  cookies.set(name, data, COOKIE_OPTIONS);

  return cookieData;
}

export function clearCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  name: string,
) {
  const cookies = new Cookies(req, res);
  cookies.set(name, '', COOKIE_OPTIONS);
}

export function getExpireTimeDate(time: number) {
  const now = new Date();
  return new Date(now.getTime() + time * 60 * 1000);
}
