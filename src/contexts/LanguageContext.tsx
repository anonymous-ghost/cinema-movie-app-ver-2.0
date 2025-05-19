import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import i18n from 'i18next';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || i18n.language;
  });

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // При першому завантаженні встановлюємо мову на англійську, якщо вона не встановлена
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (!savedLanguage) {
      i18n.changeLanguage('en');
      setLanguage('en');
      localStorage.setItem('language', 'en');
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 