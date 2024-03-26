import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { Chain as ChainType } from 'viem';

import { replaceSpacesWithHyphens, supportedChains } from '~/utils';
import { CustomHead } from '~/components';
import { Landing } from '~/containers';
import { useChain } from '~/hooks';

const paths = supportedChains.map((chain) => ({
  params: {
    chain: replaceSpacesWithHyphens(chain.name),
  },
}));

export const getStaticPaths = async () => {
  return {
    paths: paths,
    fallback: true,
  };
};

type HomeProps = {
  title: string;
};

export const getStaticProps: GetStaticProps<HomeProps> = async ({ locale, params }: GetStaticPropsContext) => {
  const path = params?.chain;
  const chains = [...supportedChains] as ChainType[]; // This converts the readonly array to a mutable array to use the find method
  const title = chains.find((chain: ChainType) => replaceSpacesWithHyphens(chain.name) === path)?.name || '';

  const i18Config = await serverSideTranslations(locale ?? 'en', ['common']);

  return { props: { ...i18Config, title } };
};

const Chain = ({ title }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { toChain } = useChain();
  const router = useRouter();

  // Update the URL to reflect the 'From' chain
  useEffect(() => {
    if (toChain) router.replace({ pathname: `/[chain]`, query: { chain: replaceSpacesWithHyphens(toChain.name) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toChain]);

  return (
    <>
      <CustomHead title={title} />
      <Landing />
    </>
  );
};

export default Chain;
