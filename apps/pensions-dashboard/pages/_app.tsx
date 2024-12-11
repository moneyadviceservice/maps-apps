import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

function CustomApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  return (
    <BasePageLayout>
      <Head>
        <title>{t('site.title')}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={'/icons/apple-touch-icon-180x180.png'}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={'/icons/favicon-32x32.png'}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={'/icons/favicon-16x16.png'}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Component {...pageProps} />
      <DocumentScripts
        useAdobeAnalytics={false}
        useCivicCookieConsent={false}
        useGenesysLiveChat={false}
        useGoogleTagManager={false}
      />
    </BasePageLayout>
  );
}

export default CustomApp;
