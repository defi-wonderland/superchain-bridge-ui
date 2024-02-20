import * as React from 'react';
import clsx from 'clsx';
import { Modal, styled, Box, Typography, IconButton } from '@mui/material';
import Image from 'next/image';

import closeIcon from '~/assets/icons/x-mark.svg';
import { useCustomTheme, useModal } from '~/hooks';
import { ModalType } from '~/types';
import { zIndex } from '~/utils';

interface BaseModalProps {
  children: React.ReactNode;
  type: ModalType;
  title?: string;
}

const BaseModal = ({ children, type, title }: BaseModalProps) => {
  const { modalOpen, closeModal } = useModal();
  return (
    <StyledModal open={type === modalOpen} onClose={closeModal} slots={{ backdrop: StyledBackdrop }}>
      <SModal>
        <ModalHeader>
          {title && <Typography variant='h2'>{title}</Typography>}
          <IconButton onClick={closeModal} className='close-button'>
            <Image src={closeIcon} alt='Close modal' />
          </IconButton>
        </ModalHeader>

        {children}
      </SModal>
    </StyledModal>
  );
};

export default BaseModal;

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
    minWidth: '44.8rem',
    minHeight: '38.6rem',
    borderRadius: currentTheme.borderRadius,
    backgroundColor: currentTheme.steel[900],
    border: `1px solid ${currentTheme.steel[700]}`,
    display: 'flex',
    padding: '2rem 3.2rem 3.2rem 2.4rem',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2rem',

    '@media (max-width: 600px)': {
      minWidth: '100%',
      margin: '0rem 1.6rem',
    },
  };
});

export const ModalHeader = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    '.close-button': {
      padding: '0.4rem',
      marginRight: '-0.4rem',
      marginLeft: 'auto',
    },
  };
});
