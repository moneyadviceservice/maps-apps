import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';

interface DocumentProps extends DocumentInitialProps {
  nonce?: string;
}

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentProps> {
    const originalRenderPage = ctx.renderPage;
    const rawNonce = ctx.req?.headers['x-nonce'];
    const nonce = Array.isArray(rawNonce) ? rawNonce[0] : rawNonce || '';
    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;
    return (
      <Html lang="en">
        <Head nonce={nonce} />
        <body>
          <Main />
          <NextScript nonce={nonce} />

          <Script
            src={process.env.NEXT_PUBLIC_ADOBE_ANALYTICS_SCRIPT}
            strategy="beforeInteractive"
            data-testid="adobe-analytics"
            async={true}
            defer={false}
            nonce={nonce}
          />
          <Script
            id="genesys-live-chat"
            strategy="beforeInteractive"
            data-testid="genesys-live-chat"
            nonce={nonce}
          >
            {`
          (function(g,e,n,es,ys){g["_genesysJs"]=e;
          g[e]=g[e]||function(){(g[e].q=g[e].q||[]).push(arguments)};g[e].t=1*new Date;
          g[e].c=es;ys=document.createElement("script");ys.async=1;ys.src=n;ys.charset="utf-8";ys.nonce='nonce-${nonce}'
          document.head.appendChild(ys)})(window,"Genesys","https://apps.euw2.pure.cloud/genesys-bootstrap/genesys.min.js",
          {environment:"euw2",deploymentId:"d441c10a-d751-4b03-976d-788df9294b0a"});
          `}
          </Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
