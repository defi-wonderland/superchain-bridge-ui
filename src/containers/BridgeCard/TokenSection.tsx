import { Box, SelectChangeEvent } from '@mui/material';
import { formatUnits } from 'viem';

import { TokenSelect } from '~/components';
import { useToken, useTokenList, useTransactionData } from '~/hooks';

export const TokenSection = () => {
  const { fromTokens } = useTokenList();
  const {
    selectedToken,
    amount,
    setSelectedToken,
    setAmount,
    balance: tokenBalance,
    ethBalance,
    allowance,
  } = useToken();
  const balance = selectedToken?.symbol === 'ETH' ? ethBalance : tokenBalance;
  const { mint, setMint } = useTransactionData();

  const handleToken = async (event: SelectChangeEvent) => {
    try {
      const token = fromTokens.find((token) => token.symbol === event.target.value);
      setSelectedToken(token);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Box>
      {!!fromTokens.length && (
        <TokenSelect label='Token' value={selectedToken?.symbol || ''} setValue={handleToken} list={fromTokens} />
      )}
      <br />
      <p>Balance: {formatUnits(BigInt(balance), selectedToken?.decimals || 18)}</p>
      <p>Allowance: {formatUnits(BigInt(allowance), selectedToken?.decimals || 18)}</p>

      {selectedToken?.symbol === 'ETH' && (
        <>
          <label htmlFor='ethAmount'>ETH Amount</label>
          <input value={mint} onChange={(event) => setMint(event.target.value)} />
        </>
      )}
      {selectedToken?.symbol !== 'ETH' && (
        <>
          <label htmlFor='tokenAmount'>Token Amount</label>
          <input value={amount} onChange={(event) => setAmount(event.target.value)} />
        </>
      )}
    </Box>
  );
};
