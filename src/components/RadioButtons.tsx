import { styled, FormControl, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { useCustomTheme } from '~/hooks';

interface RadioButtonsProps {
  value: 'custom-data' | 'function';
  setValue: (val: 'custom-data' | 'function') => void;
}
export const RadioButtons = ({ value, setValue }: RadioButtonsProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value as 'custom-data' | 'function');
  };

  return (
    <FormControl>
      <SRadioGroup
        aria-labelledby='controlled-radio-buttons-group'
        name='controlled-radio-buttons-group'
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value='function' control={<Radio />} label='Choose function' />
        <FormControlLabel value='custom-data' control={<Radio />} label='Enter custom data' />
      </SRadioGroup>
    </FormControl>
  );
};

const SRadioGroup = styled(RadioGroup)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'row',
    gap: '2.4rem',

    '& .MuiFormControlLabel-root.MuiFormControlLabel-labelPlacementEnd': {
      marginLeft: 0,
      gap: '0.8rem',
    },

    '& .MuiButtonBase-root.MuiRadio-root': {
      padding: 0,
      color: currentTheme.ghost[400],
      '.MuiSvgIcon-root': {
        width: '1.6rem',
        height: '1.6rem',
      },
    },

    '& .MuiButtonBase-root': {
      color: currentTheme.ghost[400],
    },
  };
});
