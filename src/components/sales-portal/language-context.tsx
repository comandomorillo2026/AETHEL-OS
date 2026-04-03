'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language, TranslationType } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Get initial language from browser or default to Spanish
function getInitialLanguage(): Language {
  if (typeof window !== 'undefined' && window.navigator) {
    const browserLang = window.navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      return 'en';
    }
  }
  return 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('es'); // Default to Spanish, will be updated on hydration

  const value: LanguageContextType = {
    lang,
    setLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
