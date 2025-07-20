import React from 'react';
import { useTheme } from '../ThemeContext.tsx';
import { SunIcon, MoonIcon, EyeIcon } from './Icons.tsx';

/**
 * A UI component that allows the user to cycle through the available themes.
 * It displays a different icon based on the current active theme.
 */
const ThemeSwitcher: React.FC = () => {
  const { theme, cycleTheme } = useTheme();

  // Determine which icon to show based on the current theme.
  const renderIcon = () => {
    switch (theme) {
      case 'light':
        return <MoonIcon className="w-6 h-6" aria-label="Switch to Dark Mode" />;
      case 'dark':
        return <EyeIcon className="w-6 h-6" aria-label="Switch to Night Protection Mode" />;
      case 'sepia':
        return <SunIcon className="w-6 h-6" aria-label="Switch to Light Mode" />;
      default:
        return <SunIcon className="w-6 h-6" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
      aria-label="Cycle through color themes"
    >
      {renderIcon()}
    </button>
  );
};

export default ThemeSwitcher;
