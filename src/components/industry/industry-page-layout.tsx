'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Globe, 
  LogIn,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { industryTranslations, IndustryLanguage } from '@/lib/industry-translations';

// Theme Context
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useIndustryTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useIndustryTheme must be used within IndustryPageLayout');
  }
  return context;
}

// Language Context
interface IndustryLanguageContextType {
  lang: IndustryLanguage;
  setLang: (lang: IndustryLanguage) => void;
  t: typeof industryTranslations.en;
}

const IndustryLanguageContext = createContext<IndustryLanguageContextType | undefined>(undefined);

export function useIndustryLanguage() {
  const context = useContext(IndustryLanguageContext);
  if (!context) {
    throw new Error('useIndustryLanguage must be used within IndustryPageLayout');
  }
  return context;
}

// Get initial language from localStorage or browser
function getInitialLanguage(): IndustryLanguage {
  if (typeof window !== 'undefined') {
    // First check localStorage
    const saved = localStorage.getItem('nexusos-lang');
    if (saved === 'en' || saved === 'es') {
      return saved;
    }
    // Then check browser
    const browserLang = window.navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      return 'en';
    }
  }
  return 'es';
}

// Get initial theme from localStorage
function getInitialTheme(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('nexusos-theme');
    if (saved === 'light') {
      return false;
    }
    if (saved === 'dark') {
      return true;
    }
  }
  return true; // Default to dark
}

// Image Carousel Component
interface CarouselProps {
  images: { src: string; alt: string }[];
  isDark: boolean;
}

function ImageCarousel({ images, isDark }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div 
                className={`aspect-video rounded-2xl border flex items-center justify-center ${
                  isDark 
                    ? 'bg-gradient-to-br from-[rgba(108,63,206,0.1)] to-[rgba(167,139,250,0.05)] border-[rgba(167,139,250,0.2)]'
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-200'
                }`}
              >
                {/* Placeholder for screenshot - in production would be actual image */}
                <div className="text-center p-8">
                  <div 
                    className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                      isDark ? 'bg-[rgba(108,63,206,0.2)]' : 'bg-gray-200'
                    }`}
                  >
                    <svg 
                      className={`w-8 h-8 ${isDark ? 'text-[var(--nexus-violet)]' : 'text-gray-500'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-[var(--text-mid)]' : 'text-gray-500'}`}>
                    {image.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-[rgba(14,12,31,0.8)] border-[rgba(167,139,250,0.3)] text-[var(--text-primary)] hover:bg-[rgba(108,63,206,0.3)]'
                : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              isDark 
                ? 'bg-[rgba(14,12,31,0.8)] border-[rgba(167,139,250,0.3)] text-[var(--text-primary)] hover:bg-[rgba(108,63,206,0.3)]'
                : 'bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-[var(--nexus-gold)]' 
                  : isDark ? 'bg-[rgba(167,139,250,0.3)]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main Layout Props
interface IndustryPageLayoutProps {
  children: ReactNode;
  industryKey: 'bakery' | 'clinic' | 'salon' | 'retail' | 'lawfirm';
  industryIcon: React.ReactNode;
  industryColor: string;
  screenshots: { src: string; alt: string }[];
}

export function IndustryPageLayout({ 
  children, 
  industryKey, 
  industryIcon, 
  industryColor,
  screenshots 
}: IndustryPageLayoutProps) {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<IndustryLanguage>('es');
  const [mounted, setMounted] = useState(false);

  // Initialize on mount - load from localStorage
  useEffect(() => {
    setMounted(true);
    setLang(getInitialLanguage());
    setIsDark(getInitialTheme());
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nexusos-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  // Save language to localStorage when it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nexusos-lang', lang);
    }
  }, [lang, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'es' : 'en';
    setLang(newLang);
  };

  const t = industryTranslations[lang];
  const common = t.common;
  const industry = t[industryKey];

  // Show loading skeleton during SSR/hydration to prevent flash
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#050410] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(108,63,206,0.3)]" />
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <IndustryLanguageContext.Provider value={{ lang, setLang, t }}>
        <div className={`min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-[#050410]' : 'bg-gray-50'
        }`}>
          {/* Aurora Background - only for dark mode */}
          {isDark && <div className="aurora-bg" />}
          
          {/* Header */}
          <header className={`relative z-50 border-b sticky top-0 transition-colors duration-300 ${
            isDark 
              ? 'border-[rgba(167,139,250,0.1)] bg-[#0A0820]/80 backdrop-blur-xl' 
              : 'border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm'
          }`}>
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/portal" 
                  className={`flex items-center gap-2 transition-colors ${
                    isDark 
                      ? 'text-[var(--text-dim)] hover:text-[var(--nexus-gold)]' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">{common.backToPortal}</span>
                </Link>
                <div className={`w-px h-6 ${isDark ? 'bg-[var(--glass-border)]' : 'bg-gray-300'}`} />
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${industryColor}20` }}
                  >
                    {industryIcon}
                  </div>
                  <div>
                    <h1 className={`font-bold ${isDark ? 'text-[#EDE9FE]' : 'text-gray-900'}`}>
                      NexusOS {industry.name}
                    </h1>
                    <p className={`text-xs ${isDark ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>
                      {industry.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right Section - Controls */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg border transition-all ${
                    isDark 
                      ? 'border-[rgba(167,139,250,0.2)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)]' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                  title={isDark ? (lang === 'en' ? 'Light mode' : 'Modo claro') : (lang === 'en' ? 'Dark mode' : 'Modo oscuro')}
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                    isDark 
                      ? 'border-[rgba(167,139,250,0.2)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)]' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}</span>
                </button>
                
                {/* Login Button */}
                <Link 
                  href="/login"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                    isDark 
                      ? 'border-[rgba(167,139,250,0.2)] text-[#9D7BEA] hover:bg-[rgba(108,63,206,0.1)]' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{common.login}</span>
                </Link>

                {/* CTA Button */}
                <a 
                  href="#precios"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#F0B429] to-[#d97706] text-white text-sm font-medium hover:opacity-90"
                >
                  {common.viewPrices}
                </a>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative z-10">
            {children}
          </main>

          {/* Screenshots Section */}
          {screenshots.length > 0 && (
            <section className={`py-16 px-4 ${isDark ? 'bg-[rgba(108,63,206,0.03)]' : 'bg-gray-100'}`}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-[#EDE9FE]' : 'text-gray-900'}`} style={{ fontFamily: 'var(--font-cormorant)' }}>
                    {common.screenshots}
                  </h2>
                  <p className={`${isDark ? 'text-[#9D7BEA]' : 'text-gray-600'}`}>
                    {lang === 'en' ? 'See NexusOS in action' : 'Mira NexusOS en acción'}
                  </p>
                </div>
                <ImageCarousel images={screenshots} isDark={isDark} />
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className={`relative z-10 border-t py-6 px-4 ${
            isDark 
              ? 'border-[rgba(167,139,250,0.1)] bg-[#0A0820]/50' 
              : 'border-gray-200 bg-white'
          }`}>
            <div className="max-w-7xl mx-auto text-center">
              <p className={`text-sm ${isDark ? 'text-[#9D7BEA]' : 'text-gray-500'}`}>
                © 2024 NexusOS {industry.name} — {common.madeIn}
              </p>
            </div>
          </footer>
        </div>
      </IndustryLanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

// Re-export for convenience
export { CheckCircle };
