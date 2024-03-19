import { Box, Button, Typography, styled } from '@mui/material';
import Image from 'next/image';

import customWithdrawalIcon from '~/assets/icons/custom-withdrawal.svg';
import customTransferIcon from '~/assets/icons/custom-transfer.svg';
import chevronRightIcon from '~/assets/icons/chevron-right.svg';
import customTxIcon from '~/assets/icons/custom-tx.svg';

import { useCustomTheme, useTransactionData } from '~/hooks';
import { CustomTransactionType } from '~/types';

interface ExpertModeProps {
  setCustomTransaction: (customTransaction: CustomTransactionType) => void;
}
export const ExpertMode = ({ setCustomTransaction }: ExpertModeProps) => {
  const { setTo } = useTransactionData();

  const handleSetCustomTx = () => {
    setCustomTransaction('custom-tx');
    setTo('');
  };

  return (
    <ContentSection>
      <Typography className='select-txn-type-label' variant='body1'>
        Select a transaction type
      </Typography>

      <StyledButton
        variant='contained'
        fullWidth
        endIcon={<Image src={chevronRightIcon} alt='arrow-right' className='end-icon' />}
        onClick={handleSetCustomTx}
      >
        <SBox>
          <Image src={customTxIcon} alt='custom-tx' />
          <Box>
            <Title variant='body1'>Custom transaction</Title>
            <Description variant='body1'>Call a contract in the destination chain</Description>
          </Box>
        </SBox>
      </StyledButton>

      <StyledButton
        variant='contained'
        fullWidth
        endIcon={<Image src={chevronRightIcon} alt='arrow-right' className='end-icon' />}
        onClick={() => setCustomTransaction('force-withdrawal')}
      >
        <SBox>
          <Image src={customWithdrawalIcon} alt='custom-withdrawal' />
          <Box>
            <Title variant='body1'>Force withdrawal</Title>
            <Description variant='body1'>Initiate a withdrawal from L1</Description>
          </Box>
        </SBox>
      </StyledButton>

      <StyledButton
        variant='contained'
        fullWidth
        endIcon={<Image src={chevronRightIcon} alt='arrow-right' className='end-icon' />}
        onClick={() => setCustomTransaction('force-transfer')}
      >
        <SBox>
          <Image src={customTransferIcon} alt='custom-transfer' />
          <Box>
            <Title variant='body1'>Force transfer</Title>
            <Description variant='body1'>Make a transfer in L2 from L1</Description>
          </Box>
        </SBox>
      </StyledButton>
    </ContentSection>
  );
};

const ContentSection = styled('section')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    gap: '1.2rem',
    width: '100%',

    '.select-txn-type-label': {
      fontSize: '1.6rem',
      color: currentTheme.steel[300],
    },
  };
});

const StyledButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
    background: currentTheme.ghost[800],
    color: currentTheme.ghost[300],
    padding: '2.2rem 1.6rem',
    textTransform: 'none',
    lineHeight: '2.8rem',
    fontSize: '1.6rem',
    justifyContent: 'space-between',
    borderRadius: '1.2rem',
    gap: '0.8rem',

    '&:hover': {
      backgroundColor: currentTheme.ghost[700],
    },
  };
});

const SBox = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'center',
    gap: '1.2rem',
    img: {
      width: '2.4rem',
      height: '2.4rem',
    },
    div: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      textAlign: 'start',
      'p:first-of-type': {
        color: currentTheme.ghost[300],
      },
      'p:last-of-type': {
        color: currentTheme.ghost[400],
      },
    },

    '@media (max-width: 600px)': {
      img: {
        width: '2.2rem',
        height: '2.2rem',
        marginTop: '0.2rem',
      },
    },
  };
});

const Title = styled(Typography)(() => {
  return {
    fontSize: '1.6rem',
    fontWeight: 500,
  };
});

const Description = styled(Typography)(() => {
  return {
    fontSize: '1.4rem',
    fontWeight: 400,
  };
});
