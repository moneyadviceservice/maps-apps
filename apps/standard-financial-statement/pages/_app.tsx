import { AppProps } from 'next/app';
import Head from 'next/head';

import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

const iconLinks = [
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon.ico',
  },
];

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        {iconLinks.map(({ rel, sizes, href, type }) => (
          <link key={href} rel={rel} sizes={sizes} href={href} type={type} />
        ))}
      </Head>
      <Component {...pageProps} />
    </BasePageLayout>
  );
}

export default CustomApp;
