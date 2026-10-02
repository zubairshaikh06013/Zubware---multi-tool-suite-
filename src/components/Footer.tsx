import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLinkUrl } from '../lib/paths';
import { ZubwareLogo } from './ZubwareLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="mt-20 border-t border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl pt-12 pb-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-200/60 dark:border-slate-800/60 text-center sm:text-left">
          <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('zeroServerUploads', 'Client-Side Privacy')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('zeroServerUploadsDesc', 'Processing happens locally in your browser for offline tools; files are not uploaded to Zubware servers.')}
              </p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/60 text-amber-500 shrink-0 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('instantSpeed', 'Fast Processing')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('instantSpeedDesc', 'Optimized browser-based execution using modern WebAssembly and Canvas APIs without upload bottlenecks.')}
              </p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-500 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('freeForever', 'Free Online Tools')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('freeForeverDesc', 'No subscription, watermarks, or daily caps. High quality output for creators and professionals.')}
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          {/* Col 1 Brand - Official Lockup */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <ZubwareLogo className="w-9 h-9 shrink-0 drop-shadow-sm" />
              <div className="flex flex-col justify-center">
                <span className="font-brand font-[850] text-[22px] leading-none text-slate-900 dark:text-white tracking-[-0.035em]">
                  Zubware
                </span>
                <span className="font-brand-sub text-[8.5px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.24em] uppercase leading-none mt-1">
                  Multi Tool Suite
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              300+ free online tools for creators, developers, designers, and students with private browser processing.
            </p>
          </div>

          {/* Col 2 Image Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('imageTools', 'Image Tools')}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href={getLinkUrl('/image-splitter-merger')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-splitter-merger')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image Splitter & Combiner
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/image-compressor')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-compressor')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image Compressor
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/image-converter')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/image-converter')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 PDF & Utilities */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('pdfAndUtilities', 'PDF & Utilities')}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href={getLinkUrl('/pdf-merge')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/pdf-merge')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Merge Tool
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/pdf-split')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/pdf-split')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Splitter & Extractor
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/qr-generator')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/qr-generator')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  QR Code Generator
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/resume-builder')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/resume-builder')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Resume Builder
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 Platform & Legal */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t('platformAndSupport', 'Platform & Support')}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li>
                <a href={getLinkUrl('/dashboard')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/dashboard')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-indigo-600 dark:text-indigo-400 transition-colors">
                  ⭐ User Dashboard
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/categories')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/categories')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ⚡ Tool Categories Directory
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/blog')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/blog')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                  📚 Guides & Tutorials
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/help')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/help')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  ❓ Help Center & Guides
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/changelog')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/changelog')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  📜 Changelog & Updates
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/feedback')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/feedback')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  💬 Send Feedback
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/about')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/about')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('about', 'About Zubware')}
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/contact')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/contact')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('contact', 'Contact Us')}
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/privacy')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/privacy')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('privacy', 'Privacy Policy')}
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/terms')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/terms')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('terms', 'Terms of Service')}
                </a>
              </li>
              <li>
                <a href={getLinkUrl('/disclaimer')} onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/disclaimer')); }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {t('disclaimer', 'Disclaimer')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <p>{t('copyright', '© 2026 Zubware.com. All Rights Reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};
