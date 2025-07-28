import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { setCanonicalUrl } from 'utils/setCanonicalUrl';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const path = (router.asPath === '/' ? '' : router.asPath).split('?')[0];
  const canonicalUrl = setCanonicalUrl(path);
  return (
    <BasePageLayout>
      <Head>
        <title>MoneyHelper Tools</title>
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
        <link
          rel="mask-icon"
          href={'/icons/safari-pinned-tab.svg'}
          color="#C82A87"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex,nofollow" />
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
