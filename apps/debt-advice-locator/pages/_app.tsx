import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        <title>Debt Advice Locator</title>
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
          rel="mask-icon text-magenta-500"
          href={'/icons/safari-pinned-tab.svg'}
        />
        <meta name="robots" content="noindex,nofollow"></meta>
      </Head>
      <Component {...pageProps} />
      <DocumentScripts useGenesysLiveChat={false} />
    </BasePageLayout>
  );
}

export default CustomApp;
