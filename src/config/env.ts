import { Env } from '~/types';

export const getEnv = (): Env => {
  return {
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || '',
    PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID || '',
    ALCHEMY_KEY: process.env.NEXT_PUBLIC_ALCHEMY_KEY || '',
    ETHERSCAN_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_KEY || '',
  };
};
