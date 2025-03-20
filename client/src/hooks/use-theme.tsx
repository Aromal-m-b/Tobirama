import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  theme: {
    primaryColor: string;
    fontStyle: string;
    borderRadius: string;
  };
  updateTheme: (updates: Partial<ThemeContextType['theme']>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = {
  primaryColor: 'hsl(222.2 47.4% 11.2%)', // from theme.json
  fontStyle: 'default',
  borderRadius: 'default',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setThemeState] = useState(defaultTheme);
  
  // Initialize theme based on user preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedThemeSettings = localStorage.getItem('themeSettings');
    if (savedThemeSettings) {
      try {
        setThemeState(JSON.parse(savedThemeSettings));
      } catch (e) {
        console.error('Error parsing theme settings', e);
      }
    }
  }, []);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(!isDarkMode);
  };
  
  // Set specific theme
  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Update theme settings
  const updateTheme = (updates: Partial<ThemeContextType['theme']>) => {
    const newTheme = { ...theme, ...updates };
    setThemeState(newTheme);
    localStorage.setItem('themeSettings', JSON.stringify(newTheme));
    
    // Apply theme changes to CSS variables
    // This would be more robust in a real app
    document.documentElement.style.setProperty('--primary', newTheme.primaryColor);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        setTheme,
        theme,
        updateTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
