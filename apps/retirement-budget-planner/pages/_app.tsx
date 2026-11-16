import { useRef } from 'react';

import { AppContext, AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';

import { SessionContextProvider } from 'context/SessionContextProvider';
import { getFullPageTitle } from 'data/navigationData';
import { getCanonicalUrl } from 'lib/util/getCanonicalUrl/getCanonicalUrl';
import { v4 as uuidv4 } from 'uuid';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';

type AppOwnProps = { nonce?: string };

function CustomApp({ Component, pageProps }: AppProps) {
  const { nonce } = pageProps;

  const params =
    typeof window !== 'undefined' && window.location?.search
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams('');

  let sessionId = params.get('sessionId');

  if (!sessionId) {
    sessionId = uuidv4().replace(/-/g, '');
  }

  const sessionIdRef = useRef<string>(sessionId);

  const { t, locale } = useTranslation();

  const pageTitle = getFullPageTitle({ tabName: '', t });
  const canonicalUrl = getCanonicalUrl(locale);

  const isGtmEnabled = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

  return (
    <SessionContextProvider sessionId={sessionIdRef.current}>
      <BasePageLayout>
        <Head>
          <title>{pageTitle}</title>
          {iconManifest.map((link) => (
            <link key={link.href} {...link} />
          ))}
          <link rel="canonical" href={canonicalUrl} />
          <meta name="robots" content="noindex,nofollow" />
        </Head>

        <Component {...pageProps} />

        <DocumentScripts
          nonce={nonce}
          useGenesysLiveChat={false}
          useGoogleTagManager={isGtmEnabled}
          useCivicCookieConsent={isGtmEnabled}
          useAdobeAnalytics={true}
        />
      </BasePageLayout>
    </SessionContextProvider>
  );
}

CustomApp.getInitialProps = async (
  context: AppContext,
): Promise<AppOwnProps & AppInitialProps> => {
  const { ctx } = context;
  const rawNonce = ctx.req?.headers['x-nonce'];
  const nonce = Array.isArray(rawNonce) ? rawNonce[0] : rawNonce;

  return {
    pageProps: {
      nonce,
    },
  };
};

export default CustomApp;
