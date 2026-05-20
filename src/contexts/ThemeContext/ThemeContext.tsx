import { createContext, useContext } from "react";
import type { ThemeContextValue } from "./ThemeTypes";

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
