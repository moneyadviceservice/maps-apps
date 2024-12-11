import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';

export default function Document(
  props: Readonly<{
    __NEXT_DATA__: { query: { language: string } };
  }>,
) {
  const lang = props.__NEXT_DATA__.query.language === 'cy' ? 'cy' : 'en';

  return (
    <Html lang={lang}>
      <Head />
      <body className="text-base text-gray-800">
        <Main />
        <NextScript />
        <Script
          id="informizely-script-tag"
          type="text/javascript"
          strategy="afterInteractive"
        >
          {`
          var IzWidget = IzWidget || {};
          IzWidget['insitez.ready'] = function (api) {
            var toolName = '';
            if (window.adobeDataLayer && window.adobeDataLayer.length > 0) {
              toolName = window.adobeDataLayer[0].tool.toolName || 'unknown';
            }
            api.set('custom', { 'tool-name': toolName });
          };
        `}
        </Script>
        <DocumentScripts useGenesysLiveChat={false} />
      </body>
    </Html>
  );
}
