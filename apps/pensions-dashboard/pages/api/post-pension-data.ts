import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { COOKIE_OPTIONS, PROTOCOL } from '../../lib/constants';
import { getClaimsGatheringRedirect, postPensionsData } from '../../lib/fetch';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
    query: { code, scenarioEndPoint },
  } = request;

  // get the cookies
  const cookies = new Cookies(request, response);
  const userSessionId = cookies.get('userSessionId') ?? '';
  const codeVerifier = cookies.get('codeVerifier') ?? '';
  const redirectUrl = cookies.get('redirectUrl') ?? '';

  // set the authorization code cookie if present
  if (code) {
    cookies.set('authorizationCode', code as string, COOKIE_OPTIONS);
  }

  if (scenarioEndPoint) {
    cookies.set('scenarioEndPoint', scenarioEndPoint as string, COOKIE_OPTIONS);
  }

  // STEP 1 - POST to /pensions-data
  // to start the process of retrieving pensions data
  try {
    await postPensionsData({
      userSessionId,
      authorizationCode: code as string,
      codeVerifier,
      redirectUrl,
      clientId: process.env.MHPD_CLIENT_ID ?? '',
      clientSecret: process.env.MHPD_CLIENT_SECRET ?? '',
    });
  } catch (error) {
    console.error('Error POST /pensions-data:', error);
    response.status(500).end();
    return;
  }

  // STEP 2 - GET /claims-gathering-redirect
  // then redirect to the claims-gathering-redirect URL, passing through the query parameters
  try {
    const data = await getClaimsGatheringRedirect({
      userSessionId,
    });

    const params = new URLSearchParams();
    params.set('client_id', process.env.MHPD_CLIENT_ID ?? '');
    params.set('request_id', data.requestId);
    params.set(
      'claims_redirect_uri',
      `${PROTOCOL}${host}/api/post-pensions-data-retrieval`,
    );
    params.set('rqp_token', data.rqp);
    params.set('ticket', data.ticket);
    params.set('state', 'FIND');

    response.redirect(302, `${data.claimsRedirectUrl}?${params.toString()}`);
  } catch (error) {
    console.error('Error GET /claims-gathering-redirect:', error);
    response.status(500).end();
    return;
  }
}
