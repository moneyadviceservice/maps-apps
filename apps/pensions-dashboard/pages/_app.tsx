import { AppProps } from 'next/app';
import Head from 'next/head';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { SITE_TITLE } from '../lib/constants';
import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        <title>{SITE_TITLE}</title>
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
