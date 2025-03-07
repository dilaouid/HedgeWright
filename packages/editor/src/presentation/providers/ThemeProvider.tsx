import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

/**
 * Available themes for the application
 */
type Theme = 'light' | 'dark' | 'ace';

/**
 * Theme context values interface
 */
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  defaultTheme?: Theme;
  children: ReactNode;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * ThemeProvider component
 * Provides theme context and handles theme switching
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  defaultTheme = 'light',
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && ['light', 'dark', 'ace'].includes(savedTheme)) {
      return savedTheme as Theme;
    }
    return defaultTheme;
  });

  // Update theme in localStorage and apply CSS classes when theme changes
  useEffect(() => {
    localStorage.setItem('app-theme', theme);

    // Remove any existing theme classes from document
    document.documentElement.classList.remove(
      'theme-light',
      'theme-dark',
      'theme-ace'
    );

    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`);

    // Update color scheme meta tag for browser UI
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute(
        'content',
        theme === 'dark' ? 'dark' : 'light'
      );
    }
  }, [theme]);

  // Toggle between themes
  const toggleTheme = () => {
    setTheme((current) => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'ace';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
