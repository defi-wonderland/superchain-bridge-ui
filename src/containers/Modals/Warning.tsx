import { Box, Typography, styled } from '@mui/material';
import { PrimaryButton, SecondaryButton } from '~/components';

import warningIcon from '~/assets/icons/warning.svg';

import BaseModal from '~/components/BaseModal';
import { useCustomTheme, useModal } from '~/hooks';
import { ModalType } from '~/types';

export const WarningModal = () => {
  const { closeModal, setModalOpen } = useModal();

  const handleConfirm = () => {
    setModalOpen(ModalType.REVIEW);
  };

  return (
    <BaseModal type={ModalType.WARNING} title='Warning' image={warningIcon}>
      <ContentContainer>
        <PrimaryText variant='body1'>
          Withdrawals using the OP Standard Bridge will require you to manually submit three (3) transactions:
        </PrimaryText>

        <Box>
          <SecondaryText variant='body2'>
            1. Withdrawal initiating transaction, which the user submits on L2.
          </SecondaryText>

          <SecondaryText variant='body2'>
            2. Withdrawal proving transaction, which the user submits on L1 to prove that the withdrawal is legitimate.
          </SecondaryText>

          <SecondaryText variant='body2'>
            3. Withdrawal finalizing transaction, which the user submits on L1 after the fault challenge period has
            passed (7 days), to actually run the transaction on L1.
          </SecondaryText>
        </Box>
      </ContentContainer>

      <ButtonsContainer>
        <SecondaryButton variant='contained' color='primary' fullWidth onClick={closeModal}>
          Cancel
        </SecondaryButton>

        <PrimaryButton variant='contained' color='primary' fullWidth onClick={handleConfirm}>
          I understand
        </PrimaryButton>
      </ButtonsContainer>
    </BaseModal>
  );
};

const ButtonsContainer = styled(Box)(() => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1.2rem',
    marginTop: '2rem',
    button: {
      textTransform: 'none',
    },
  };
});

const ContentContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '40rem',

    div: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      padding: '0 1.2rem',
    },
  };
});

const PrimaryText = styled(Typography)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[100],
    fontSize: '1.6rem',
    fontWeight: 500,
    lineHeight: 1.5,
  };
});

const SecondaryText = styled(PrimaryText)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.steel[300],
    fontWeight: 400,
  };
});
