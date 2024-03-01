import Head from 'next/head';

interface MetadataProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
}

export const CustomHead = ({ title }: MetadataProps) => {
  const descriptionText =
    'Easily bridge between Ethereum Mainnet and any OP Chain in the Superchain ecosystem using the Superchain Bridge by Wonderland.';

  const bannerImage = 'https://superchain-bridge-dev.vercel.app/superchain_banner.jpg';

  return (
    <Head>
      {/* temporary values */}
      <title>{`${title} - Superchain Bridge`}</title>
      <link rel='icon' href='/favicon.ico' type='image/x-icon' sizes='48x48' />
      <meta name='description' content={descriptionText} />

      <meta property='og:title' content={`${title} - Superchain Bridge`} />
      <meta property='og:description' content={descriptionText} />

      <meta name='twitter:image' content={bannerImage} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@DeFi_Wonderland' />
      <meta name='twitter:creator' content='@DeFi_Wonderland' />
      <meta name='twitter:title' content={`${title} - Superchain Bridge`} />
      <meta name='twitter:description' content={descriptionText} />
      <meta name='twitter:image' content={bannerImage} />
      <meta name='robots' content='index, follow' />
    </Head>
  );
};
