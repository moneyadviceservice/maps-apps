import type { NextApiRequest, NextApiResponse } from 'next';

import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../../lib/constants';
import { getAccessToken } from '../../lib/fetch/get-access-token';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  try {
    // get the access token
    const token = await getAccessToken(request.query.linkId as string);

    // set the token in a secure cookie
    const cookies = new Cookies(request, response);
    cookies.set('beaconId', token, {
      ...COOKIE_OPTIONS,
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    console.error('Failed to activate secure beta access:', error);
  }

  // redirect to welcome page
  response.redirect(302, '/');
}
