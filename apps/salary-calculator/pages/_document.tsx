import { Head, Html, Main, NextScript } from 'next/document';

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
      </body>
    </Html>
  );
}
