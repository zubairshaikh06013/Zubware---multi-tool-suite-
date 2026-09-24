import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight, ShieldCheck, Zap, Layers, CheckCircle2, ChevronRight, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ToolMeta } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../lib/i18n';
import { getLinkUrl } from '../lib/paths';
import { ZubwareLogo } from './ZubwareLogo';

interface HomepageHeroProps {
  tools: ToolMeta[];
  onNavigate: (path: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const POPULAR_TOOL_IDS = [
  'splitdrop',
  'image-compressor',
  'pdf-merge',
  'resume-builder',
  'qr-generator',
  'unit-converter'
];

export const HomepageHero: React.FC<HomepageHeroProps> = ({
  tools,
  onNavigate,
  selectedCategory,
  onSelectCategory
}) => {
  const { t, currentLang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Filter tools based on live query
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return tools
      .filter((tool) => {
        const titleMatch = tool.title.toLowerCase().includes(q);
        const navMatch = tool.navTitle?.toLowerCase().includes(q);
        const descMatch = tool.description.toLowerCase().includes(q);
        const catMatch = tool.category.toLowerCase().includes(q);
        const idMatch = tool.id.toLowerCase().includes(q);
        const tagMatch = tool.tags?.some((t) => t.toLowerCase().includes(q));
        const featureMatch = tool.features?.some((f) => f.toLowerCase().includes(q));
        return titleMatch || navMatch || descMatch || catMatch || idMatch || tagMatch || featureMatch;
      })
      .slice(0, 25);
  }, [searchQuery, tools]);

  // Handle keyboard navigation in search results
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelectTool(searchResults[highlightedIndex]);
      } else if (searchResults.length > 0) {
        handleSelectTool(searchResults[0]);
      }
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      setIsFocused(false);
      searchInputRef.current?.blur();
    }
  };

  const handleSelectTool = (tool: ToolMeta) => {
    setSearchQuery('');
    setIsFocused(false);
    onNavigate(getLinkUrl(tool.path));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsContainerRef.current &&
        !resultsContainerRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Popular quick tags from tools list
  const popularTools = useMemo(() => {
    return POPULAR_TOOL_IDS.map((id) => tools.find((t) => t.id === id)).filter(Boolean) as ToolMeta[];
  }, [tools]);


  return (
    <section className="relative pt-4 pb-8 sm:pt-6 sm:pb-12 text-center">
      {/* Background glow ambient effect */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[90px] rounded-full" />
        <div className="w-[400px] h-[250px] bg-rose-500/5 dark:bg-rose-500/10 blur-[80px] rounded-full translate-x-20 -translate-y-10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6">
        {/* Official Zubware Brand Presentation (Brand Identity Sheet) */}
        <div className="flex flex-col items-center justify-center select-none pt-2 sm:pt-4">
          <div className="inline-flex items-center justify-center gap-3 sm:gap-4.5 group">
            <ZubwareLogo className="w-11 h-11 sm:w-16 sm:h-16 shrink-0 drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col text-left justify-center">
              <span className="font-brand font-[850] text-3xl sm:text-5xl leading-none text-slate-900 dark:text-white tracking-[-0.035em]">
                Zubware
              </span>
              <span className="font-brand-sub text-[10px] sm:text-[13px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.28em] uppercase leading-none mt-1.5 sm:mt-2">
                Multi Tool Suite
              </span>
            </div>
          </div>
        </div>

        {/* Website Main Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2]">
          {getTranslation(currentLang, 'homepageHeroTitle', 'Free Online Tools for Everyday Tasks')}
        </h1>

        {/* Website Intro Description */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {getTranslation(
            currentLang,
            'homepageHeroSubtitle',
            'Zubware is your all-in-one privacy-first toolkit. 300+ instant browser tools for PDF, Image, Video, Developer, Career, and Productivity — 100% free with zero server uploads.'
          )}
        </p>

        {/* Streamlined Trust Line */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant In-Browser Speed</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            <span>Zero Server Uploads</span>
          </span>
        </div>

        {/* ========================================================
            BADA SA SEARCH BAR (ORIGINAL PROMINENT SEARCH BAR - ROUNDED PILL)
            ======================================================== */}
        <div className="relative max-w-3xl mx-auto w-full pt-2">
          <div
            className={`relative flex items-center transition-all duration-300 rounded-full ${
              isFocused
                ? 'shadow-xl shadow-slate-900/10 dark:shadow-black/50 ring-1 ring-slate-300/90 dark:ring-slate-700/90'
                : 'shadow-md shadow-slate-900/5 hover:shadow-lg'
            }`}
          >
            {/* Search Icon */}
            <div className={`absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              isFocused ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
            }`}>
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Big Search Input */}
            <input
              ref={searchInputRef}
              type="text"
              id="homepage-main-search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder={getTranslation(
                currentLang,
                'homepageSearchPlaceholder',
                'Search 300+ free tools (e.g. Split Image, PDF Merge, Background Remover, Password Protect...)'
              )}
              className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-24 sm:pr-32 text-sm sm:text-base font-medium rounded-full bg-white dark:bg-slate-900/95 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none focus:ring-0 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />

            {/* Right-side controls (Clear button & Keyboard shortcut hint) */}
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setHighlightedIndex(-1);
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg select-none">
                <span>⌘K</span>
              </kbd>
            </div>
          </div>

          {/* ========================================================
              LIVE SEARCH RESULTS DROPDOWN
              ======================================================== */}
          <AnimatePresence>
            {isFocused && searchQuery.trim().length > 0 && (
              <motion.div
                ref={resultsContainerRef}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left"
              >
                {/* Header with match count */}
                <div className="px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  <span>
                    Found <strong className="text-indigo-600 dark:text-indigo-400">{searchResults.length}</strong> matching tools
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <span>Use ↑↓ to navigate,</span>
                    <CornerDownLeft className="w-3 h-3 inline" />
                    <span>Enter to open</span>
                  </span>
                </div>

                {/* Results list */}
                <div className="max-h-80 sm:max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-1.5 sm:p-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((tool, idx) => (
                      <div
                        key={tool.id}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        onClick={() => handleSelectTool(tool)}
                        className={`group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl cursor-pointer transition-all ${
                          highlightedIndex === idx
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                            {tool.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {tool.title}
                              </h4>
                              {tool.badge && (
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="shrink-0 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all cursor-pointer"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No tools found matching &ldquo;{searchQuery}&rdquo;
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Try searching for general keywords like &ldquo;PDF&rdquo;, &ldquo;Image&rdquo;, &ldquo;Split&rdquo;, &ldquo;Converter&rdquo;, or &ldquo;Calculator&rdquo;.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popular Quick Suggestions */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
            <span className="font-medium text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{getTranslation(currentLang, 'popularSearches', 'Quick:')}</span>
            </span>
            {popularTools.map((tool) => (
              <a
                key={tool.id}
                href={getLinkUrl(tool.path)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(tool.path));
                }}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>{tool.icon}</span>
                <span>{tool.navTitle || tool.title}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
