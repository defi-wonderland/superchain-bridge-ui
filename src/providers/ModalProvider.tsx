import { createContext, useState } from 'react';

import { ModalType } from '~/types';

type ContextType = {
  modalOpen: ModalType;
  setModalOpen: (val: ModalType) => void;
  closeModal: () => void;
};

interface StateProps {
  children: React.ReactElement;
}

export const ModalContext = createContext({} as ContextType);

export const ModalProvider = ({ children }: StateProps) => {
  const [modalOpen, setModalOpen] = useState<ModalType>(ModalType.NONE);

  const closeModal = () => setModalOpen(ModalType.NONE);

  return (
    <ModalContext.Provider
      value={{
        modalOpen,
        setModalOpen,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
