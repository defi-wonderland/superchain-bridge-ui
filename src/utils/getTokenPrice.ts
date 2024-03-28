import { getEnv } from '~/config/env';
import { ChainIdMapping } from '~/types';

export const fetchTokenPrice = async ({ chainId, address }: { chainId: number; address: string }) => {
  const chainIdMapping: ChainIdMapping = {
    // Testnet to Mainnet Mapping
    84532: 8453, // Base testnet to Base mainnet
    11155111: 1, // Sepolia to Ethereum mainnet
    11155420: 10, // Optimism Sepolia to Optimism mainnet
  };

  const effectiveChainId = chainIdMapping[chainId] || chainId;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-api-key': getEnv().CHAINBASE_KEY,
    },
  };

  const url = `https://api.chainbase.online/v1/token/price?chain_id=${effectiveChainId}&contract_address=${address}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const price = data?.data?.price;
    return price;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
  }
};
