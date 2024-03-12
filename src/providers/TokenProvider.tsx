import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, parseUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { useChain, useCustomClient, useTokenList } from '~/hooks';
import { TokenData } from '~/types';

type ContextType = {
  selectedToken: TokenData;
  setSelectedToken: (val: TokenData) => void;

  price: number;
  setPrice: (val: number) => void;

  toToken: TokenData | undefined;
  fromToken: TokenData | undefined;

  balance: string;

  ethBalance: string;

  amount: string;
  setAmount: (val: string) => void;

  allowance: string;
  setAllowance: (val: string) => void;

  approve: () => Promise<void>;

  parseTokenUnits: (val: string) => bigint;

  resetValues: () => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: StateProps) => {
  const { address } = useAccount();
  const { toTokens, fromTokens } = useTokenList();
  const { toChain, fromChain } = useChain();
  const { data } = useBalance({
    address,
    chainId: fromChain.id,
  });

  const {
    customClient: { from },
  } = useCustomClient();

  const ethToken = fromTokens.find((token) => token.symbol === 'ETH');
  const [selectedToken, setSelectedToken] = useState<TokenData>(ethToken!);
  const [price, setPrice] = useState<number>(1242.36);

  // amount is the value of the input field
  const [amount, setAmount] = useState<string>('');

  // balance, ethBalance and allowance are in wei units
  const [balance, setBalance] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('');
  const [allowance, setAllowance] = useState<string>('');

  // toToken is the token in the destination chain
  const toToken = useMemo(() => {
    if (!selectedToken) return;
    return toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
  }, [selectedToken, toChain.id, toTokens]);

  const fromToken = useMemo(() => {
    if (!toToken) return;
    return fromTokens.find((token) => token.symbol === toToken?.symbol && token.chainId === fromChain.id);
  }, [toToken, fromTokens, fromChain.id]);

  const parseTokenUnits = useCallback(
    (amount?: string) => {
      if (!amount || !selectedToken) return 0n;
      return parseUnits(amount, selectedToken.decimals);
    },
    [selectedToken],
  );

  const approve = async () => {
    try {
      const { request } = await from.public.simulateContract({
        account: address,
        abi: erc20Abi,
        address: selectedToken?.address as Address,
        functionName: 'approve',
        // temporary fixed spender
        args: [from.contracts.standardBridge, parseTokenUnits(amount)],
      });
      const hash = await from.wallet?.writeContract(request);

      if (!hash) throw new Error('Approve transaction failed');

      const receipt = await from.public.waitForTransactionReceipt({ hash: hash });

      console.log('Transaction confirmed,', receipt); // temporary log
    } catch (error) {
      console.warn(error);
    }
  };

  const resetValues = () => {
    setAmount('');
    setBalance('');
    setAllowance('');
  };

  useEffect(() => {
    if (!address || !from.contracts?.standardBridge) return;
    const tokenAddress = fromToken?.address as Address;

    from.public
      .multicall({
        contracts: [
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          },
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, from.contracts.standardBridge],
          },
        ],
      })
      .then(([balance, allowance]) => {
        setBalance(balance.result?.toString() || '');
        setAllowance(allowance.result?.toString() || '');
      });
  }, [address, from.contracts?.standardBridge, from.public, fromToken?.address]);

  useEffect(() => {
    if (selectedToken?.symbol === 'ETH') {
      return setEthBalance(data?.value.toString() || '');
    }
  }, [data?.value, selectedToken?.symbol]);

  useEffect(
    function reset() {
      if (!selectedToken) return;

      setBalance('');
      setAllowance('');
      setAmount('');
    },
    [selectedToken],
  );

  return (
    <TokenContext.Provider
      value={{
        selectedToken,
        setSelectedToken,
        balance,
        ethBalance,
        amount,
        setAmount,
        allowance,
        setAllowance,
        approve,
        parseTokenUnits,
        toToken,
        fromToken,
        price,
        setPrice,
        resetValues,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
