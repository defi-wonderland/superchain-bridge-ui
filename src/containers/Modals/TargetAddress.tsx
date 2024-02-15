import { isAddress } from 'viem';
import { InputField } from '~/components';
import BaseModal from '~/components/BaseModal';
import { useTransactionData } from '~/hooks';
import { ModalType } from '~/types';

export const TargetAddress = () => {
  const { setTo, to } = useTransactionData();
  return (
    <BaseModal type={ModalType.SELECT_ACCOUNT} title='Destination address'>
      <InputField label='To address' value={to} setValue={setTo} error={!isAddress(to)} placeholder='' />
    </BaseModal>
  );
};
