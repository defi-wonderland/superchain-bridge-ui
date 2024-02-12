import { styled } from '@mui/material';

export const Background = () => {
  return (
    <>
      <Mask />
      <SquarePattern />
    </>
  );
};

const Mask = styled('canvas')`
  background-image: radial-gradient(
    circle at 50% 50%,
    transparent 0%,
    transparent 20%,
    black 80%
  ); // temporary fixed colors
  background-color: transparent;
  width: 100%;
  height: 100%;
  background-size: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const SquarePattern = styled('canvas')`
  background-color: transparent;
  // temporary fixed colors
  background-image: linear-gradient(#5c63b0 1px, transparent 1px),
    linear-gradient(to right, #5c63b0 1px, transparent 1px);
  background-size: 80px 80px;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -2;
`;
