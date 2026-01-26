import Script from 'next/script';

import { AdobeAnalytics } from './AdobeAnalytics';
import { GoogleTagManager } from './GoogleTagManager';

type DocumentScriptsProps = {
  useCivicCookieConsent?: boolean;
  useGoogleTagManager?: boolean;
  useGenesysLiveChat?: boolean;
  useAdobeAnalytics?: boolean;
  nonce?: string;
};

export const DocumentScripts = ({
  useCivicCookieConsent = true, // requires gtm
  useGoogleTagManager = true,
  useGenesysLiveChat = true,
  useAdobeAnalytics = true,
  nonce,
}: DocumentScriptsProps) => {
  if (useCivicCookieConsent && !useGoogleTagManager) {
    console.warn('Civic cookie requires gtm');
  }

  return (
    <>
      {useGoogleTagManager && (
        <GoogleTagManager
          nonce={nonce}
          useCivicCookieConsent={useCivicCookieConsent}
        />
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
      {useAdobeAnalytics && <AdobeAnalytics nonce={nonce} />}
    </>
  );
};
