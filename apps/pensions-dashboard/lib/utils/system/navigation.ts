import type { NextApiRequest, NextApiResponse } from 'next';
import { GetServerSidePropsContext } from 'next';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

import Cookies from 'cookies';
import { IncomingMessage, ServerResponse } from 'node:http';

import { deletePensionData } from '../../api/pension-data-service';
import {
  clearMhpdSessionConfig,
  getMhpdSessionConfig,
  setMhpdSessionConfig,
} from './session';

export type ChannelType =
  | 'CONFIRMED'
  | 'UNCONFIRMED'
  | 'INCOMPLETE'
  | 'TIMELINE'
  | 'NONE';

/**
 * Removes the locale from the URL path (e.g., /en/page -> /page)
 */
const removeLocale = (url: string) =>
  url
    .split('/')
    .filter((_, i) => i !== 1 || url.split('/')[1].length !== 2)
    .join('/') || '/';

/**
 * Gets the dashboard channel from the session configuration
 */
export const getDashboardChannel = ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const cookies = new Cookies(req, res);
  const sessionConfig = getMhpdSessionConfig(cookies);

  return { channel: sessionConfig.channel };
};

/**
 * Stores the current URL in the session configuration and optionally updates the channel
 */
export const storeCurrentUrl = (
  { req, res, resolvedUrl }: GetServerSidePropsContext,
  channel?: ChannelType,
  isSupport?: boolean,
) => {
  const cookies = new Cookies(req, res);
  const currentUrl = removeLocale(resolvedUrl);

  const sessionConfig = getMhpdSessionConfig(cookies);
  const backLink = sessionConfig.currentUrl || null;

  if (isSupport) {
    const updatedConfig = {
      ...sessionConfig,
      supportCurrentUrl: currentUrl,
    };
    setMhpdSessionConfig(cookies, updatedConfig);
  } else {
    const updatedConfig = {
      ...sessionConfig,
      supportCurrentUrl: '',
      currentUrl: currentUrl,
      channel: channel === 'NONE' ? '' : channel ?? sessionConfig.channel,
    };

    setMhpdSessionConfig(cookies, updatedConfig);

    return { backLink, currentUrl };
  }
};

/**
 * Logs out a user by deleting their pension data and clearing session cookies
 */
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
