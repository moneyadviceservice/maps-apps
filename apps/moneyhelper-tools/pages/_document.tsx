import { Html, Head, Main, NextScript } from 'next/document';
import { DocumentScripts } from '@maps-digital/shared/ui';

export default function Document(
  props: Readonly<{
    __NEXT_DATA__: { query: { language: string } };
  }>,
) {
  const lang = props.__NEXT_DATA__.query.language === 'cy' ? 'cy' : 'en';

  return (
    <Html lang={lang}>
      <Head />
      <body>
        <Main />
        <NextScript />
        <DocumentScripts />
      </body>
    </Html>
  );
}
