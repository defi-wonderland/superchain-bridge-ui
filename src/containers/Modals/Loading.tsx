import BaseModal from '~/components/BaseModal';
import { ModalType } from '~/types';

export const LoadingModal = () => {
  return (
    <BaseModal type={ModalType.LOADING} title='Transaction pending'>
      You can safely close this modal
    </BaseModal>
  );
};
