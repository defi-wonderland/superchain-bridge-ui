import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useChainId } from 'wagmi';

import Landing from './landing';

const Home = () => {
  const chainId = useChainId();
  const router = useRouter();

  useEffect(() => {
    if (chainId) router.replace({ pathname: `/[chain]`, query: { chain: chainId } });
  }, [chainId, router]);

  return <Landing />;
};

export default Home;
