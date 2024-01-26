import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Chain } from 'viem';

interface BasicSelectProps {
  label: string;
  value: Chain;
  setValue: (val: SelectChangeEvent) => void;
  list: Chain[];
}

export default function BasicSelect({ label, list, value, setValue: handleChange }: BasicSelectProps) {
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
}
