import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = i18n.language;
  
  const languages = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];
  
  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };
  
  const currentLangObj = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flag">{currentLangObj.flag}</span>
        <span className="lang-name">{currentLangObj.name}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === currentLanguage ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 