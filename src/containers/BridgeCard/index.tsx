import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';

import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';

export const BridgeCard = () => {
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
        <Typography variant='body1' color='text.secondary' gutterBottom>
          Word of the Day
        </Typography>
        <br />
        <br />

        <Typography variant='body1' color='text.secondary'>
          adjective
        </Typography>
      </CardContent>
    </Paper>
  );
};
