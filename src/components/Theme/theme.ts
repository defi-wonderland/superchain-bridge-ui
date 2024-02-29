import { Theme } from '~/types';

const steel: { [key: number]: string } = {
  25: '#FCFCFD',
  50: '#F5F5F6',
  100: '#F0F1F1',
  200: '#ECECED',
  300: '#CECFD2',
  400: '#94969C',
  500: '#85888E',
  600: '#4E5054',
  700: '#292B2E',
  800: '#1E1F21',
  900: '#151617',
  950: '#111112',
};
const ghost: { [key: number]: string } = {
  25: '#F6F5FD',
  50: '#EEECFC',
  100: '#E5E2FA',
  200: '#CAC4F2',
  300: '#C0B8F7',
  400: '#A79DEE',
  500: '#7C6FC7',
  600: '#595091',
  700: '#383263',
  800: '#252447',
  900: '#151224',
  950: '#04020D',
};

export const darkTheme: Theme = {
  type: 'dark',
  titleColor: '#FF0420',
  textPrimary: '#F5F5F6',
  textSecondary: '#9ca3af',
  backgroundPrimary: '#121212',
  backgroundSecondary: '#282828',
  headerBackground: '#1A191F',
  titleFontFamily: 'Open Sans',
  textFontFamily: 'Open Sans',
  borderRadius: '1.6rem',
  secondaryBorderRadius: '0.4rem',
  border: '0.1rem solid #9ca3af',
  borderColor: 'rgba(232,232,232,0.2)',

  transition: 'all 180ms ease-in-out',
  steel,
  ghost,
  mainCardBorder: '1px solid #3c3e4e', //'1px solid #2C2E40',
  mainCardBoxShadow: '0px 0px 64px 0px #251F3C, 0px 0px 14px 0px rgba(216, 201, 255, 0.06)',

  errorPrimary: '#F04438',
  warningPrimary: '#FFD27A',
  successPrimary: '#86D5A5',
};

export const lightTheme: Theme = {
  type: 'light',
  titleColor: '#FF0420',
  textPrimary: '#000000',
  textSecondary: '#717171',
  backgroundPrimary: '#ffffff',
  backgroundSecondary: '#f1f1f1',
  headerBackground: '#ffffff',
  titleFontFamily: 'Open Sans',
  textFontFamily: 'Open Sans',
  borderRadius: '1.6rem',
  secondaryBorderRadius: '0.4rem',
  border: '0.1rem solid rgba(153, 164, 184, 0.3)',
  borderColor: 'rgba(153, 164, 184, 0.3)',

  transition: 'all 0.3s ease-in-out',
  steel,
  ghost,
  mainCardBorder: '1px solid #2C2E40',
  mainCardBoxShadow: '0px 0px 64px 0px #251F3C, 0px 0px 14px 0px rgba(216, 201, 255, 0.06)',

  errorPrimary: '#F04438',
  warningPrimary: '#FFD27A',
  successPrimary: '#86D5A5',
};
