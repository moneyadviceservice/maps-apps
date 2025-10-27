import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { getMhpdSessionConfig } from './sessionConfig';

export type ChannelType =
  | 'CONFIRMED'
  | 'UNCONFIRMED'
  | 'INCOMPLETE'
  | 'TIMELINE'
  | 'NONE';

export const getDashboardChannel = ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const cookies = new Cookies(req, res);
  const sessionConfig = getMhpdSessionConfig(cookies);

  return { channel: sessionConfig.channel };
};
