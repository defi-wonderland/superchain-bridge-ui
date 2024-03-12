export type ThemeName = 'light' | 'dark';

export interface Theme {
  type: ThemeName;
  textPrimary: string;
  textSecondary: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  titleColor: string;
  titleFontFamily: string;
  textFontFamily: string;
  borderRadius: string;
  secondaryBorderRadius: string;
  headerBackground: string;
  border: string;
  borderColor: string;

  mainCardBorder: string;
  mainCardBoxShadow: string;
  transition: string;
  steel: { [key: number]: string };
  ghost: { [key: number]: string };

  errorPrimary: string;
  warningPrimary: string;
  successPrimary: string;
}

export interface PropTheme {
  theme: Theme;
}
