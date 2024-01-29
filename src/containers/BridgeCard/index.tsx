import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Paper } from '@mui/material';

import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { useModal } from '~/hooks';
import { ModalType } from '~/types';

export const BridgeCard = () => {
  const { setModalOpen } = useModal();

  const handleReview = () => {
    setModalOpen(ModalType.REVIEW);
  };

  return (
    // temporary inline-style
    <Paper elevation={3} sx={{ minWidth: '32rem' }}>
      <CardContent>
        <Typography variant='h5'>Bridge</Typography>

        <br />
        <ChainSection />

        <br />
        <br />
        <TokenSection />
        <br />
        <br />

        <Button variant='contained' color='primary' fullWidth onClick={handleReview}>
          Review Transaction
        </Button>
      </CardContent>
    </Paper>
  );
};
