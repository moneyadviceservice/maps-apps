import { AppProps } from 'next/app';
import Head from 'next/head';

import { getCanonicalUrl } from 'utils/getCanonicalUrl/getCanonicalUrl';

import useLanguage from '@maps-react/hooks/useLanguage';
//import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

function CustomApp({ Component, pageProps }: AppProps) {
  const lang = useLanguage();
  const canonicalUrl = getCanonicalUrl(lang);
  return (
    <BasePageLayout>
      <Head>
        <title>Salary Calculator</title>
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
    </BasePageLayout>
  );
}

export default CustomApp;
