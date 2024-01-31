import { useContext } from 'react';
import { ModalContext } from '~/providers/ModalProvider';

export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a StateProvider');
  }

  return context;
};
