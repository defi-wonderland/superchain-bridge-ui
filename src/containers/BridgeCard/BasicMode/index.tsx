import { Box, styled } from '@mui/material';

import { ChainSection } from '../ChainSection';
import { TokenSection } from '../TokenSection';
import { TargetButtons } from './TargetButtons';
import { BridgeSection } from './BridgeSection';

export const BasicMode = () => {
  return (
    <ContentSection>
      <ChainSection />

      <SBox>
        <TokenSection />
      </SBox>

      <BridgeSection />
      <TargetButtons />
    </ContentSection>
  );
};

const ContentSection = styled('section')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    gap: '0.8rem',
    width: '100%',
  };
});

const SBox = styled(Box)(() => {
  return {
    width: '100%',
    padding: '1.6rem 0',
  };
});
