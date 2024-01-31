import { createContext, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, getContract } from 'viem';
import { useAccount } from 'wagmi';

import { useCustomClient } from '~/hooks';
import { ZERO_ADDRESS } from '~/utils';
import { TokenData } from '~/types';

type ContextType = {
  selectedToken: TokenData | undefined;
  setSelectedToken: (val?: TokenData) => void;

  balance: bigint | undefined;

  amount: string;
  setAmount: (val: string) => void;

  allowance: bigint | undefined;
  setAllowance: (val?: bigint) => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: StateProps) => {
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<TokenData | undefined>();

  const [balance, setBalance] = useState<bigint>();
  const [allowance, setAllowance] = useState<bigint>();
  const [amount, setAmount] = useState<string>('');

  const {
    providers: {
      from: { wallet },
    },
  } = useCustomClient();

  const tokenContract = useMemo(() => {
    if (!selectedToken || !wallet) return;
    if (selectedToken?.address === ZERO_ADDRESS) return;
    return getContract({
      address: selectedToken?.address as Address,
      abi: erc20Abi,
      client: wallet,
    });
  }, [selectedToken, wallet]);

  useEffect(
    function getBalance() {
      if (!tokenContract || !address) return;
      tokenContract.read
        .balanceOf([address])
        .then((balance: bigint) => {
          setBalance(balance);
        })
        .catch(() => {
          setBalance(undefined);
        });
    },
    [address, tokenContract],
  );

  useEffect(
    function getAllowance() {
      if (!tokenContract || !address) return;
      if (!amount) return;
      tokenContract.read
        .allowance([address, address]) // owner and spender
        .then((allowance: bigint) => {
          setAllowance(allowance);
        })
        .catch(() => {
          setAllowance(undefined);
        });
    },
    [address, amount, balance, tokenContract],
  );

  // TODO:
  // getTransferData function
  // approve function

  // const handleApprove = async () => {
  //   try {
  //     console.log({ selectedToken, tokenContract });
  //     const result = await tokenContract?.simulate?.approve(
  //       ['0x80B7064b28cD538FaD771465984aa799d87A1187', 100000000000000n],
  //       { account: '0x80B7064b28cD538FaD771465984aa799d87A1187' },
  //     );
  //     const test2 = encodeFunctionData({
  //       abi: result?.request.abi as Abi,
  //       functionName: result?.request.functionName,
  //       args: result?.request.args,
  //     });

  //     console.log(result, selectedToken, test2);
  //   } catch (error) {
  //     console.warn(error);
  //   }
  // };
  // const handleTransfer = async () => {
  //   try {
  //     const result = await tokenContract?.simulate?.transfer([
  //       '0x80B7064b28cD538FaD771465984aa799d87A1187',
  //       100000000000000n,
  //     ]);
  //     console.log(result);
  //   } catch (error) {
  //     console.warn(error);
  //   }
  // };

  return (
    <TokenContext.Provider
      value={{
        selectedToken,
        setSelectedToken,
        balance,
        amount,
        setAmount,
        allowance,
        setAllowance,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
