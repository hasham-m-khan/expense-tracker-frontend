export type ThemeType = 'light' | 'dark';

export type Theme = {
    light: string;
    dark: string;
}

export interface ThemeContextValue {
    themeType: ThemeType;
    themeName: string;
    setTheme: (themeType: ThemeType) => void;
}
