import { AppProps } from 'next/app';
import Head from 'next/head';

import { BudgetPlannerDataProvider } from 'context/BudgetPlannerDataProvider';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';
function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BudgetPlannerDataProvider>
      <BasePageLayout>
        <Head>
          <title>Budget Planner</title>
          {iconManifest.map((link) => (
            <link key={link.href} {...link} />
          ))}
          <meta name="robots" content="noindex,nofollow"></meta>
        </Head>
        <Component {...pageProps} />
        <InformizelyGetToolName />
        <InformizelyDevScript
          siteId={process.env.NEXT_PUBLIC_DEV_FEEDBACK_SITE_ID ?? ''}
        />
        <DocumentScripts
          useGenesysLiveChat={false}
          useGoogleTagManager={
            process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
          }
        />
      </BasePageLayout>
    </BudgetPlannerDataProvider>
  );
}

export default CustomApp;
