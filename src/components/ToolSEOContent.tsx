import React, { useState } from 'react';
import { ToolMeta, FAQItem } from '../types';
import { ChevronDown, ShieldCheck, Zap, HardDrive, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { getLinkUrl } from '../lib/paths';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { getRelatedTools, getMatchingGuidesForTool } from '../lib/workflowMap';

interface ToolSEOContentProps {
  tool: ToolMeta;
  allTools: ToolMeta[];
  onNavigate: (path: string) => void;
}

export const ToolSEOContent: React.FC<ToolSEOContentProps> = ({
  tool,
  allTools,
  onNavigate
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const NETWORK_DEPENDENT_TOOL_IDS = new Set([
    'api-request-builder',
    'website-downloader',
    'http-header-viewer'
  ]);
  const isNetworkTool = NETWORK_DEPENDENT_TOOL_IDS.has(tool.id);

  // Generate dynamic FAQs if not provided on tool object
  const defaultFaqs: FAQItem[] = [
    {
      question: `Is ${tool.navTitle} free to use?`,
      answer: `This Zubware tool is available to use in your browser. Availability of features and limits can vary by tool.`
    },
    {
      question: `How does ${tool.navTitle} handle data and privacy?`,
      answer: isNetworkTool
        ? `${tool.title} communicates directly with the specified external endpoints from your browser. Zubware does not store your payload data or requests on our servers.`
        : `Processing happens locally in your browser for this tool; files and data are not uploaded to Zubware servers.`
    },
    {
      question: `Which file formats and devices are supported by ${tool.navTitle}?`,
      answer: `${tool.title} works on Windows, macOS, Linux, iOS, and Android. It supports standard modern web file formats and runs in Chrome, Safari, Firefox, and Edge.`
    },
    {
      question: `How fast is processing with ${tool.navTitle}?`,
      answer: isNetworkTool
        ? `Processing speed depends on network latency and the response time of the target endpoint.`
        : `Processing is performed in your browser on your device's engine, eliminating server upload queues.`
    }
  ];

  const faqsToUse = tool.faq && tool.faq.length > 0 ? tool.faq : defaultFaqs;

  const isFileTool =
    tool.category.includes('PDF') ||
    tool.category.includes('Image') ||
    tool.category.includes('Video') ||
    tool.category.includes('Audio') ||
    (tool.features && tool.features.some(f => /upload|file|image|pdf|video|audio/i.test(f)));

  const isCalcOrConverter =
    tool.category.includes('Calculator') ||
    tool.category.includes('Converter') ||
    tool.category.includes('Financial') ||
    /calculator|converter/i.test(tool.title);

  const howToSteps = isFileTool
    ? [
        { title: 'Select or Drag Files', desc: `Open ${tool.title} in your browser and select or drop your files into the workspace.` },
        { title: 'Configure Settings', desc: `Adjust parameters, formats, dimensions, compression levels, or custom preferences.` },
        { title: 'Export & Download', desc: `Generate your processed output directly in your browser memory and save it to your device.` }
      ]
    : isCalcOrConverter
    ? [
        { title: 'Enter Your Values', desc: `Input your starting numbers, amounts, or parameters into ${tool.title}.` },
        { title: 'Select Options', desc: `Choose desired units, calculation modes, or conversion preferences.` },
        { title: 'View & Copy Results', desc: `Inspect real-time calculated results computed instantly in your browser.` }
      ]
    : [
        { title: 'Input or Configure Data', desc: `Enter or paste your text, code, or parameters into ${tool.title}.` },
        { title: 'Process or Generate', desc: `Execute the tool with your selected configuration options.` },
        { title: 'Copy or Save Output', desc: `Copy the formatted output or save the resulting file directly to your device.` }
      ];

  // Filter related tools with workflow clustering
  const relatedTools = getRelatedTools(tool, allTools, 6);

  // Find matching blog articles / guides
  const matchingGuides = getMatchingGuidesForTool(tool, BLOG_ARTICLES, 2);

  return (
    <div className="mt-12 space-y-12">
      
      {/* 1. ANSWER-FIRST SECTION (AEO - Generative AI & Search Engine Optimization) */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl space-y-6">
        <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Overview & Value Proposition
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            What is {tool.title}?
          </h2>
        </div>

        {/* Direct Answer Paragraph for AI Overviews / Snippets */}
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-indigo-50/50 dark:bg-indigo-950/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
          <strong>{tool.title}</strong> is an online utility provided by Zubware. {tool.description}
        </p>

        {/* Extended Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Key Capability Highlights
            </h3>
            <ul className="space-y-2">
              {tool.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy & Execution Architecture
            </h3>
            {isNetworkTool ? (
              <>
                <p>
                  {tool.navTitle} connects directly from your browser to the specified external endpoint.
                </p>
                <p>
                  Your requests and payloads are not recorded, intercepted, or stored on Zubware servers.
                </p>
              </>
            ) : (
              <>
                <p>
                  Processing happens locally in your browser for this tool; files and inputs are not uploaded to Zubware servers.
                </p>
                <p>
                  Execution is handled directly by your browser engine using modern Web APIs, avoiding server upload bottlenecks and latency.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. SPECIFICATIONS & SUPPORTED FORMATS */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          Technical Specifications & Supported Formats
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Category</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">{tool.category.replace(/^[^\w]+/, '')}</span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Execution Engine</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {isNetworkTool ? 'Browser (Direct API)' : 'Client Browser'}
            </span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Cost / License</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">Free / Unlimited</span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Server Uploads</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
              {isNetworkTool ? 'Direct to API Host' : 'None (Browser-Side)'}
            </span>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW TO USE */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          How to Use {tool.navTitle}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howToSteps.map((step, idx) => (
            <li key={idx} className="glass-card p-6 rounded-2xl relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">
                {idx + 1}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions about {tool.navTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Common queries answered concisely and factually.
          </p>
        </div>

        <div className="space-y-3">
          {faqsToUse.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HIGH-INTENT SEARCH QUERIES & PRESETS (SEO, AEO & GEO DISCOVERY) */}
      {tool.tags && tool.tags.length > 0 && (
        <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-500">⚡</span> Popular Search Queries & Target Use Cases
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Verified Intent Keywords
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            People frequently search for and use <strong>{tool.title}</strong> for the following specific file requirements, government portal uploads, and format conversions:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {tool.tags
              .filter(tag => !['Free', 'Online', 'Tool', 'Image', 'PDF', 'Photo'].includes(tag))
              .slice(0, 16)
              .map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 shadow-2xs hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 6. CRAWLABLE RELATED TOOLS INTERNAL LINKING */}
      {relatedTools.length > 0 && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Internal Ecosystem Links
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Related {tool.category.replace(/^[^\w]+/, '')} Tools
              </h2>
            </div>
            <a
              href={getLinkUrl('/categories.html')}
              onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/categories.html')); }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              Explore All Categories <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <a
                key={relTool.id}
                href={getLinkUrl(relTool.path)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(relTool.path));
                }}
                className="glass-card p-4 rounded-2xl flex items-start gap-3.5 hover:border-indigo-500/40 group transition-all"
              >
                <span className="text-2xl p-2.5 rounded-xl bg-indigo-50/80 dark:bg-slate-800/80 shrink-0 group-hover:scale-110 transition-transform">
                  {relTool.icon}
                </span>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {relTool.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {relTool.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 7. RECOMMENDED PRACTICAL GUIDES & EDITORIAL AUTHORITY */}
      {matchingGuides.length > 0 && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-200/60 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/40 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-900 dark:to-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-indigo-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Best Practice Guides & Tutorials
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Learn More About {tool.navTitle || tool.title} Workflows
              </h2>
            </div>
            <a
              href={getLinkUrl('/blog')}
              onClick={(e) => { e.preventDefault(); onNavigate(getLinkUrl('/blog')); }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-2 sm:mt-0"
            >
              Browse All Guides <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingGuides.map((guide) => (
              <a
                key={guide.slug}
                href={getLinkUrl(guide.canonicalPath)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(getLinkUrl(guide.canonicalPath));
                }}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 group transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                      {guide.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {guide.readingTime}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {guide.excerpt}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span>Read In-Depth Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
