import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

export const getCookieAndCleanUp = (
  { req, res }: GetServerSidePropsContext,
  cookie: string,
  cleanup = false,
) => {
  const cookies = new Cookies(req, res);
  const errorCookie = cookies.get(cookie);

  let cookieData = null;
  if (errorCookie) {
    try {
      cookieData = JSON.parse(errorCookie);

      cleanup &&
        cookies.set(cookie, '', {
          expires: new Date(0),
          path: '/',
          sameSite: 'lax',
        });
    } catch (e) {
      console.error('Failed to parse error cookie', e);
    }
  }

  return cookieData;
};
