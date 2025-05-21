import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';
function CustomApp({ Component, pageProps }: AppProps) {
  const iconLinks = [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/icons/apple-touch-icon-180x180.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/icons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/icons/favicon-16x16.png',
    },
    {
      rel: 'mask-icon',
      href: '/icons/safari-pinned-tab.svg',
      color: '#C82A87',
    },
  ];

  return (
    <BasePageLayout>
      <Head>
        <title>Compare Bank Accounts</title>
        {iconLinks.map(({ rel, sizes, href, type, color }) => (
          <link
            key={href}
            rel={rel}
            sizes={sizes}
            href={href}
            type={type}
            color={color}
          />
        ))}
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
