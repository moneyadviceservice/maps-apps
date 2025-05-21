import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../constants';

export type ChannelType = 'CONFIRMED' | 'UNCONFIRMED' | 'INCOMPLETE' | 'NONE';

export const setDashboardChannel = (
  { req, res }: GetServerSidePropsContext,
  channel?: ChannelType,
) => {
  const cookies = new Cookies(req, res);

  if (channel === 'NONE') {
    cookies.set('channel', '');
  } else {
    cookies.set('channel', channel, COOKIE_OPTIONS);
  }
};

export const getDashboardChannel = ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const cookies = new Cookies(req, res);
  return { channel: cookies.get('channel') ?? '' };
};
