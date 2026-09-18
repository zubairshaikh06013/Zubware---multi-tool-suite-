import React, { useState } from 'react';
import { Search, Moon, Sun, ChevronDown, Wrench, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTranslatedTools } from '../data/toolsData';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';
import { ZubwareLogo } from './ZubwareLogo';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  currentPath,
  onNavigate,
  currentLang,
  onChangeLang,
}) => {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { t } = useLanguage();

  const translatedTools = getTranslatedTools(currentLang);
  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const isHomepage = currentPath === '/' || currentPath === '/index.html' || currentPath === '';

  return (
    <header className="w-full backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 border-b border-white/60 dark:border-white/10 shadow-sm shadow-slate-900/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo - Official Lockup */}
        <a
          href={getLinkUrl('/')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(getLinkUrl('/'));
          }}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none"
        >
          <ZubwareLogo className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center">
            <span className="font-brand font-[850] text-[21px] sm:text-[24px] leading-none text-slate-900 dark:text-white tracking-[-0.035em] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Zubware
            </span>
            <span className="font-brand-sub text-[8px] sm:text-[9.5px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.24em] uppercase leading-none mt-1 sm:mt-1.5">
              Multi Tool Suite
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1.5 font-medium text-xs lg:text-sm text-slate-600 dark:text-slate-300">
          <a
            href={getLinkUrl('/')}
            onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/')); }}
            aria-label="Zubware Home"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentPath === '/' || currentPath === '/index.html'
                ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs'
                : 'hover:text-indigo-600 hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Home
          </a>

          <a
            href={getLinkUrl('/dashboard.html')}
            onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/dashboard.html')); }}
            aria-label="User Dashboard"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentPath.includes('dashboard')
                ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs'
                : 'hover:text-indigo-600 hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Dashboard
          </a>

          <a
            href={getLinkUrl('/categories.html')}
            onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/categories.html')); }}
            aria-label="Tool Categories"
            className={`px-3 py-1.5 rounded-xl transition-all ${
              currentPath.includes('categories')
                ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs'
                : 'hover:text-indigo-600 hover:bg-white/60 dark:hover:bg-slate-800/60'
            }`}
          >
            Categories
          </a>

          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
              aria-controls="tools-dropdown-menu"
              aria-label="Toggle Free Tools Menu"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('freeTools', 'Free Tools')} <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div
                  id="tools-dropdown-menu"
                  role="menu"
                  aria-label="Free Tools Menu"
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-64 max-h-96 overflow-y-auto bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 z-50"
                >
                  {translatedTools.map((tool) => (
                    <a
                      key={tool.id}
                      href={getLinkUrl(tool.path)}
                      role="menuitem"
                      aria-label={tool.title}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(getLinkUrl(tool.path));
                        setToolsDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                        currentPath === tool.path
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900/50'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-lg" aria-hidden="true">{tool.icon}</span>
                      <span className="truncate">{tool.navTitle}</span>
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search (Only shown on inner pages; homepage has prominent hero search) */}
          {!isHomepage && (
            <>
              <div className="relative hidden sm:block">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none" aria-hidden="true">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  readOnly
                  onClick={onOpenSearch}
                  aria-label={t('search', 'Search tools...')}
                  placeholder={t('search', 'Search tools...')}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs w-36 lg:w-48 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 cursor-pointer focus:ring-2 focus:ring-indigo-500/50 transition-all hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-xs"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenSearch}
                aria-label="Open search dialog"
                className="sm:hidden p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {/* Multi-Language Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              onBlur={() => setTimeout(() => setLangDropdownOpen(false), 200)}
              aria-expanded={langDropdownOpen}
              aria-haspopup="true"
              aria-controls="lang-dropdown-menu"
              aria-label={t('selectLanguage', 'Select Language')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/50 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all shadow-xs cursor-pointer"
              title={t('selectLanguage', 'Select Language')}
            >
              <span aria-hidden="true">{activeLangObj.flag}</span>
              <span className="uppercase text-[11px] hidden xs:inline-block">{activeLangObj.code}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  id="lang-dropdown-menu"
                  role="menu"
                  aria-label="Language options"
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 space-y-0.5 max-h-80 overflow-y-auto z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {t('selectLanguage', 'Select Language')}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      role="menuitem"
                      aria-label={`Switch language to ${lang.nativeName}`}
                      onClick={() => {
                        onChangeLang(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                        currentLang === lang.code
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark / Light Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to Light Mode (Day)' : 'Switch to Dark Mode (Night)'}
            className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-amber-400 transition-all cursor-pointer shadow-xs flex items-center justify-center"
            title={darkMode ? `${t('themeLight', 'Light Mode')} (Day)` : `${t('themeDark', 'Dark Mode')} (Night)`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 fill-slate-700/10 transition-transform" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
