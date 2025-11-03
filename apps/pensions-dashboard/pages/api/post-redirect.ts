import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { v4 as uuidv4 } from 'uuid';

import { postRedirectDetails } from '../../lib/api/maps-cda-service';
import { COOKIE_OPTIONS, PROTOCOL } from '../../lib/constants';
import { PostResponseType } from '../../lib/types';
import { logoutUser, setMhpdSessionConfig } from '../../lib/utils/system';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
  } = request;
  const cookies = new Cookies(request, response);

  // Clean up any existing pensions data in the backend
  await logoutUser(request, response);

  // generate a new user session ID
  // the value then is used as the mhpdCorrelationId when making API calls
  const userSessionId = uuidv4();

  // Run POST to redirect-details
  try {
    const data: PostResponseType = await postRedirectDetails({
      userSessionId,
    });

    const redirectUri = `${PROTOCOL}${host}/api/post-pension-data`;

    // create the URL parameters
    const params = new URLSearchParams();
    params.set('client_id', process.env.MHPD_CLIENT_ID ?? '');
    params.set('rqp_token', `${data.rqp}`);
    params.set('scope', `${data.scope}`);
    params.set('response_type', `${data.responseType}`);
    params.set('prompt', `${data.prompt}`);
    params.set('service', `${data.service}`);
    params.set('code_challenge_method', `${data.codeChallengeMethod}`);
    params.set('code_challenge', `${data.codeChallenge}`);
    params.set('request_id', `${data.requestId}`);
    params.set('redirect_uri', `${redirectUri}`);

    // create the redirect URL
    const redirectUrl = `${data.redirectTargetUrl}?${params.toString()}`;

    // set the cookies
    cookies.set('codeVerifier', data.codeVerifier, COOKIE_OPTIONS);
    setMhpdSessionConfig(cookies, {
      userSessionId,
      redirectUrl: redirectUri,
    });

    // redirect to the redirect URL
    response.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error fetching redirect details:', error);
    response.status(500).end();
    return;
  }
}
