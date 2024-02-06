import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, getContract, parseUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

import { useChain, useCustomClient, useTokenList } from '~/hooks';
import { TokenData } from '~/types';

type ContextType = {
  selectedToken: TokenData | undefined;
  setSelectedToken: (val?: TokenData) => void;

  toToken: TokenData | undefined;

  balance: string;

  ethBalance: string;

  amount: string;
  setAmount: (val: string) => void;

  allowance: string;
  setAllowance: (val: string) => void;

  approve: () => Promise<void>;

  parseTokenUnits: (val: string) => bigint;
};

interface StateProps {
  children: React.ReactElement;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: StateProps) => {
  const { address } = useAccount();
  const { toTokens } = useTokenList();
  const { toChain } = useChain();
  const { data } = useBalance({
    address,
  });

  const {
    customClient: { from },
  } = useCustomClient();

  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();

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

  const tokenContract = useMemo(() => {
    if (!selectedToken || !from) return;
    if (selectedToken?.symbol === 'ETH') {
      return setEthBalance(data?.value.toString() || '');
    }
    return getContract({
      address: selectedToken?.address as Address,
      abi: erc20Abi,
      client: from,
    });
  }, [selectedToken, from, data]);

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

  useEffect(() => {
    if (!tokenContract || !address) return;
    // get balance
    tokenContract.read
      .balanceOf([address])
      .then((balance: bigint) => {
        setBalance(balance.toString());
      })
      .catch(() => {
        setBalance('');
      });

    // get allowance
    tokenContract.read
      .allowance([address, from.contracts.standardBridge]) // owner and spender
      .then((allowance: bigint) => {
        setAllowance(allowance.toString());
      })
      .catch(() => {
        setAllowance('');
      });
  }, [address, from.contracts.standardBridge, tokenContract]);

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
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
