// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* 
            CSP via meta tag: allows unsafe-eval 
            (this runs as soon as the HTML is parsed)
          */}
          <meta
            httpEquiv="Content-Security-Policy"
            content="
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self';
            "
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
