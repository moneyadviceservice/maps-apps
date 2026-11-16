import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

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
          src={process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT}
          strategy="beforeInteractive"
          data-testid="adobe-analytics"
        />
      </body>
    </Html>
  );
}
