import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import useLanguage from '@maps-react/hooks/useLanguage';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

function CustomApp({ Component, pageProps }: AppProps) {
  const lang = useLanguage();

  const canonicalUrl = `https://www.moneyhelper.org.uk/${lang}/everyday-money/midlife-mot`;
  return (
    <BasePageLayout>
      <Head>
        <title>MoneyHelper Tools</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Component {...pageProps} />
      <InformizelyGetToolName />
      <InformizelyDevScript
        siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
      />
      <DocumentScripts
        useGenesysLiveChat={false}
        useGoogleTagManager={
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
        }
      />
    </BasePageLayout>
  );
}

export default CustomApp;
