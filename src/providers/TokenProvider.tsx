import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import CCTP from '~/data/cctp.json';
import { useChain, useCustomClient, useTokenList } from '~/hooks';
import { TokenData, CctpType, BridgeData } from '~/types';
import { bridges } from '~/data';
import { fetchTokenPrice } from '~/utils';

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

  approve: (spender: string) => Promise<void>;

  parseTokenUnits: (val: string) => bigint;

  resetValues: () => void;

  availableBridges: BridgeData[];
  setAvailableBridges: (val: BridgeData[]) => void;

  bridgeData: BridgeData;
  setBridgeData: (val: BridgeData) => void;

  loadTokenData: (client: 'from' | 'to') => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: StateProps) => {
  const cctpData = CCTP as CctpType;

  const { address } = useAccount();
  const { toTokens, fromTokens } = useTokenList();
  const { toChain, fromChain } = useChain();

  const { customClient } = useCustomClient();

  // set default token to ETH if it exists, otherwise use the first token in the list
  const defaultToken = useMemo(() => {
    return fromTokens.filter((token) => token.symbol === 'ETH')[0] || fromTokens[0];
  }, [fromTokens]);

  const [selectedToken, setSelectedToken] = useState<TokenData>(defaultToken);
  console.log('selected', selectedToken);
  const [price, setPrice] = useState<number>(0);

  // amount is the value of the input field
  const [amount, setAmount] = useState<string>('');

  // balance, ethBalance and allowance are in wei units
  const [balance, setBalance] = useState<string>('');
  const [ethBalance, setEthBalance] = useState<string>('');
  const [allowance, setAllowance] = useState<string>('');

  const [availableBridges, setAvailableBridges] = useState<BridgeData[]>([bridges[0]]); // set op bridge as default
  const [bridgeData, setBridgeData] = useState<BridgeData>(bridges[0]);

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

  const approve = async (spender: string) => {
    try {
      const { request } = await customClient.from.public.simulateContract({
        account: address,
        abi: erc20Abi,
        address: selectedToken?.address as Address,
        functionName: 'approve',
        args: [spender as Address, parseTokenUnits(amount)],
      });
      const hash = await customClient.from.wallet?.writeContract(request);

      if (!hash) throw new Error('Approve transaction failed');

      const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

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

  const loadTokenData = useCallback(
    async (client: 'from' | 'to') => {
      if (!address || !customClient[client].contracts?.standardBridge) return;
      const tokenAddress = selectedToken?.address as Address;
      const contractAddress = selectedToken?.cctp
        ? cctpData[fromChain.id].tokenMessenger
        : customClient[client].contracts.standardBridge;
      const [balance, allowance] = await customClient[client].public.multicall({
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
            args: [address, contractAddress],
          },
        ],
      });
      const ethBalance = await customClient[client].public.getBalance({ address });

      setEthBalance(ethBalance.toString() || '');
      setBalance(balance.result?.toString() || '');
      setAllowance(allowance.result?.toString() || '');
    },
    [address, cctpData, customClient, fromChain.id, selectedToken?.address, selectedToken?.cctp],
  );

  useEffect(
    function reset() {
      if (!selectedToken) return;

      setBalance('');
      setAllowance('');
      setAmount('');
    },
    [selectedToken],
  );

  useEffect(() => {
    async function updateTokenPrice() {
      const price = await fetchTokenPrice({ chainId: selectedToken.chainId, address: selectedToken.address });
      setPrice(price);
    }

    if (selectedToken) {
      updateTokenPrice();
    }
  }, [selectedToken]);

  useEffect(() => {
    setSelectedToken(defaultToken);
  }, [defaultToken]);

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

        availableBridges,
        setAvailableBridges,
        bridgeData,
        setBridgeData,

        loadTokenData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
