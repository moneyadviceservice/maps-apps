import { AppProps } from 'next/app';

import { AdobeAnalytics } from '@maps-react/core/components/DocumentScripts';
import { BasePageLayout } from '@maps-react/layouts/BasePageLayout';
import { CookieBanner } from '@maps-react/mps/components/CookieBanner';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <BasePageLayout>
      <AdobeAnalytics />
      <Component {...pageProps} />
      <CookieBanner />
    </BasePageLayout>
  );
}

export default CustomApp;
