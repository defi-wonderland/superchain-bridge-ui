import { Tooltip, TooltipProps, styled } from '@mui/material';

export const STooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip classes={{ popper: className }} placement='top' disableInteractive arrow {...props} />
))(() => {
  return {
    '& .MuiTooltip-tooltip': {
      fontSize: '1.4rem',
      borderRadius: '0.8rem',
      padding: '0.8rem 1.2rem',
      maxWidth: 'max-content',
    },
  };
});
