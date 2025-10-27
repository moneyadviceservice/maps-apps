import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { getMhpdSessionConfig, setMhpdSessionConfig } from './sessionConfig';
import { ChannelType } from './storeChannel';

const removeLocale = (url: string) =>
  url
    .split('/')
    .filter((_, i) => i !== 1 || url.split('/')[1].length !== 2)
    .join('/') || '/';

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
