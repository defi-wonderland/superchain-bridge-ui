import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Landing } from '~/containers';
import { useChain } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';

const Home = () => {
  const { fromChain } = useChain();
  const router = useRouter();

  // Update the URL to reflect the 'From' chain
  useEffect(() => {
    if (fromChain) router.replace({ pathname: `/[chain]`, query: { chain: replaceSpacesWithHyphens(fromChain.name) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromChain]);

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
