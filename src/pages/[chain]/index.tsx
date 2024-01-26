import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { CustomHead } from '~/components';
import { useChain } from '~/hooks';

import Landing from '~/pages/landing';
import { replaceSpacesWithHyphens, supportedChains } from '~/utils';

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

export const getStaticProps = async (context: { params: { chain: string } }) => {
  const path = context.params?.chain;
  const title = supportedChains.find((chain) => replaceSpacesWithHyphens(chain.name) === path)?.name || '';

  return { props: { title } };
};

const Chain = ({ title }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { fromChain } = useChain();
  const router = useRouter();

  // Update the URL to reflect the 'From' chain
  useEffect(() => {
    if (fromChain) router.replace({ pathname: `/[chain]`, query: { chain: replaceSpacesWithHyphens(fromChain.name) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain]);

  return (
    <>
      <CustomHead title={title} />
      <Landing />
    </>
  );
};

export default Chain;
