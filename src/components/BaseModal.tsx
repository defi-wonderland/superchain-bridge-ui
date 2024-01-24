import * as React from 'react';
import clsx from 'clsx';
import { styled, Box } from '@mui/system';
import { Modal } from '@mui/base/Modal';

import { useModal, useCustomTheme } from '~/hooks';
import { CustomScrollbar } from '~/components';
import { ModalType } from '~/types';
import { zIndex } from '~/utils';

interface BaseModalProps {
  children: React.ReactNode;
  type: ModalType;
}

export const BaseModal = ({ children, type }: BaseModalProps) => {
  const { modalOpen, closeModal } = useModal();
  return (
    <StyledModal open={type === modalOpen} onClose={closeModal} slots={{ backdrop: StyledBackdrop }}>
      <SModal>
        <SCustomScrollbar>{children}</SCustomScrollbar>
      </SModal>
    </StyledModal>
  );
};

export const Backdrop = React.forwardRef<HTMLDivElement, { open?: boolean; className: string }>((props, ref) => {
  const { open, className, ...other } = props;
  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />;
});

Backdrop.displayName = 'Backdrop';

export const StyledModal = styled(Modal)`
  position: fixed;
  z-index: ${zIndex.MODAL};
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: none;

  @media (max-width: 600px) {
    padding: 0rem 1.6rem;
  }
`;

export const StyledBackdrop = styled(Backdrop)`
  z-index: ${zIndex.BACKDROP};
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(0.05rem);
  -webkit-tap-highlight-color: transparent;
`;

export const SModal = styled(Box)(() => {
  const { currentTheme } = useCustomTheme();

  return {
    backgroundColor: currentTheme.backgroundPrimary,
    minWidth: '40rem',
    borderRadius: '1.2rem',
    padding: '0.6rem',
    boxShadow: 'none',

    '@media (max-width: 600px)': {
      minWidth: '100%',
      margin: '0rem 1.6rem',
    },
  };
});

const SCustomScrollbar = styled(CustomScrollbar)(() => {
  return {
    overflowX: 'hidden',
    maxHeight: '75vh',
    padding: '1.8rem',

    '@media (max-width: 600px)': {
      maxHeight: '60vh',
    },
  };
});
