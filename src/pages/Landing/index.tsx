import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useChainId } from 'wagmi';

import { useQueryParams } from '~/hooks';
import { QueryParamKey } from '~/types';

export const Landing = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { t } = useTranslation();

  const { updateQueryParams } = useQueryParams();

  useEffect(() => {
    if (chainId) updateQueryParams(QueryParamKey.originChainId, chainId.toString());
  }, [chainId, updateQueryParams]);

  return (
    <section>
      <h1 data-testid='boilerplate-title'>Web3 React Boilerplate</h1>
      <p>Connected account: {address}</p>
      {t('headerTitle', { appName: 'Web3 React Boilerplate' })}
    </section>
  );
};
