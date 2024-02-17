import { InputAdornment, FormControl, styled, InputBase } from '@mui/material';
import Image from 'next/image';

import searchIcon from '~/assets/icons/search.svg';
import { useCustomTheme } from '~/hooks';

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, setValue, placeholder }: SearchInputProps) => {
  return (
    <SFormControl fullWidth>
      <SInputBase
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position='start'>
            <Image src={searchIcon} alt='search' />
          </InputAdornment>
        }
      />
    </SFormControl>
  );
};

const SFormControl = styled(FormControl)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    '& .Mui-focused': {
      borderColor: currentTheme.steel[500],
    },
    '&:hover .MuiInputBase-root': {
      borderColor: currentTheme.steel[500],
    },
  };
});

export const SInputBase = styled(InputBase)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    borderRadius: '1.2rem',
    position: 'relative',
    border: '1px solid',
    backgroundColor: currentTheme.steel[950],
    borderColor: currentTheme.steel[700],
    boxShadow: '0 0.1rem 0.2rem 0 rgba(16, 24, 40, 0.05)',

    fontSize: '1.6rem',
    lineHeight: '2.4rem',
    padding: '1.2rem 1.4rem',

    '& .MuiInputBase-input': {
      padding: 0,
    },

    '& .MuiInputBase-input::placeholder': {
      fontWeight: 400,
      color: currentTheme.steel[600],
      opacity: 1,
    },
  };
});
