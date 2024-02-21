export const getAbiFromEtherscanApi = async (apiUrl: string, address: string, apiKey?: string) => {
  const url = `${apiUrl}?module=contract&action=getabi&address=${address}${apiKey ? '&apikey=' + apiKey : ''}`;

  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    const formattedAbi = JSON.parse(jsonData.result);
    return JSON.stringify(formattedAbi);
  } catch (error) {
    console.error('Error fetching ABI from etherscan', error);
  }
};

export const getContractAbi = async (apiUrl: string, contractAddress: string, etherscanApiKey?: string) => {
  return await getAbiFromEtherscanApi(apiUrl, contractAddress, etherscanApiKey);
};
