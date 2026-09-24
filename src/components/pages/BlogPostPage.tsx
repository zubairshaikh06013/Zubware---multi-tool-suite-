import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Layers,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { BlogArticle } from '../../types';
import { TOOLS_DATA } from '../../data/toolsData';
import { SEOHead } from '../SEOHead';
import { Breadcrumb } from '../Breadcrumb';
import { getLinkUrl } from '../../lib/paths';

interface BlogPostPageProps {
  article: BlogArticle;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ article, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const breadcrumbs = [
    { label: 'Home', path: getLinkUrl('/') },
    { label: 'Guides & Articles', path: getLinkUrl('/blog') },
    { label: article.title }
  ];

  // Resolve related tools from tool IDs
  const relatedTools = useMemo(() => {
    if (!article.relatedToolIds || article.relatedToolIds.length === 0) {
      return TOOLS_DATA.slice(0, 6);
    }
    return article.relatedToolIds
      .map((id) => TOOLS_DATA.find((t) => t.id === id))
      .filter(Boolean);
  }, [article.relatedToolIds]);

  // Format date helper
  const formattedDate = useMemo(() => {
    try {
      const d = new Date(article.publishedTime);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Sept 24, 2026';
    }
  }, [article.publishedTime]);

  return (
    <>
      <SEOHead
        title={article.metaTitle}
        description={article.description}
        canonicalPath={article.canonicalPath}
        breadcrumbs={breadcrumbs}
        faqs={article.faqs}
        howTo={article.howTo}
        article={{
          title: article.title,
          description: article.description,
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authorName: article.author.name,
          authorUrl: article.author.url,
          section: article.category,
          tags: article.tags
        }}
      />

      <article className="max-w-4xl mx-auto space-y-10 my-8 px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbs} onNavigate={onNavigate} />

        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-200/80 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs border border-indigo-200/50 dark:border-indigo-800/50">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readingTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                Z
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  {article.author.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {article.author.role || 'Technical Documentation Team'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Published: {formattedDate}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500">
                100% Client-Side Verified
              </span>
            </div>
          </div>
        </header>

        {/* Quick Summary / Key Takeaways Box */}
        {article.takeaways && article.takeaways.length > 0 && (
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-indigo-200/60 dark:border-indigo-900/60 space-y-3 bg-gradient-to-br from-indigo-50/50 to-white/50 dark:from-indigo-950/30 dark:to-slate-900/30">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Key Takeaways & Core Principles</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {article.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Table of Contents */}
        {article.sections && article.sections.length > 0 && (
          <nav aria-label="Table of Contents" className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" /> Table of Contents
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {article.sections.map((sec) => (
                <a key={sec.id} href={`#${sec.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" /> {sec.title}
                </a>
              ))}
              {article.howTo && (
                <a href="#step-by-step-guide" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" /> Step-by-Step Instructions
                </a>
              )}
              {article.faqs && article.faqs.length > 0 && (
                <a href="#faqs" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" /> Frequently Asked Questions
                </a>
              )}
              {relatedTools.length > 0 && (
                <a href="#related-tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" /> Related Zubware Tools
                </a>
              )}
            </div>
          </nav>
        )}

        {/* Dynamic Sections Content */}
        <div className="space-y-12 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
          {article.sections && article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <div className="space-y-3 whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                {section.content}
              </div>
            </section>
          ))}

          {/* Step-by-Step Guide with Zubware */}
          {article.howTo && (
            <section id="step-by-step-guide" className="space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-indigo-600 dark:text-indigo-400">Step-by-Step:</span> {article.howTo.name}
                </h2>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/50">
                  100% Client-Side Private
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {article.howTo.description}
              </p>

              <div className="space-y-4">
                {article.howTo.steps.map((step, idx) => (
                  <div key={idx} className="glass-card p-5 sm:p-6 rounded-2xl flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                        {step.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Primary Tool Launch CTA Card */}
              {relatedTools.length > 0 && relatedTools[0] && (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600/10 via-purple-600/5 to-transparent">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      Ready to get started?
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Launch {relatedTools[0].title} — Free & Unlimited
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Runs directly in your browser. Zero server uploads, zero watermarks, and instant processing.
                    </p>
                  </div>
                  <a
                    href={getLinkUrl(relatedTools[0].path)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(getLinkUrl(relatedTools[0].path));
                    }}
                    className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 group transition-all shrink-0 cursor-pointer"
                  >
                    <span>Launch {relatedTools[0].navTitle || relatedTools[0].title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </section>
          )}

          {/* FAQ Section */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="faqs" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3 pt-2">
                {article.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Related Zubware Tools Section with Genuine Anchor Links */}
          {relatedTools.length > 0 && (
            <section id="related-tools" className="space-y-4 scroll-mt-24 pt-6 border-t border-slate-200/80 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400">Related</span> Free Zubware Utilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Explore specialized browser tools related to this guide:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {relatedTools.map((tool, idx) => (
                  <a
                    key={tool.id}
                    href={getLinkUrl(tool.path)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(getLinkUrl(tool.path));
                    }}
                    className="glass-card p-4 rounded-2xl cursor-pointer hover:border-indigo-500/40 transition-all group block shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{tool.icon}</span>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                        {idx === 0 ? 'Primary Tool' : (tool.badge || 'Browser Tool')}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Article Footer & Author Info Box */}
        <footer className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 mt-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              Z
            </div>
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                Published by {article.publisher.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Researched and documented by the {article.author.name} ({article.author.role || 'Technical Documentation Team'}).
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
            Zubware is dedicated to privacy-first, client-side web tools. All calculations and file transformations in our suite are verified for zero server telemetry and standards compliance.
          </p>
        </footer>
      </article>
    </>
  );
};
