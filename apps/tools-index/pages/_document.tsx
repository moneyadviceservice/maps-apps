import { Head, Html, Main, NextScript } from 'next/document';

import { DocumentScripts } from '@maps-react/core/components/DocumentScripts';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="text-base text-gray-800">
        <Main />
        <NextScript />
        <DocumentScripts useGenesysLiveChat={false} />
      </body>
    </Html>
  );
}
