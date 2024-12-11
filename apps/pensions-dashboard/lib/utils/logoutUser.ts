import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

export const logoutUser = (
  request:
    | NextApiRequest
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      }),
  response: NextApiResponse | ServerResponse<IncomingMessage>,
) => {
  const cookies = new Cookies(request, response);

  cookies.set('userSessionId', '');
  cookies.set('codeVerifier', '');
  cookies.set('redirectUrl', '');
  cookies.set('authorizationCode', '');
  cookies.set('currentUrl', '');
  cookies.set('currentSupportUrl', '');
  cookies.set('channel', '');
};
