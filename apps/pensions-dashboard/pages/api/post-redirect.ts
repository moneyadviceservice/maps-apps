import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';
import { v4 as uuidv4 } from 'uuid';

import { COOKIE_OPTIONS, PROTOCOL } from '../../lib/constants';
import { postRedirectDetails } from '../../lib/fetch';
import { PostResponseType } from '../../lib/types';
import { logoutUser } from '../../lib/utils/logoutUser';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
  } = request;
  const cookies = new Cookies(request, response);

  logoutUser(request, response);

  // generate a new user session ID
  const userSessionId = uuidv4();

  // generate a correlation ID
  const mhpdCorrelationId = uuidv4();

  // Run POST to redirect-details
  try {
    const data: PostResponseType = await postRedirectDetails({
      userSessionId,
      mhpdCorrelationId,
    });

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
    params.set('request_id', `${data.requestID}`);
    params.set(
      'redirect_uri',
      `${PROTOCOL}${host}/api/post-pension-data?lang=${request.body.lang}`,
    );

    // create the redirect URL
    const redirectUrl = `${data.redirectTargetUrl}?${params.toString()}`;

    // set the cookies
    cookies.set('codeVerifier', data.codeVerifier, COOKIE_OPTIONS);
    cookies.set('userSessionId', userSessionId, COOKIE_OPTIONS);
    cookies.set('redirectUrl', redirectUrl, COOKIE_OPTIONS);

    // redirect to the redirect URL
    response.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error fetching redirect details:', error);
    response.status(500).end();
    return;
  }
}
