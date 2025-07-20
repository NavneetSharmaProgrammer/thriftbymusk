import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Theme, ThemeContextType } from './types.ts';

/**
 * Creates a context for managing the application's theme.
 * This context provides the current theme and a function to change it.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * The ThemeProvider component manages the theme state for the entire application.
 * - It defaults to the 'light' theme on first visit.
 * - It saves the user's selected theme to localStorage to persist it across sessions.
 * - It applies the corresponding CSS class to the <html> element to activate the theme's styles.
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Check for a saved theme in localStorage.
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    // 2. Default to 'light' theme, ignoring system preference.
    return 'light';
  });

  /**
   * Effect to apply the theme class to the <html> element and save the theme to localStorage
   * whenever the theme state changes.
   */
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme classes before adding the new one.
    root.classList.remove('light', 'dark', 'sepia');
    root.classList.add(theme);

    // Persist the theme choice.
    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Cycles through the available themes: light -> dark -> sepia -> light.
   */
  const cycleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'sepia';
      return 'light';
    });
  };

  const value = { theme, cycleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * A custom hook `useTheme` for easy consumption of the ThemeContext.
 * It provides a convenient way for components to access and manipulate the theme.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
