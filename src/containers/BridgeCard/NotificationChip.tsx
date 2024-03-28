import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import Image from 'next/image';

import warning from '~/assets/icons/warning.svg';
import arrow from '~/assets/icons/yellow-arrow-right.svg';

import { useChain, useLogs } from '~/hooks';
import { replaceSpacesWithHyphens } from '~/utils';

const WarningIcon = () => <Image src={warning} alt='warning' className='chip-icon' />;

const ArrowIcon = () => <Image src={arrow} alt='arrow' className='chip-icon' />;

export const NotificationChip = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { toChain } = useChain();
  const { pendingTransactionCount } = useLogs();
  const chainPath = replaceSpacesWithHyphens(toChain?.name || '');
  const handleClick = () => {
    router.push(`/${chainPath}/account/${address}`);
  };
  return (
    <CustomChip
      label={
        <div className='chip-container'>
          <WarningIcon />
          {`${pendingTransactionCount} transaction${pendingTransactionCount > 1 ? 's' : ''} requires action`}
          <ArrowIcon />
        </div>
      }
      clickable
      onClick={handleClick}
      variant='outlined'
    />
  );
};

export const CustomChip = styled(Chip)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.25rem 1rem',
  borderRadius: '0.75rem',
  border: '1px solid #542400',
  background: '#291205',
  boxShadow: '0px 4px 12px 0px rgba(19, 20, 22, 0.25)',
  width: '25rem',
  height: '3.5rem',
  lineHeight: '1.75rem',
  marginBottom: '1.5rem',
  color: '#FFD27A',
  '& .chip-container': {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
  },
  '& .chip-icon': {
    width: '1.5rem',
    height: '1.5rem',
  },
}));
