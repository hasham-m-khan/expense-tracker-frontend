import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const useThemeContext = () => {
    const ctx = useContext(ThemeContext);

    if (!ctx) {
        throw new Error("useThemeContext can only be used inside a ThemeProvider");
    }

    return ctx;
}

