import Head from 'next/head';

interface MetadataProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

export const CustomHead = ({ title }: MetadataProps) => {
  return (
    <Head>
      {/* temporary values */}
      <title>{`${title} - Superchain Bridge`}</title>
      <link rel='icon' href='/favicon.ico' type='image/x-icon' sizes='48x48' />

      <meta property='og:title' content={`${title} - Superchain Bridge`} />

      <meta name='twitter:image' content={'https://defi.sucks/share.jpg'} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@DeFi_Wonderland' />
      <meta name='twitter:creator' content='@DeFi_Wonderland' />
      <meta name='twitter:title' content={`${title} - Superchain Bridge`} />
      {/* <meta name='twitter:description' content={descriptionText} /> */}
      <meta name='twitter:image' content={'https://defi.sucks/share.jpg'} />
    </Head>
  );
};
