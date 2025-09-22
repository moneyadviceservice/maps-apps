import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import {
  getMhpdSessionConfig,
  updateSessionConfigField,
} from './sessionConfig';

const removeLocale = (url: string) =>
  url
    .split('/')
    .filter((_, i) => i !== 1 || url.split('/')[1].length !== 2)
    .join('/') || '/';

export const storeCurrentUrl = (
  { req, res, resolvedUrl }: GetServerSidePropsContext,
  isSupport?: boolean,
) => {
  const cookies = new Cookies(req, res);
  // remove the locale from the resolvedUrl,
  const currentUrl = removeLocale(resolvedUrl);

  if (isSupport) {
    // store support url in the consolidated cookie
    updateSessionConfigField(cookies, 'supportCurrentUrl', currentUrl);
  } else {
    // set the current url to be the back link before we update it
    const sessionConfig = getMhpdSessionConfig(cookies);
    const backLink = sessionConfig.currentUrl || null;

    // clear the support current url so that we do not return a non-JS user
    // to support if bumped from a non support page
    updateSessionConfigField(cookies, 'supportCurrentUrl', '');
    // store in the consolidated cookie
    updateSessionConfigField(cookies, 'currentUrl', currentUrl);

    return { backLink, currentUrl };
  }
};
