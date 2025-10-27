import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

interface MyDocumentProps {
  nonce?: string;
  language: string;
}

function DocumentPage({ nonce, language }: Readonly<MyDocumentProps>) {
  return (
    <Html lang={language}>
      <Head nonce={nonce} />
      <body className="text-base text-gray-800 scroll-smooth">
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
}

DocumentPage.getInitialProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  const rawNonce = ctx.req?.headers['x-nonce'];
  const nonce = Array.isArray(rawNonce) ? rawNonce[0] : rawNonce;
  const language = ctx.query.language === 'cy' ? 'cy' : 'en';

  return { ...initialProps, nonce, language };
};

export default DocumentPage;
