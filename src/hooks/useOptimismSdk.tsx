import { useMemo } from 'react';
import { CrossChainMessenger } from '@eth-optimism/sdk';
import { useEthersSigner } from './useEthersAdapters';
import { optimismSepolia, sepolia } from 'viem/chains';

export const useOptimismSdk = () => {
  // temporary fixed values
  const sepoliaChainId = sepolia.id;
  const opSepoliaChainId = optimismSepolia.id;

  const signerL1 = useEthersSigner({ chainId: sepoliaChainId });
  const signerL2 = useEthersSigner({ chainId: opSepoliaChainId });

  const crosschainMessenger = useMemo(() => {
    if (!signerL1 || !signerL2) return undefined;

    return new CrossChainMessenger({
      l1ChainId: sepoliaChainId,
      l2ChainId: opSepoliaChainId,
      l1SignerOrProvider: signerL1,
      l2SignerOrProvider: signerL2,
    });
  }, [opSepoliaChainId, sepoliaChainId, signerL1, signerL2]);

  return { crosschainMessenger };
};
