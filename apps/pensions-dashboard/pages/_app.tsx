import { useState } from 'react';

import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import Cookies from 'cookies';

import { AdobeAnalytics } from '@maps-react/core/components/DocumentScripts';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';
import { CookieConsent } from '@maps-react/vendor/components/CookieConsent/CookieConsent';

import { config } from '../data/civic-cookies';
import { AnalyticsProvider } from '../lib/contexts/AnalyticsContext';
import { getUserSessionFromCookies } from '../lib/utils/system';

type CustomAppProps = AppProps & {
  userSessionId: string;
};

function CustomApp({ Component, pageProps, userSessionId }: CustomAppProps) {
  const { t } = useTranslation();
  const [isCookieConsentOpen, setIsCookieConsentOpen] = useState(true);

  return (
    <BasePageLayout>
      <Head>
        <title>{t('site.title')}</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AnalyticsProvider initialUserSessionId={userSessionId}>
        <Component aria={isCookieConsentOpen} {...pageProps} />
      </AnalyticsProvider>

      <AdobeAnalytics />
      <CookieConsent isOpen={setIsCookieConsentOpen} config={config} />
    </BasePageLayout>
  );
}

CustomApp.getInitialProps = async (appContext: AppContext) => {
  let userSessionId = '';

  if (appContext.ctx.req && appContext.ctx.res) {
    const cookies = new Cookies(appContext.ctx.req, appContext.ctx.res);
    const userSession = getUserSessionFromCookies(cookies);
    userSessionId = userSession.userSessionId;
  }

  return {
    userSessionId,
  };
};

export default CustomApp;
