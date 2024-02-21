import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v13-pagesRouter';
import type { DocumentHeadTagsProps } from '@mui/material-nextjs/v13-pagesRouter';
import { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from 'next/document';

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang='en'>
      <Head>
        <DocumentHeadTags {...props} />
        {/* temporary values */}
        <link rel='icon' href='/favicon.ico' type='image/x-icon' sizes='48x48' />

        <meta property='og:title' content='Superchain Bridge' />

        <meta name='twitter:image' content={'https://defi.sucks/share.jpg'} />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@DeFi_Wonderland' />
        <meta name='twitter:creator' content='@DeFi_Wonderland' />
        <meta name='twitter:title' content='Superchain Bridge' />
        {/* <meta name='twitter:description' content={descriptionText} /> */}
        <meta name='twitter:image' content={'https://defi.sucks/share.jpg'} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  ) as JSX.Element;
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
