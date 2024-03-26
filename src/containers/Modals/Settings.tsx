import { useState } from 'react';
import { Button, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import clearCacheIcon from '~/assets/icons/trash.svg';

import { BasicSelect } from '~/components';
import BaseModal from '~/components/BaseModal';
import { useCustomTheme } from '~/hooks';
import { ModalType } from '~/types';

export const SettingsModal = () => {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();

  const { locales, replace } = useRouter();

  const handleChangeLanguage = (value: string) => {
    replace('/', undefined, { locale: value });
    changeLanguage(value);
  };

  // temporary fixed values
  const [explorer, setExplorer] = useState('Etherscan');
  const explorers = ['Etherscan']; //['Etherscan', 'Blockscout', 'Etherchain'];

  const [publicRPC, setPublicRPC] = useState('Alchemy');
  const publicRPCs = ['Alchemy']; //['Alchemy', 'Infura'];

  return (
    <BaseModal type={ModalType.SETTINGS} title='Settings'>
      <BasicSelect label='Language' value={language} setValue={handleChangeLanguage} list={locales || []} />

      <BasicSelect label='Default block explorer' value={explorer} setValue={setExplorer} list={explorers} />

      <BasicSelect label='Public RPC' value={publicRPC} setValue={setPublicRPC} list={publicRPCs} />

      <SButton
        variant='text'
        disabled
        startIcon={<Image src={clearCacheIcon} alt='clear-cache' width={20} height={20} />}
      >
        Clear app cache
      </SButton>
    </BaseModal>
  );
};

const SButton = styled(Button)(() => {
  const { currentTheme } = useCustomTheme();
  return {
    color: currentTheme.ghost[400],
    fontSize: '1.6rem',
    fontWeight: 600,
    textTransform: 'none',

    '&:hover': {
      backgroundColor: 'transparent',
      color: currentTheme.ghost[300],
    },

    '&:disabled': {
      color: currentTheme.ghost[400],
      opacity: 0.7,
    },
  };
});
