import { useState, useEffect, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeType, Theme, ThemeContextValue } from './ThemeTypes';

const THEMES: Theme = {
  light: 'bumblebee',
  dark: 'dim',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeType, setThemeType] = useState<ThemeType>(() => {
    if (typeof window === 'undefined') return 'light'; // SSR fallback

    const localThemeType = localStorage.getItem('themeType') as ThemeType | null;
    if (localThemeType === 'light' || localThemeType === 'dark') {
      return localThemeType;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // 2. A single source of truth useEffect to keep the DOM and LocalStorage in sync with state
  useEffect(() => {
    const html = document.documentElement;
    const activeThemeClass = THEMES[themeType];

    html.setAttribute('data-theme', activeThemeClass);
    localStorage.setItem('themeType', themeType);
  }, [themeType]);

  // 3. Simple state updater
  function setTheme(type: ThemeType) {
    setThemeType(type);
  }

  // 4. Matches our updated ThemeContextValue interface perfectly
  const value: ThemeContextValue = {
    themeType,
    themeName: THEMES[themeType],
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}