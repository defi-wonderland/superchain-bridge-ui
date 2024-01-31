import { Box, SelectChangeEvent } from '@mui/material';

import { TokenSelect } from '~/components';
import { useToken, useTokenList, useTransactionData } from '~/hooks';

export const TokenSection = () => {
  const { tokens, balance } = useTokenList();
  const { selectedToken, amount, setSelectedToken, setAmount } = useToken();
  const { mint, setMint } = useTransactionData();

  const handleToken = async (event: SelectChangeEvent) => {
    try {
      const token = tokens.find((token) => token.symbol === event.target.value);
      setSelectedToken(token);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Box>
      {!!tokens.length && (
        <TokenSelect label='Token' value={selectedToken?.symbol || ''} setValue={handleToken} list={tokens} />
      )}
      <br />
      <p>Balance: {balance}</p>

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
