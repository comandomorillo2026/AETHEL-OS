'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';

type Theme = 'dark' | 'light';
type Language = 'es' | 'en';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nexusos-theme';
const LANGUAGE_STORAGE_KEY = 'nexusos-language';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Track if we've hydrated
  const hydratedRef = useRef(false);
  
  // Initialize state with a function that reads from localStorage
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'es';
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'es' || savedLanguage === 'en') {
      return savedLanguage;
    }
    return 'es';
  });
  
  const [mounted, setMounted] = useState(typeof window !== 'undefined');

  // Apply initial theme and mark as mounted after hydration
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    
    // Apply initial theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    // Use timeout to avoid the lint error about setState in effect
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, [theme]);

  // Apply theme to document when it changes
  useEffect(() => {
    if (!hydratedRef.current) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Persist language to localStorage
  useEffect(() => {
    if (!hydratedRef.current) return;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'es' ? 'en' : 'es');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setTheme,
    language,
    toggleLanguage,
    setLanguage,
  }), [theme, toggleTheme, setTheme, language, toggleLanguage, setLanguage]);

  // Prevent flash of unstyled content by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
