import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { TOKEN_LIST_URL } from '~/utils';
import { useChain } from '~/hooks';
import { TokenData } from '~/types';

const getTokens = async () => {
  const tokens = await fetch(TOKEN_LIST_URL);
  return tokens.json();
};

export const useTokenList = () => {
  const { fromChain } = useChain();
  const [tokens, setTokens] = useState<TokenData[]>([]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['tokens'],
    queryFn: getTokens,
  });

  useEffect(
    function setTokensWhenFetched() {
      if (data) {
        setTokens(data.tokens.filter((token: TokenData) => token.chainId === fromChain?.id));
      }
    },
    [data, fromChain?.id],
  );

  return {
    tokens,
    isLoading,
    isFetching,
    isError,
    error,
  };
};
