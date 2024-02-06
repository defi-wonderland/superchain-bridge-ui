import { Chain } from 'viem';
import { contracts } from './variables';
import { OpContracts } from '~/types';

export const replaceSpacesWithHyphens = (str: string) => str.replace(/\s+/g, '-').toLowerCase();

export const getFromContracts = (fromChain: Chain, toChain: Chain): OpContracts => {
  const key = `${fromChain.id}-${toChain.id}`;
  return contracts[key];
};

export const getToContracts = (fromChain: Chain, toChain: Chain): OpContracts => {
  const key = `${toChain.id}-${fromChain.id}`;
  return contracts[key];
};
