import { Head, Html, Main, NextScript } from 'next/document';

export default function Document(
  props: Readonly<{
    __NEXT_DATA__: { query: { lang: string } };
  }>,
) {
  const lang = props.__NEXT_DATA__.query.lang === 'cy' ? 'cy' : 'en';
  return (
    <Html lang={lang} className="no-js">
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');",
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
