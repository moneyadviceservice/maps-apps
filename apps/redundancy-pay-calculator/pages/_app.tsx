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

  return (
    <BasePageLayout>
      <Head>
        <title>Redundancy Pay Calculator</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <link
          rel="canonical"
          href={`https://www.moneyhelper.org.uk/${lang}/work/losing-your-job/redundancy-pay-calculator`}
        />
        <meta name="robots" content="noindex,nofollow"></meta>
      </Head>
      <Component {...pageProps} />
      <InformizelyGetToolName />
      <InformizelyDevScript
        siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
      />
      <DocumentScripts useGenesysLiveChat={false} />
    </BasePageLayout>
  );
}

export default CustomApp;
