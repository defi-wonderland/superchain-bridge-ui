import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';

export const Landing = () => {
  const { address } = useAccount();
  const { t } = useTranslation();

  return (
    <LandingContainer>
      <h1 data-testid='boilerplate-title'>Web3 React Boilerplate</h1>
      <p>Connected account: {address}</p>
      {t('headerTitle', { appName: 'Web3 React Boilerplate' })}
    </LandingContainer>
  );
};

const LandingContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 16rem);
  padding: 0 8rem;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
