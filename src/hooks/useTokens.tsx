import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useChain } from '~/hooks';
import { TokenData } from '~/types';
import { TOKEN_LIST_URL } from '~/utils';

const getTokens = async () => {
  const tokens = await fetch(TOKEN_LIST_URL);
  return tokens.json();
};

export const useTokens = () => {
  const { fromChain } = useChain();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenData>();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['tokens'],
    queryFn: getTokens,
  });

  useEffect(() => {
    data && setTokens(data.tokens.filter((token: TokenData) => token.chainId === fromChain?.id));
  }, [data, fromChain?.id]);

  return {
    tokens,
    isLoading,
    isFetching,
    isError,
    error,
    selectedToken,
    setSelectedToken,
  };
};
