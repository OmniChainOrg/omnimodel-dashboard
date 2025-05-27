<<<<<<< HEAD
import Document, { Html, Head, Main, NextScript } from 'next/document';

=======
// pages/_document.tsx
>>>>>>> ea991a9f689f5d66d0a404894263ecb0a3858ba2
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
<<<<<<< HEAD
          {/* CSP via meta tag to allow unsafe-eval */}
=======
          {/* 
            CSP via meta tag: allows unsafe-eval 
            (this runs as soon as the HTML is parsed)
          */}
>>>>>>> ea991a9f689f5d66d0a404894263ecb0a3858ba2
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
