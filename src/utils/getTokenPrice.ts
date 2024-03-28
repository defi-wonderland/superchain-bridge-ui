import { getEnv } from '~/config/env';

export const fetchTokenPrice = async ({ chainId, address }: { chainId: number; address: string }) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'x-api-key': getEnv().CHAINBASE_KEY,
    },
  };

  const url = `https://api.chainbase.online/v1/token/price?chain_id=${chainId}&contract_address=${address}`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const price = data.price;
    return price;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
  }
};
