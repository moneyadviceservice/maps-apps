import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { v4 as uuidv4 } from 'uuid';

import { COOKIE_OPTIONS, PROTOCOL } from '../../lib/constants';
import { postPensionsData } from '../../lib/fetch';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
    query: { code, lang },
  } = request;

  // get the cookies
  const cookies = new Cookies(request, response);
  const userSessionId = cookies.get('userSessionId') ?? '';
  const codeVerifier = cookies.get('codeVerifier') ?? '';
  const redirectUrl = cookies.get('redirectUrl') ?? '';

  // set redirect path to the loading page
  const redirectPath = `${PROTOCOL}${host}/${lang}/welcome`;

  // set the authorization code cookie if present
  if (code) {
    cookies.set('authorizationCode', code as string, COOKIE_OPTIONS);
  }

  // generate a correlation ID
  const mhpdCorrelationId = uuidv4();

  // Run POST to pensions-data if all required cookies and parameters are present
  try {
    await postPensionsData({
      userSessionId,
      authorizationCode: code as string,
      codeVerifier,
      redirectUrl,
      mhpdCorrelationId,
      clientId: process.env.MHPD_CLIENT_ID ?? '',
      clientSecret: process.env.MHPD_CLIENT_SECRET ?? '',
    });

    // save the load times in a cookie

    // Redirect to the overview
    response.redirect(302, redirectPath);
  } catch (error) {
    console.error('Error posting pensions data:', error);
    response.status(500).end();
    return;
  }
}
