import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { LanguageProvider } from '@maps-react/hooks/useLanguage';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

type IconLink = {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
};

const appleTouchIconSizes = ['120x120', '152x152', '167x167', '180x180'];
const pngIconSizes = ['48x48', '128x128', '196x196', '96x96', '32x32', '16x16'];

const faviconLinks: IconLink[] = [
  ...appleTouchIconSizes.map((size) => ({
    rel: 'apple-touch-icon',
    sizes: size,
    href: `/favicon/Icon${size}.png`,
  })),
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon/favicon.ico',
  },
  ...pngIconSizes.map((size) => ({
    rel: 'icon',
    type: 'image/png',
    sizes: size,
    href: `/favicon/Icon${size}.png`,
  })),
];

const faviconMetaTags = [
  // Windows Tiles
  {
    name: 'msapplication-TileImage',
    content: '/favicon/Icon270x270.png',
  },
  {
    name: 'msapplication-TileColor',
    content: '#00283e',
  },
  {
    name: 'msapplication-square70x70logo',
    content: '/favicon/Icon70x70.png',
  },
  {
    name: 'msapplication-square270x270logo',
    content: '/favicon/Icon270x270.png',
  },
];

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        <title>Pension Calculator</title>
        {faviconLinks.map(({ rel, sizes, href, type }) => (
          <link key={href} rel={rel} sizes={sizes} href={href} type={type} />
        ))}
        {faviconMetaTags.map(({ name, content }) => (
          <meta key={name} name={name} content={content} />
        ))}
      </Head>
      <DocumentScripts
        useGenesysLiveChat={false}
        useGoogleTagManager={
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
        }
        useCivicCookieConsent={
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
        }
      />
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
      <InformizelyGetToolName />
      <InformizelyDevScript
        siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
      />
    </BasePageLayout>
  );
}

export default CustomApp;
