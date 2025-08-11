import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { useAdobeDataLayer } from '@maps-react/hooks/useAdobeDataLayer';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

function CustomApp({ Component, pageProps }: AppProps) {
  useAdobeDataLayer(process.env.toolName ?? '');

  return (
    <BasePageLayout>
      <Head>
        <title>Pension Wise Digital</title>
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
        <link
          rel="canonical"
          href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise"
        />
        <meta name="robots" content="noindex" />
      </Head>
      <Component {...pageProps} />
      <InformizelyGetToolName />
      <InformizelyDevScript
        siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
      />
      <DocumentScripts
        useGoogleTagManager={
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
        }
      />
    </BasePageLayout>
  );
}

export default CustomApp;
