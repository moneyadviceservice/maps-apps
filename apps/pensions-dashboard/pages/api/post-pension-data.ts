import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { PROTOCOL } from '../../lib/constants';
import { getClaimsGatheringRedirect, postPensionsData } from '../../lib/fetch';
import {
  getMhpdSessionConfig,
  MhpdSessionConfig,
  setMhpdSessionConfig,
} from '../../lib/utils/sessionConfig';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const {
    headers: { host },
    query: { code },
  } = request;

  // get the session configuration
  const cookies = new Cookies(request, response);
  const { userSessionId, redirectUrl } = getMhpdSessionConfig(cookies);
  const codeVerifier = cookies.get('codeVerifier') ?? '';

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
    // Set the session start time.
    // Adjust 10 seconds back to allow for backend response so we dont timeout too late
    // PLANNED: Backend will provide session start timestamp in the POST /pensions-data response in an upcoming release.
    const updateFields: Partial<MhpdSessionConfig> = {};
    if (code) {
      updateFields.authorizationCode = code as string;
    }
    updateFields.sessionStart = (Date.now() - 10000).toString();
    if (Object.keys(updateFields).length > 0) {
      setMhpdSessionConfig(cookies, updateFields);
    }
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
