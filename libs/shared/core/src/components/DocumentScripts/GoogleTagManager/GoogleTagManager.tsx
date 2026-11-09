import Script from 'next/script';

declare global {
  // eslint-disable-next-line no-var
  var dataLayer: Record<string, unknown>[] | undefined;
  // eslint-disable-next-line no-var
  var gtag: ((...args: unknown[]) => void) | undefined;
}

type Props = {
  nonce?: string;
  useCivicCookieConsent?: boolean;
};

export const GoogleTagManager = ({ nonce, useCivicCookieConsent }: Props) => {
  const civicCookieConsent = () => {
    globalThis.dataLayer = globalThis.dataLayer || [];

    const dataLayer = globalThis.dataLayer;

    globalThis.gtag = function (...args: unknown[]) {
      dataLayer.push(args as unknown as Record<string, unknown>);
    };

    globalThis?.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
    });
    dataLayer.push({
      event: 'default_consent',
    });
  };

  return (
    <>
      <noscript
        data-testid="google-tag-manager-no-script"
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NQD7M4S" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />

      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=GTM-NQD7M4S`}
        strategy="afterInteractive"
        data-testid="google-tag-manager"
        nonce={nonce}
        onLoad={() => {
          useCivicCookieConsent && civicCookieConsent();
        }}
      />
    </>
  );
};
