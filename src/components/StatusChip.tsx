import { Box, styled } from '@mui/material';
import { getStatusText } from '~/utils';

interface StatusChipProps {
  status: string;
  title?: boolean;
}

export const StatusChip = ({ status, title }: StatusChipProps) => {
  return (
    <SBox>
      <span className={`${status} ${title ? 'title' : ''}`}>{getStatusText(status)}</span>
    </SBox>
  );
};

const SBox = styled(Box)(() => {
  return {
    fontSize: '1.2rem',
    background: 'transparent',
    span: {
      padding: '0.2rem 0.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '1.6rem',
      lineHeight: '1.8rem',
    },

    '.title': {
      fontSize: '1.6rem',
      lineHeight: '2rem',
      padding: '0.4rem 1.2rem',
    },

    '.finalized': {
      background: '#15281D',
      color: '#86D5A5',
    },

    '.waiting-to-prove, .waiting-to-finalize': {
      background: '#291205',
      color: '#FFBB45',
    },

    '.ready-to-prove, .ready-to-finalize': {
      background: '#542400',
      color: '#FFBB45',
    },
  };
});
