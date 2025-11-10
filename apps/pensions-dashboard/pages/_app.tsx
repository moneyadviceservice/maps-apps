import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { useReportingObserver } from '@maps-react/csp-policy/hooks/useReportingObserver';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';

function CustomApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();

  useReportingObserver();

  return (
    <BasePageLayout>
      <Head>
        <title>{t('site.title')}</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Component {...pageProps} />

      <DocumentScripts
        useAdobeAnalytics={true}
        useCivicCookieConsent={false}
        useGenesysLiveChat={false}
        useGoogleTagManager={false}
      />
    </BasePageLayout>
  );
}

export default CustomApp;
