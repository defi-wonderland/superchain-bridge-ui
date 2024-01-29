import { Box, SelectChangeEvent } from '@mui/material';
import { TokenSelect } from '~/components';
import { useTokens } from '~/hooks';

export const TokenSection = () => {
  const { tokens, selectedToken, setSelectedToken } = useTokens();

  const handleToken = async (event: SelectChangeEvent) => {
    try {
      const chain = tokens.find((token) => token.symbol === event.target.value);
      setSelectedToken(chain);
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
    </Box>
  );
};
