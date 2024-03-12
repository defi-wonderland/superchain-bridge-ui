import { Select, FormControl, MenuItem, InputLabel, Box, SelectChangeEvent } from '@mui/material';
import { TokenData } from '~/types';

interface TokenSelectProps {
  label: string;
  value: string;
  setValue: (val: SelectChangeEvent) => void;
  list: TokenData[];
}

export const TokenSelect = ({ label, list, value, setValue: handleChange }: TokenSelectProps) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>

        <Select value={value} label={label} onChange={handleChange}>
          {list.map((token, index) => (
            <MenuItem key={token.address + index} value={token.symbol}>
              {token.symbol}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
