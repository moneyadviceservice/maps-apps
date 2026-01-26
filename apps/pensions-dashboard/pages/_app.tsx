import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';

import Cookies from 'cookies';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';

import { AnalyticsProvider } from '../lib/contexts/AnalyticsContext';
import { getUserSessionFromCookies } from '../lib/utils/system';

type CustomAppProps = AppProps & {
  userSessionId: string;
};

function CustomApp({ Component, pageProps, userSessionId }: CustomAppProps) {
  const { t } = useTranslation();

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
        <Component {...pageProps} />
      </AnalyticsProvider>
      <DocumentScripts
        useAdobeAnalytics={true}
        useCivicCookieConsent={false}
        useGenesysLiveChat={false}
        useGoogleTagManager={false}
      />
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
