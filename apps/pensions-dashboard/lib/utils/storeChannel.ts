import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import {
  getMhpdSessionConfig,
  updateSessionConfigField,
} from './sessionConfig';

export type ChannelType = 'CONFIRMED' | 'UNCONFIRMED' | 'INCOMPLETE' | 'NONE';

export const setDashboardChannel = (
  { req, res }: GetServerSidePropsContext,
  channel?: ChannelType,
) => {
  const cookies = new Cookies(req, res);

  if (channel === 'NONE') {
    updateSessionConfigField(cookies, 'channel', '');
  } else if (channel) {
    updateSessionConfigField(cookies, 'channel', channel);
  }
};

export const getDashboardChannel = ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const cookies = new Cookies(req, res);
  const sessionConfig = getMhpdSessionConfig(cookies);

  return { channel: sessionConfig.channel };
};
