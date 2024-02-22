import { useCallback, useEffect, useState } from 'react';
import { isAddress } from 'viem';

import { chainData, getContractAbi } from '~/utils';
import { getConfig } from '~/config';
import { useChain } from './useContext';

export const useAbi = () => {
  const [abi, setAbiData] = useState<{ [key: string]: string }>({});
  const { ETHERSCAN_KEY } = getConfig();
  const { toChain } = useChain();

  const aliasKey = 'superchain-abis';

  const getAbi = useCallback(
    async (contractAddress: string) => {
      const jsonData = localStorage.getItem(contractAddress);
      const data = jsonData ? JSON.parse(jsonData) : {};

      if (data[contractAddress]) return data[contractAddress];

      if (!isAddress(contractAddress)) return '';

      const fetchedAbi = await getContractAbi(chainData[toChain.id].apiUrl, contractAddress, ETHERSCAN_KEY);
      const newAbiData = { ...data, [contractAddress]: fetchedAbi || '' };
      localStorage.setItem(aliasKey, JSON.stringify(newAbiData));
      setAbiData(newAbiData);
      return fetchedAbi || '';
    },
    [ETHERSCAN_KEY, toChain.id],
  );

  useEffect(() => {
    const jsonData = localStorage.getItem(aliasKey);
    const data = jsonData ? JSON.parse(jsonData) : {};
    setAbiData(data);
  }, []);

  return {
    getAbi,
    abi,
  };
};
