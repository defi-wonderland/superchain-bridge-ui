import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Address, erc20Abi, getContract } from 'viem';
import { useAccount } from 'wagmi';

import { TOKEN_LIST_URL, ZERO_ADDRESS } from '~/utils';
import { useChain, useCustomClient } from '~/hooks';
import { TokenData } from '~/types';

const getTokens = async () => {
  const tokens = await fetch(TOKEN_LIST_URL);
  return tokens.json();
};

export const useTokens = () => {
  const { address } = useAccount();
  const { fromChain } = useChain();
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();
  const [balance, setBalance] = useState<string>('');
  const { fromProvider } = useCustomClient();

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['tokens'],
    queryFn: getTokens,
  });

  const tokenContract = useMemo(() => {
    if (!selectedToken || !fromProvider) return;
    if (selectedToken?.address === ZERO_ADDRESS) return;
    return getContract({
      address: selectedToken?.address as Address,
      abi: erc20Abi,
      client: fromProvider,
    });
  }, [selectedToken, fromProvider]);

  useEffect(
    function setTokensWhenFetched() {
      if (data) {
        setBalance('');
        setTokens(data.tokens.filter((token: TokenData) => token.chainId === fromChain?.id));
      }
    },
    [data, fromChain?.id],
  );

  useEffect(
    function loadBalance() {
      if (!tokenContract || !address) return;

      tokenContract.read
        .balanceOf([address])
        .then((balance) => {
          console.log(balance);
          setBalance(balance.toString());
        })
        .catch((error) => {
          setBalance('');
          console.warn('Error fetching balance: ', error);
        });
    },
    [address, tokenContract],
  );

  return {
    tokens,
    isLoading,
    isFetching,
    isError,
    error,
    selectedToken,
    setSelectedToken,
    tokenContract,
    balance,
  };
};
