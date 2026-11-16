import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

interface MyDocumentProps {
  language: string;
}

function DocumentPage({ language }: Readonly<MyDocumentProps>) {
  return (
    <Html lang={language}>
      <Head />
      <body className="text-base text-gray-800 scroll-smooth">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

DocumentPage.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  const language = ctx.query.language === 'cy' ? 'cy' : 'en';

  return { ...initialProps, language };
};

export default DocumentPage;
