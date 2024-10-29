import type { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
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
  const sessionId = cookies.get('userSessionId') ?? '';
  const codeVerifier = cookies.get('codeVerifier') ?? '';
  const redirectUrl = cookies.get('redirectUrl') ?? '';

  // set redirect path to the loading page
  const redirectPath = `${PROTOCOL}${host}/${lang}/loading`;

  // set the authorization code cookie if present
  if (code) {
    cookies.set('authorizationCode', code as string, COOKIE_OPTIONS);
  }

  // Run POST to pensions-data if all required cookies and parameters are present
  try {
    await postPensionsData(
      sessionId,
      code as string,
      codeVerifier,
      redirectUrl,
    );

    // Redirect to the overview
    response.redirect(302, redirectPath);
  } catch (error) {
    console.error('Error posting pensions data:', error);
    response.status(500).end();
    return;
  }
}
