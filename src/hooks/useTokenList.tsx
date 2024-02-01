import { useMemo } from 'react';

import { useChain } from '~/hooks';
import { TokenData } from '~/types';

import TokenList from '@eth-optimism/tokenlist';

export const useTokenList = () => {
  const { fromChain, toChain } = useChain();

  const fromTokens = useMemo(
    () => TokenList.tokens.filter((token: TokenData) => token.chainId === fromChain?.id),
    [fromChain?.id],
  );

  const toTokens = useMemo(
    () => TokenList.tokens.filter((token: TokenData) => token.chainId === toChain?.id),
    [toChain?.id],
  );

  return {
    fromTokens,
    toTokens,
  };
};
