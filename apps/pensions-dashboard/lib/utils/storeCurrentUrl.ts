import { GetServerSidePropsContext } from 'next';

import Cookies from 'cookies';

import { COOKIE_OPTIONS } from '../constants';

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
    // store support url in a cookie
    cookies.set('supportCurrentUrl', currentUrl, COOKIE_OPTIONS);
  } else {
    // set the current url to be the back link before we update it
    const backLink = cookies.get('currentUrl') ?? null;

    // clear the support current url so that we do not return a non-JS user
    // to support if bumped from a non support page
    cookies.set('supportCurrentUrl', '');
    // store in a cookie
    cookies.set('currentUrl', currentUrl, COOKIE_OPTIONS);

    return { backLink, currentUrl };
  }
};
