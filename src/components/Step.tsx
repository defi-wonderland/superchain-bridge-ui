import { CircularProgress, styled } from '@mui/material';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import openLinkIcon from '~/assets/icons/open-link.svg';
import contentIcon from '~/assets/icons/content.svg';

import { truncateAddress } from '~/utils';
import { useCustomTheme } from '~/hooks';

interface StepProps {
  text: string;
  status: 'success' | 'pending' | 'idle' | 'failed' | 'final';
  hash?: string;
  connector?: boolean;
}
export const Step = ({ hash, text, status, connector = true }: StepProps) => {
  return (
    <StepContainer>
      <Box>
        {(status === 'success' || status === 'final') && <Image src={contentIcon} alt='success' />}
        {status === 'pending' && <CircularProgress size='2.4rem' variant='indeterminate' thickness={4} />}
        {status === 'idle' && <IdleIcon />}

        {connector && <Connector className={status} />}
      </Box>

      <Box>
        <Typography variant='body1' className={status}>
          {text}
        </Typography>

        {hash && (
          <Link href='#'>
            {truncateAddress(hash)}
            <Image src={openLinkIcon} alt='Open transaction in block explorer' />
          </Link>
        )}
      </Box>
    </StepContainer>
  );
};

const StepContainer = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    fontSize: '1.6rem',
    fontWeight: 500,
    lineHeight: '150%',
    gap: '1.2rem',

    '.MuiCircularProgress-circle': {
      color: '#4AA16C',
    },

    div: {
      height: '7.8rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
      alignItems: 'start',
      gap: '0.4rem',
    },

    p: {
      fontSize: '1.6rem',
      color: currentTheme.steel[200],
    },
    'p.idle': {
      color: currentTheme.steel[500],
    },

    a: {
      color: currentTheme.ghost[400],
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
    },
    'a:hover': {
      textDecoration: 'underline',
    },

    'canvas.success': {
      backgroundColor: '#2A5139',
    },

    'canvas.final': {
      backgroundColor: 'transparent',
    },
  };
});

const IdleIcon = styled('canvas')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    borderRadius: '50%',
    border: '0.2rem solid',
    borderColor: currentTheme.steel[700],
    width: '2.4rem',
    height: '2.4rem',
  };
});

const Connector = styled('canvas')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    borderRadius: '0.2rem',
    backgroundColor: currentTheme.steel[700],
    width: '0.2rem',
    height: '4.2rem',
    margin: '0.4rem auto',
  };
});
