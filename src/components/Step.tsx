import { CircularProgress, styled } from '@mui/material';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import openLinkIcon from '~/assets/icons/open-link.svg';
import contentIcon from '~/assets/icons/content.svg';
import pendingIcon from '~/assets/icons/pending-tx.svg';

import { chainData, truncateAddress } from '~/utils';
import { useCustomTheme } from '~/hooks';

interface StepProps {
  title: string;
  text?: string;
  status: 'success' | 'pending' | 'loading' | 'idle' | 'failed' | 'final';
  hash?: string;
  connector?: boolean;
  chainId?: number;
}
export const Step = ({ hash, text, title, status, chainId = 11_155_111, connector = true }: StepProps) => {
  return (
    <StepContainer>
      <Box>
        {(status === 'success' || status === 'final') && <Image src={contentIcon} alt='success' />}
        {status === 'idle' && <IdleIcon />}
        {status === 'pending' && <Image src={pendingIcon} alt='transaction pending' className='pending-image' />}
        {status === 'loading' && <CircularProgress size='2.4rem' variant='indeterminate' thickness={4} />}

        {connector && <Connector className={status} />}
      </Box>

      <Box>
        <Typography variant='body1' className={status}>
          {title}
        </Typography>

        {hash && (
          <Link href={`${chainData[chainId].explorer}tx/${hash}`} target='_blank'>
            {truncateAddress(hash)}
            <Image src={openLinkIcon} alt='Open transaction in block explorer' />
          </Link>
        )}

        {text && <StyledText variant='body1'>{text}</StyledText>}
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
    paddingRight: '2rem',

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

    'p:first-of-type': {
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

      '&:hover': {
        textDecoration: 'underline',
      },
    },

    'canvas.success': {
      backgroundColor: '#2A5139',
    },

    'canvas.final': {
      backgroundColor: 'transparent',
    },

    '.pending-image': {
      background: '#542400',
      borderRadius: '50%',
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

const StyledText = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[400],
    fontSize: '1.6rem',
    fontWeight: 400,
    lineHeight: '2rem',
  };
});
