import Script from 'next/script';

type DocumentScriptsProps = {
  useCivicCookieConsent?: boolean;
  useGoogleTagManager?: boolean;
  useGenesysLiveChat?: boolean;
  useAdobeAnalytics?: boolean;
  nonce?: string;
};
export const DocumentScripts = ({
  useCivicCookieConsent = true,
  useGoogleTagManager = true,
  useGenesysLiveChat = true,
  useAdobeAnalytics = true,
  nonce,
}: DocumentScriptsProps) => {
  return (
    <>
      {useGoogleTagManager && (
        <noscript
          data-testid="google-tag-manager-no-script"
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NQD7M4S" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
      )}

      {useCivicCookieConsent && (
        <Script
          id="civic-cookie-consent-default"
          strategy="afterInteractive"
          data-testid="civic-cookie-consent-default"
          nonce={nonce}
        >
          {`
          window.dataLayer = window.dataLayer || []; 
          function gtag(){dataLayer.push(arguments);}
          window.gtag && window.gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied'
          });
          dataLayer.push({
            'event': 'default_consent'
          });
          `}
        </Script>
      )}
      {useGoogleTagManager && (
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          data-testid="google-tag-manager"
          nonce={nonce}
        >
          {`
          window.dataLayer = window.dataLayer || []; 
          console.log('GTM script loaded');
          if(!window.gtag) function gtag(){window.dataLayer.push(arguments);}
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NQD7M4S');
          `}
        </Script>
      )}
      {useGenesysLiveChat && (
        <Script
          id="genesys-live-chat"
          strategy="beforeInteractive"
          data-testid="genesys-live-chat"
          nonce={nonce}
        >
          {`
          (function(g,e,n,es,ys){g["_genesysJs"]=e;
          g[e]=g[e]||function(){(g[e].q=g[e].q||[]).push(arguments)};g[e].t=1*new Date;
          g[e].c=es;ys=document.createElement("script");ys.async=1;ys.src=n;ys.charset="utf-8";
          document.head.appendChild(ys)})(window,"Genesys","https://apps.euw2.pure.cloud/genesys-bootstrap/genesys.min.js",
          {environment:"euw2",deploymentId:"d441c10a-d751-4b03-976d-788df9294b0a"});
          `}
        </Script>
      )}
      {useAdobeAnalytics && (
        <Script
          src={process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT}
          strategy="beforeInteractive"
          data-testid="adobe-analytics"
          nonce={nonce}
        />
      )}
    </>
  );
};
