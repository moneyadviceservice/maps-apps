import { Head, Html, Main, NextScript } from 'next/document';

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
      <body className="text-base text-gray-800 scroll-smooth">
        <Main />
        <NextScript />
        <DocumentScripts useGenesysLiveChat={false} />
      </body>
    </Html>
  );
}
