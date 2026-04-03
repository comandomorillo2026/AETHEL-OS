'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';

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
  // Always start with default values to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>('dark');
  const [language, setLanguageState] = useState<Language>('es');
  const [mounted, setMounted] = useState(false);

  // Load saved preferences after mount (client-side only)
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
      
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === 'es' || savedLanguage === 'en') {
        setLanguageState(savedLanguage);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // Ignore
    }
  }, [theme, mounted]);

  // Persist language
  useEffect(() => {
    if (!mounted) return;
    
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (e) {
      // Ignore
    }
  }, [language, mounted]);

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
