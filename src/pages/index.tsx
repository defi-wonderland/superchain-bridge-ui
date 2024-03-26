import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Landing } from '~/containers';
import { useChain } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

const Home = () => {
  const { toChain } = useChain();
  const router = useRouter();

  // Update the URL to reflect the 'From' chain
  useEffect(() => {
    if (toChain) router.replace({ pathname: `/[chain]`, query: { chain: replaceSpacesWithHyphens(toChain.name) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toChain]);

  return (
    <>
      <Head>
        <title>Superchain Bridge</title>
      </Head>
      <Landing />
    </>
  );
};

export default Home;
