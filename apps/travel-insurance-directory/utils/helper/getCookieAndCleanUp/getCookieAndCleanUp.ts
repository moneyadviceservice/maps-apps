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

      cleanup && cookies.set('form_error', '', { expires: new Date(0) });
    } catch (e) {
      console.error('Failed to parse error cookie', e);
    }
  }

  return cookieData;
};
