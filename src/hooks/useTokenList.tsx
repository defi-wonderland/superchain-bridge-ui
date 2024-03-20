import { useMemo } from 'react';

import { useChain } from '~/hooks';
import { TokenData } from '~/types';

import TokenList from '@eth-optimism/tokenlist';
import extraTokens from '~/data/extraTokens.json';

export const useTokenList = () => {
  const tokenList = useMemo(() => [...TokenList.tokens, ...extraTokens] as TokenData[], []);
  const { fromChain, toChain } = useChain();

  const fromTokens = useMemo(
    () => tokenList.filter((token: TokenData) => token.chainId === fromChain?.id),
    [fromChain?.id, tokenList],
  );

  const toTokens = useMemo(
    () => tokenList.filter((token: TokenData) => token.chainId === toChain?.id),
    [toChain?.id, tokenList],
  );

  return {
    fromTokens,
    toTokens,
  };
};
