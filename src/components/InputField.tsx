import { FormControl, InputBase, Typography, styled } from '@mui/material';
import { useCustomTheme } from '~/hooks';

interface InputFieldProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
  error?: boolean;
  placeholder?: string;
  modal?: boolean;
}

export function InputField({ label, value, setValue, error, placeholder, modal = true }: InputFieldProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <SFormControl variant='standard' fullWidth>
      <SInputLabel>{label}</SInputLabel>
      <BootstrapInput
        error={error}
        aria-label={label + '-input'}
        value={value}
        onChange={handleOnChange}
        spellCheck={false}
        placeholder={placeholder}
        className={modal ? 'modal' : 'basic-input'}
      />
    </SFormControl>
  );
}

const SFormControl = styled(FormControl)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    '&:has(.basic-input)': {
      '.MuiInputBase-input': {
        backgroundColor: currentTheme.steel[800],
      },
    },
  };
});

const BootstrapInput = styled(InputBase)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    transition: currentTheme.transition,
    'label + &': {
      marginTop: '2.2rem',
    },

    '& .MuiInputBase-input': {
      borderRadius: '1.2rem',
      position: 'relative',
      border: '1px solid',
      backgroundColor: currentTheme.steel[950],
      borderColor: currentTheme.steel[700],
      boxShadow: '0 0.1rem 0.2rem 0 rgba(16, 24, 40, 0.05)',

      fontSize: '1.6rem',
      lineHeight: '2.4rem',
      padding: '1.2rem 1.4rem',

      '&:focus': {
        // boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: currentTheme.steel[500],
      },
    },
    '&.Mui-error .MuiInputBase-input, &.Mui-error.MuiInputBase-input:focus': {
      borderColor: currentTheme.errorPrimary,
    },
  };
});

export const SInputLabel = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[400],
    fontSize: '1.6rem',
    lineHeight: '2rem',

    '&.Mui-focused': {
      color: currentTheme.steel[300],
    },
  };
});
