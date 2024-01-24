import { useModal } from '~/hooks';
import { ModalType } from '~/types';

export const MainCard = () => {
  const { setModalOpen } = useModal();

  const openModal = () => {
    setModalOpen(ModalType.CONFIRM);
  };

  return (
    <div>
      <h2>Main Card</h2>
      <button onClick={openModal}>Open Modal</button>
    </div>
  );
};
