import { createContext, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, getContract, parseUnits } from 'viem';
import { useAccount, useBalance, useWriteContract } from 'wagmi';

import { useCustomClient } from '~/hooks';
import { SEPOLIA_L1_STANDARD_BRIDGE, ZERO_ADDRESS } from '~/utils';
import { TokenData } from '~/types';

type ContextType = {
  selectedToken: TokenData | undefined;
  setSelectedToken: (val?: TokenData) => void;

  balance: string;

  ethBalance: string;

  amount: string;
  setAmount: (val: string) => void;

  allowance: string;
  setAllowance: (val: string) => void;

  approve: () => Promise<void>;
};

interface StateProps {
  children: React.ReactElement;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: StateProps) => {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const { data } = useBalance({
    address,
  });
  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();
  const [balance, setBalance] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('');
  const [allowance, setAllowance] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const {
    customClient: { from: wallet },
  } = useCustomClient();

  const tokenContract = useMemo(() => {
    if (!selectedToken || !wallet) return;
    if (selectedToken?.address === ZERO_ADDRESS) {
      return setEthBalance(data?.value.toString() || '');
    }
    return getContract({
      address: selectedToken?.address as Address,
      abi: erc20Abi,
      client: wallet,
    });
  }, [selectedToken, wallet, data]);

  useEffect(
    function getBalance() {
      if (!tokenContract || !address) return;
      tokenContract.read
        .balanceOf([address])
        .then((balance: bigint) => {
          setBalance(balance.toString());
        })
        .catch(() => {
          setBalance('');
        });
    },
    [address, tokenContract],
  );

  useEffect(
    function getAllowance() {
      if (!tokenContract || !address) return;
      if (!amount) return;
      tokenContract.read
        .allowance([address, SEPOLIA_L1_STANDARD_BRIDGE]) // owner and spender
        .then((allowance: bigint) => {
          setAllowance(allowance.toString());
        })
        .catch(() => {
          setAllowance('');
        });
    },
    [address, amount, balance, tokenContract],
  );

  useEffect(
    function resetBalance() {
      if (!selectedToken) return;
      setBalance('');
    },
    [selectedToken],
  );

  const approve = async () => {
    try {
      const result = await writeContractAsync({
        abi: erc20Abi,
        address: selectedToken?.address as Address,
        functionName: 'approve',
        // temporary fixed spender
        args: [SEPOLIA_L1_STANDARD_BRIDGE, parseUnits(amount, selectedToken?.decimals as number)],
      });

      // TODO: wait for the transaction to be processed
      console.log(result); // temporary log
    } catch (error) {
      console.warn(error);
    }
  };

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
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
