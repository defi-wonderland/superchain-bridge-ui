import BaseModal from '~/components/BaseModal';
import { ModalType } from '~/types';

export const SettingsModal = () => {
  return (
    <BaseModal type={ModalType.SETTINGS} title='Settings'>
      SettingsModal
    </BaseModal>
  );
};
