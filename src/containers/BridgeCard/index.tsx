import Typography from '@mui/material/Typography';
import { Box, Button, IconButton, styled } from '@mui/material';
import { isHex } from 'viem';
import Image from 'next/image';

import adjustmentsIcon from '~/assets/icons/adjustments.svg';

import { useCustomTheme, useModal, useToken, useTransactionData } from '~/hooks';
import { ChainSection } from './sections/ChainSection';
import { TokenSection } from './sections/TokenSection';
import { TargetButtons } from './sections/TargetButtons';
import { BridgeSection } from './sections/BridgeSection';
import { ModalType } from '~/types';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();
  const { amount, selectedToken } = useToken();
  const { mint, data, isForceTransaction, setIsForceTransaction } = useTransactionData();

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  const isButtonDisabled =
    (selectedToken?.symbol === 'ETH' && !mint) ||
    (selectedToken && selectedToken?.symbol !== 'ETH' && !amount) ||
    (!!data && !isHex(data));

  return (
    <MainCardContainer>
      <Header>
        <Typography variant='h5'>Superchain Bridge</Typography>

        <IconButton onClick={() => setIsForceTransaction(!isForceTransaction)}>
          <Image src={adjustmentsIcon} alt='Advance mode' />
        </IconButton>
      </Header>

      <ContentSection>
        <ChainSection />

        <TokenSection />

        <TargetButtons />

        <BridgeSection />
      </ContentSection>

      <StyledButton variant='contained' fullWidth onClick={handleReview} disabled={isButtonDisabled}>
        {isButtonDisabled && 'Enter amount'}
        {!isButtonDisabled && 'Review Transaction'}
      </StyledButton>
    </MainCardContainer>
  );
};

const MainCardContainer = styled('main')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.steel[900],
    boxShadow: currentTheme.mainCardBoxShadow,
    borderRadius: currentTheme.borderRadius,
    border: currentTheme.mainCardBorder,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    padding: '2rem 2.4rem 3.2rem 2.4rem',
    width: '51.2rem',
    gap: '2.4rem',
  };
});

const StyledButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    backgroundColor: currentTheme.ghost[400],
    color: currentTheme.steel[900],
    border: 'none',
    padding: '1rem 1.8rem',
    borderRadius: '0.8rem',
    textTransform: 'capitalize',
    fontWeight: 600,
    fontSize: '1.8rem',
    height: '6rem',
    boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',

    '&:hover': {
      backgroundColor: currentTheme.ghost[500],
    },

    '&:disabled': {
      fontWeight: 500,
      backgroundColor: currentTheme.steel[700],
      borderColor: currentTheme.steel[700],
      color: currentTheme.steel[500],
    },
  };
});

const ContentSection = styled('section')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    gap: '0.8rem',
    width: '100%',
  };
});

const Header = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };
});
