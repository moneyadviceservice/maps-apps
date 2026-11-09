import { Head, Html, Main, NextScript } from 'next/document';

export default function Document(
  props: Readonly<{
    __NEXT_DATA__: { query: { lang: string } };
  }>,
) {
  const lang = props.__NEXT_DATA__.query.lang === 'cy' ? 'cy' : 'en';
  return (
    <Html lang={lang}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
