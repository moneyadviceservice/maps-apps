import { useRef } from 'react';

import { AppProps } from 'next/app';
import Head from 'next/head';

import { SessionContextProvider } from 'context/SessionContextProvider';
import { v4 as uuidv4 } from 'uuid';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

import '@maps-react/common/styles/globals.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  const params =
    typeof window !== 'undefined' && window.location?.search
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams('');
  let sessionId = params.get('sessionId');
  if (!sessionId) {
    sessionId = uuidv4().replace(/-/g, '');
  }
  const sessionIdRef = useRef<string>(sessionId);
  return (
    <SessionContextProvider sessionId={sessionIdRef.current}>
      <BasePageLayout>
        <Head>
          <title>Welcome to retirement-budget-planner!</title>
        </Head>

        <Component {...pageProps} />
        <DocumentScripts useGenesysLiveChat={false} />
      </BasePageLayout>
    </SessionContextProvider>
  );
}

export default CustomApp;
