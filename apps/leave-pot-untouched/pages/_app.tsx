import { AppProps } from 'next/app';
import Head from 'next/head';

import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        <title>Leave Pot Untouched Calculator</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Component {...pageProps} />
    </BasePageLayout>
  );
}

export default CustomApp;
