import { Box, SelectChangeEvent } from '@mui/material';
import { formatUnits } from 'viem';

import { InputField, TokenSelect } from '~/components';
import { useToken, useTokenList, useTransactionData } from '~/hooks';

export const TokenSection = () => {
  const { fromTokens, toTokens } = useTokenList();
  const { mint, setMint, isForceTransaction, value, setValue } = useTransactionData();
  const {
    selectedToken,
    amount,
    balance: tokenBalance,
    ethBalance,
    allowance,
    setSelectedToken,
    setAmount,
  } = useToken();

  const balance = selectedToken?.symbol === 'ETH' ? ethBalance : tokenBalance;
  const tokenList = isForceTransaction ? toTokens : fromTokens;
  const ethValue = isForceTransaction ? value : mint;
  const setEthValue = isForceTransaction ? setValue : setMint;

  const handleToken = async (event: SelectChangeEvent) => {
    try {
      const token = tokenList.find((token) => token.symbol === event.target.value);
      setSelectedToken(token);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Box>
      {!!tokenList.length && (
        <TokenSelect label='Token' value={selectedToken?.symbol || ''} setValue={handleToken} list={tokenList} />
      )}

      <br />
      {selectedToken?.symbol === 'ETH' && <InputField label='ETH Amount' value={ethValue} setValue={setEthValue} />}

      {selectedToken && selectedToken?.symbol !== 'ETH' && (
        <InputField label='Token Amount' value={amount} setValue={setAmount} />
      )}

      <p>Balance: {formatUnits(BigInt(balance), selectedToken?.decimals || 18)}</p>
      <p>Allowance: {formatUnits(BigInt(allowance), selectedToken?.decimals || 18)}</p>
    </Box>
  );
};
