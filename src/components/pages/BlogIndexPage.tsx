import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { BLOG_ARTICLES } from '../../data/blogArticles';
import { SEOHead } from '../SEOHead';
import { Breadcrumb } from '../Breadcrumb';
import { getLinkUrl } from '../../lib/paths';

interface BlogIndexPageProps {
  onNavigate: (path: string) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigate }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = ['All', ...Array.from(new Set(BLOG_ARTICLES.flatMap((a) => a.tags)))];

  const filteredArticles = selectedTag === 'All'
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter((a) => a.tags.includes(selectedTag));

  const breadcrumbs = [
    { label: 'Home', path: getLinkUrl('/') },
    { label: 'Guides & Articles', path: getLinkUrl('/blog') }
  ];

  return (
    <>
      <SEOHead
        title="Guides & Practical Tutorials — Zubware Knowledge Base"
        description="Comprehensive, step-by-step guides on PDF compression, file optimization, image editing, and productivity workflows. Private, client-side, zero-fluff tutorials."
        canonicalPath="/blog"
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-5xl mx-auto space-y-8 my-8 px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Zubware Knowledge Base & Technical Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Guides, Tutorials & Best Practices
          </h1>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth technical guides designed to help you optimize documents, convert media, and master browser-based productivity workflows without sacrificing quality or privacy.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Tag className="w-3.5 h-3.5" /> Topic:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="glass-card flex flex-col justify-between p-6 sm:p-8 rounded-3xl group hover:border-indigo-500/40 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {article.readingTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Sept 23, 2026
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  <a
                    href={getLinkUrl(article.canonicalPath)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(getLinkUrl(article.canonicalPath));
                    }}
                  >
                    {article.title}
                  </a>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {article.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                    Z
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {article.author.name}
                  </span>
                </div>

                <a
                  href={getLinkUrl(article.canonicalPath)}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(getLinkUrl(article.canonicalPath));
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Client-Side Privacy Callout */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-200/50 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mt-12">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Learn It, Then Practice 100% Free & Privately
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                All Zubware tools mentioned in our guides process files in your browser with zero remote server uploads.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate(getLinkUrl('/categories.html'))}
            className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shrink-0 hover:opacity-90 transition-opacity"
          >
            Explore 300+ Free Tools
          </button>
        </div>
      </div>
    </>
  );
};
