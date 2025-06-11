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
        <title>Stamp Duty Land Tax Calculator</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <meta name="robots" content="noindex,nofollow" />

        <link
          rel="canonical"
          href={`https://www.moneyhelper.org.uk/${lang}/homes/buying-a-home/stamp-duty-calculator`}
        />
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
