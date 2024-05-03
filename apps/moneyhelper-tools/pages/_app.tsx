import { AppProps } from 'next/app';
import Head from 'next/head';
import { BasePageLayout, DocumentScripts } from '@maps-digital/shared/ui';
import { useAdobeDataLayer } from '@maps-digital/shared/hooks';

function CustomApp({ Component, pageProps }: AppProps) {
  useAdobeDataLayer(process.env.toolName ?? '');

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
        <meta name="robots" content="noindex" />
      </Head>
      <Component {...pageProps} />
      <DocumentScripts />
    </BasePageLayout>
  );
}

export default CustomApp;
