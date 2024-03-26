import { useMemo } from 'react';

import { useChain } from '~/hooks';
import { TokenData } from '~/types';

import TokenList from '@eth-optimism/tokenlist';
import extraTokens from '~/data/extraTokens.json';

export const useTokenList = () => {
  const tokenList = useMemo(() => [...TokenList.tokens, ...extraTokens] as TokenData[], []);
  const { fromChain, toChain } = useChain();

  const toTokens = useMemo(
    () => tokenList.filter((token: TokenData) => token.chainId === toChain?.id),
    [toChain?.id, tokenList],
  );

  const fromTokens = useMemo(() => {
    return tokenList.filter((token: TokenData) => {
      const filteredList =
        token.chainId === fromChain?.id &&
        // Also the token should exist on the 'To' chain
        toTokens.some((toToken: TokenData) => toToken.name === token.name && toToken.symbol === token.symbol);

      return filteredList;
    });
  }, [fromChain?.id, toTokens, tokenList]);

  return {
    fromTokens,
    toTokens,
  };
};
