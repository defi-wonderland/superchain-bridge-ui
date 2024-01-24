import { Theme } from '~/types';

export const darkTheme: Theme = {
  type: 'dark',
  titleColor: '#FF0420',
  textPrimary: '#f1f4f9',
  textSecondary: '#9ca3af',
  backgroundPrimary: '#111110',
  backgroundSecondary: '#282828',
  headerBackground: '#1A191F',
  titleFontFamily: 'Open Sans',
  textFontFamily: 'Open Sans',
  borderRadius: '0.8rem',
  secondaryBorderRadius: '0.4rem',
  border: '0.1rem solid #9ca3af',
  borderColor: 'rgba(232,232,232,0.2)',
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
  borderRadius: '0.8rem',
  secondaryBorderRadius: '0.4rem',
  border: '0.1rem solid rgba(153, 164, 184, 0.3)',
  borderColor: 'rgba(153, 164, 184, 0.3)',
};
