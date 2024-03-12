import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { Landing } from '~/containers';
import { useChain } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';

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
