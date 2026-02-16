import { AppProps } from 'next/app';
import Head from 'next/head';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';
import useLanguage from '@maps-react/hooks/useLanguage';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { iconManifest } from '@maps-react/utils/iconManifest';
import { ContactUsWidget } from '@maps-react/vendor/components/ContactUsWidget';
import {
  InformizelyDevScript,
  InformizelyGetToolName,
} from '@maps-react/vendor/components/InformizelyScript';

const useNewContactUsWidget =
  process.env.NEXT_PUBLIC_USE_NEW_CONTACT_US_WIDGET === 'true';

function CustomApp({ Component, pageProps }: AppProps) {
  const lang = useLanguage();

  const canonicalUrl = `https://www.moneyhelper.org.uk/${lang}/savings/how-to-save/savings-calculator`;
  return (
    <BasePageLayout>
      <Head>
        <title>Savings calculator</title>
        {iconManifest.map((link) => (
          <link key={link.href} {...link} />
        ))}
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex,nofollow" />
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
      {useNewContactUsWidget && (
        <ContactUsWidget
          src={process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_SRC}
          deploymentId={{
            en: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_EN,
            cy: process.env.NEXT_PUBLIC_CONTACT_US_WIDGET_DEPLOYMENT_ID_CY,
          }}
        />
      )}
    </BasePageLayout>
  );
}

export default CustomApp;
