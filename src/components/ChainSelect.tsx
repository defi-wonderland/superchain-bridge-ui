import { SelectChangeEvent, Select, FormControl, MenuItem, InputLabel, Box } from '@mui/material';
import { Chain } from 'viem';

interface ChainSelectProps {
  label: string;
  value: Chain;
  setValue: (val: SelectChangeEvent) => void;
  list: Chain[];
}

export const ChainSelect = ({ label, list, value, setValue: handleChange }: ChainSelectProps) => {
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>

        <Select value={value.name} label={label} onChange={handleChange}>
          {list.map((chain) => (
            <MenuItem key={chain.id} value={chain.name}>
              {chain.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
