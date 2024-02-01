import Box from '@mui/material/Box';
import { TextField } from '@mui/material';

interface InputFieldProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
  error?: boolean;
}

export function InputField({ label, value, setValue, error }: InputFieldProps) {
  return (
    <Box component='form' noValidate autoComplete='off'>
      <TextField
        label={label}
        variant='outlined'
        value={value}
        onChange={(event) => setValue(event.target.value)}
        fullWidth
        error={error}
      />
    </Box>
  );
}
