import { AppProps } from 'next/app';
import Head from 'next/head';

import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        <title>Evidence Hub</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Component {...pageProps} />
    </BasePageLayout>
  );
}

export default CustomApp;
