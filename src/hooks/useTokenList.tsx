import { useMemo } from 'react';

import { useChain } from '~/hooks';
import { TokenData } from '~/types';

import TokenList from '@eth-optimism/tokenlist';

export const useTokenList = () => {
  const { fromChain } = useChain();

  const tokens = useMemo(
    () => TokenList.tokens.filter((token: TokenData) => token.chainId === fromChain?.id),
    [fromChain?.id],
  );

  return {
    tokens,
  };
};
