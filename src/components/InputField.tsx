import { FormControl, InputBase, Typography, styled } from '@mui/material';
import { useCustomTheme } from '~/hooks';

interface InputFieldProps {
  label?: string;
  value: string;
  setValue: (val: string) => void;
  error?: boolean;
  placeholder?: string;
  modal?: boolean;
  multiline?: boolean;
}

export function InputField({ label, value, setValue, error, placeholder, multiline, modal = true }: InputFieldProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <SFormControl variant='standard' fullWidth>
      {label && <SInputLabel>{label}</SInputLabel>}

      <BootstrapInput
        error={error}
        aria-label={label + '-input'}
        value={value}
        onChange={handleOnChange}
        spellCheck={false}
        placeholder={placeholder}
        className={modal ? 'modal' : 'basic-input'}
        multiline={multiline}
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

    '&:has(.MuiInputBase-inputMultiline)': {
      '& .MuiInputBase-input.MuiInputBase-inputMultiline': {
        minHeight: '12.4rem',
        maxHeight: '12.4rem',
        fontFamily: 'Roboto Mono Variable, monospace',
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

    '&:hover .MuiInputBase-input': {
      borderColor: currentTheme.steel[500],
      transition: currentTheme.transition,
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
    fontSize: '1.4rem',
    lineHeight: 1.5,

    '&.Mui-focused': {
      color: currentTheme.steel[300],
    },
  };
});
