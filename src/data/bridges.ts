import circleLogo from '~/assets/icons/circle.png';
import optimismLogo from '~/assets/chains/optimism.svg';

import { BridgeData } from '~/types';

export const bridges: BridgeData[] = [
  {
    name: 'OP Standard Bridge',
    logoUrl: optimismLogo.src,
    time: '2m',
    fees: '-',
  },
  {
    name: 'CCTP',
    logoUrl: circleLogo,
    time: '2m',
    fees: '-',
  },
];
