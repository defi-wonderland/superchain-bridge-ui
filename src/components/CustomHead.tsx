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
      <title>{`${title} - Superchain Bridge`}</title>
    </Head>
  );
};
