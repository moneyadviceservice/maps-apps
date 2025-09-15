import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'http';

import { deletePensionData } from '../fetch/delete-pension-data';
import { clearMhpdSessionConfig, getMhpdSessionConfig } from './sessionConfig';

export const logoutUser = async (
  request:
    | NextApiRequest
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      }),
  response: NextApiResponse | ServerResponse<IncomingMessage>,
): Promise<void> => {
  const cookies = new Cookies(request, response);
  const sessionConfig = getMhpdSessionConfig(cookies);

  // Delete pension data - if this throws, logout won't complete
  if (sessionConfig.userSessionId) {
    await deletePensionData({ userSessionId: sessionConfig.userSessionId });
  }

  // Clear all session cookies
  clearMhpdSessionConfig(cookies);

  cookies.set('codeVerifier', '');
};
