import React, { useState } from 'react';
import { SEOHead } from '../SEOHead';
import { Search, Home, ArrowRight, Grid, Sparkles } from 'lucide-react';
import { getLinkUrl } from '../../lib/paths';
import { TOOLS_DATA } from '../../data/toolsData';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = searchTerm.trim()
    ? TOOLS_DATA.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6)
    : TOOLS_DATA.slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 text-center">
      <SEOHead
        title="Page Not Found (404) — Zubware"
        description="The page you requested could not be found. Search 300+ free online tools for image compression, PDF editing, audio processing, and document generation."
        canonicalPath="/404.html"
        robots="noindex, follow"
      />

      <div className="glass-panel p-8 sm:p-12 rounded-3xl space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-300 font-extrabold text-xs border border-red-200 dark:border-red-900">
          Error 404
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          The page or tool route you are looking for doesn't exist or may have moved. Use the search bar below or explore popular Zubware tools.
        </p>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${TOOLS_DATA.length} free online tools...`}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={getLinkUrl('/')}
            onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/')); }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </a>
          <a
            href={getLinkUrl('/categories.html')}
            onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/categories.html')); }}
            className="px-5 py-2.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-slate-300 transition-all"
          >
            <Grid className="w-4 h-4" /> Browse Categories
          </a>
        </div>
      </div>

      {/* Suggested Popular Tools Grid */}
      <div className="text-left space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" /> Popular Free Tools You Might Be Looking For
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <a
              key={tool.id}
              href={getLinkUrl(tool.path)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(getLinkUrl(tool.path));
              }}
              className="glass-card p-4 rounded-2xl flex items-start gap-3 hover:border-indigo-500/40 group transition-all"
            >
              <span className="text-2xl p-2 rounded-xl bg-indigo-50/80 dark:bg-slate-800 shrink-0 group-hover:scale-110 transition-transform">
                {tool.icon}
              </span>
              <div className="overflow-hidden">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {tool.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
