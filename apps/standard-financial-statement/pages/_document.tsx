import { Head, Html, Main, NextScript } from 'next/document';

interface MyDocumentProps {
  __NEXT_DATA__: { query: { language: string } };
}

function DocumentPage({ __NEXT_DATA__ }: Readonly<MyDocumentProps>) {
  const lang = __NEXT_DATA__.query.language === 'cy' ? 'cy' : 'en';

  return (
    <Html lang={lang}>
      <Head />
      <body className="text-base text-gray-800 scroll-smooth">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default DocumentPage;
