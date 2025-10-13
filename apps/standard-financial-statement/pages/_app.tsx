import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

import '../public/civic-cookie.scss';

const iconLinks = [
  // Standard Favicons
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '96x96',
    href: '/favicon-96x96.png',
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
    href: '/favicon-16x16.png',
  },
  // Apple Touch Icons
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon-180x180.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '167x167',
    href: '/apple-touch-icon-167x167.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: '/apple-touch-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    href: '/apple-touch-icon.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: '/apple-touch-icon-120x120.png',
  },
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico',
  },
  // Android Chrome Icons
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/android-chrome-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '128x128',
    href: '/android-chrome-128x128.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '48x48',
    href: '/android-chrome-48x48.png',
  },
];

const metaTags = [
  // Windows Tiles
  {
    name: 'msapplication-TileImage',
    content: '/mstile-270x270.png',
  },
  {
    name: 'msapplication-TileColor',
    content: '#00283e',
  },
  {
    name: 'msapplication-square70x70logo',
    content: '/mstile-70x70.png',
  },
  {
    name: 'msapplication-square270x270logo',
    content: '/mstile-270x270.png',
  },
];

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        {iconLinks.map(({ rel, sizes, href, type }) => (
          <link key={href} rel={rel} sizes={sizes} href={href} type={type} />
        ))}
        {metaTags.map(({ name, content }) => (
          <meta key={name} name={name} content={content} />
        ))}
      </Head>
      <Component {...pageProps} />
      <DocumentScripts
        useGenesysLiveChat={false}
        useCivicCookieConsent={true}
      />
    </BasePageLayout>
  );
}

export default CustomApp;
