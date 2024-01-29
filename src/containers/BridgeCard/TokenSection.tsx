import { Box, SelectChangeEvent } from '@mui/material';
import { TokenSelect } from '~/components';
import { useTokens } from '~/hooks';

export const TokenSection = () => {
  const { tokens, selectedToken, setSelectedToken, isFetching } = useTokens();

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
      {isFetching && <p>Fetching...</p>}
      {tokens.length === 0 && <p>No tokens found</p>}
      {!!tokens.length && (
        <TokenSelect label='Token' value={selectedToken?.symbol || ''} setValue={handleToken} list={tokens} />
      )}
      <br />
    </Box>
  );
};
