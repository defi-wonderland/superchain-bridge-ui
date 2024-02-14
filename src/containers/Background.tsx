import { styled } from '@mui/material';
import { useCustomTheme } from '~/hooks';

export const Background = () => {
  return (
    <>
      <Mask />
      <SquarePattern />
    </>
  );
};

const Mask = styled('canvas')(() => {
  const { currentTheme } = useCustomTheme();

  return {
    backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, transparent 20%, ${currentTheme.backgroundPrimary} 80%)`,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    backgroundSize: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  };
});

const SquarePattern = styled('canvas')`
  background-color: transparent;
  // temporary fixed colors
  background-image: linear-gradient(#5c63b0 1px, transparent 1px),
    linear-gradient(to right, #5c63b0 1px, transparent 1px);
  background-size: 80px 80px;
  width: 100%;
  height: 100%;
  opacity: 0.23;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
`;
