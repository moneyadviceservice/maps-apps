import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';

import '@maps-react/common/styles/globals.scss';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <Head>
        <title>Welcome to retirement-budget-planner!</title>
      </Head>

      <Component {...pageProps} />
      <DocumentScripts useGenesysLiveChat={false} />
    </BasePageLayout>
  );
}

export default CustomApp;
