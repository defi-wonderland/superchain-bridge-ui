import { useEffect, useState } from 'react';
import { Abi, AbiFunction, AbiItem, encodeFunctionData, isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useTransactionData } from '~/hooks';
import { useAbi } from './useAbi';

export const useFunctionMethod = () => {
  const { getAbi } = useAbi();
  const { address } = useAccount();
  const { setTo, to, customTransactionType, setData } = useTransactionData();

  const [abi, setAbi] = useState('');

  const [functions, setFunctions] = useState<AbiFunction[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction | undefined>();
  const [functionParams, setFunctionParams] = useState<Record<string, string> | undefined>();

  const handleSetSelectedFunction = (functionMethod?: AbiFunction) => {
    setSelectedFunction(functionMethod);
    setFunctionParams(undefined);
  };

  useEffect(() => {
    if (address && isAddress(address) && customTransactionType !== 'custom-tx') setTo(address);
  }, [address, customTransactionType, setTo]);

  useEffect(() => {
    if (!abi && isAddress(to))
      getAbi(to).then((fetchedAbi) => {
        if (fetchedAbi) setAbi(fetchedAbi);
      });
  }, [abi, to, getAbi]);

  useEffect(() => {
    if (!abi) return;
    const functions = JSON.parse(abi).filter(
      (item: AbiItem) => item.type === 'function' && item.stateMutability !== 'view' && item.stateMutability !== 'pure',
    );
    setFunctions(functions);
    setSelectedFunction(functions[0]);
    setFunctionParams(undefined);
  }, [abi]);

  useEffect(() => {
    if (!functionParams || !abi) return;
    const args = Object.values(functionParams);
    try {
      const data = encodeFunctionData({
        abi: JSON.parse(abi) as Abi,
        functionName: selectedFunction?.name || '',
        args: args,
      });
      setData(data);
    } catch (error) {
      console.warn('Error encoding function data:', error);
    }
  }, [abi, functionParams, selectedFunction?.name, setData]);

  return {
    abi,
    setAbi,
    handleSetSelectedFunction,
    functions,
    selectedFunction,
    functionParams,
    setFunctionParams,
  };
};
