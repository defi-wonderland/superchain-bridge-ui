import { styled } from '@mui/material';

import { ChainSection } from './ChainSection';
import { TokenSection } from './TokenSection';
import { TargetButtons } from './TargetButtons';
import { BridgeSection } from './BridgeSection';

export const BasicMode = () => {
  return (
    <ContentSection>
      <ChainSection />

      <TokenSection />

      <TargetButtons />

      <BridgeSection />
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
