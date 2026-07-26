import { configureFonts, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const fonts = configureFonts({
  config: {
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 1,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#B84A2F',
    onPrimary: '#FFFCF6',
    primaryContainer: '#F1DDD3',
    onPrimaryContainer: '#25231F',
    secondary: '#2F6653',
    onSecondary: '#FFFCF6',
    secondaryContainer: '#DCE9E2',
    onSecondaryContainer: '#25231F',
    background: '#F6F1E7',
    surface: '#FFFCF6',
    surfaceVariant: '#EFE8DC',
    onSurface: '#25231F',
    onSurfaceVariant: '#6E6A61',
    outline: '#D8D0C2',
    error: '#8F3E2F',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 1,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#E07A5F',
    onPrimary: '#1C1B18',
    primaryContainer: '#4C3028',
    onPrimaryContainer: '#F3EBDD',
    secondary: '#7FB59F',
    onSecondary: '#1C1B18',
    secondaryContainer: '#263D34',
    onSecondaryContainer: '#F3EBDD',
    background: '#1C1B18',
    surface: '#25231F',
    surfaceVariant: '#312E29',
    onSurface: '#F3EBDD',
    onSurfaceVariant: '#BDB4A7',
    outline: '#48433B',
    error: '#FFB4A7',
  },
};

export type AppTheme = typeof lightTheme;

export const fontsByRole = {
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
  target: 'NotoSerifJP_600SemiBold',
  japanese: 'NotoSansJP_400Regular',
  japaneseBold: 'NotoSansJP_700Bold',
} as const;
