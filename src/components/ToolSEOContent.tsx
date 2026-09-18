import React, { useState } from 'react';
import { ToolMeta, FAQItem } from '../types';
import { ChevronDown, ShieldCheck, Zap, HardDrive, CheckCircle2, ArrowRight } from 'lucide-react';
import { getLinkUrl } from '../lib/paths';

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

  // Generate dynamic FAQs if not provided on tool object
  const defaultFaqs: FAQItem[] = [
    {
      question: `Is ${tool.navTitle} completely free to use?`,
      answer: `Yes, ${tool.title} is 100% free with unlimited usage. There are no watermarks, hidden subscriptions, or registration requirements.`
    },
    {
      question: `Are my files uploaded to any server when using ${tool.navTitle}?`,
      answer: `No. ${tool.title} operates entirely inside your web browser using HTML5 and modern WebAssembly. Your confidential files never leave your device memory.`
    },
    {
      question: `Which file formats and devices are supported by ${tool.navTitle}?`,
      answer: `${tool.title} works on Windows, macOS, Linux, iOS, and Android. It supports standard modern web file formats and runs in Chrome, Safari, Firefox, and Edge.`
    },
    {
      question: `How fast is processing with ${tool.navTitle}?`,
      answer: `Since processing is performed locally on your device's CPU/GPU, execution is sub-second and instant without network lag or queue delays.`
    }
  ];

  const faqsToUse = tool.faq && tool.faq.length > 0 ? tool.faq : defaultFaqs;

  // Filter related tools in same category excluding current
  const relatedTools = allTools
    .filter((t) => t.id !== tool.id && (t.category === tool.category || tool.category.includes(t.category)))
    .slice(0, 6);

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
          <strong>{tool.title}</strong> is a free, web-based online utility designed by Zubware to assist users with fast, browser-side file processing. {tool.description}
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
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Privacy & Local Execution
            </h3>
            <p>
              Unlike legacy online convertors that upload confidential documents and media to third-party cloud servers, {tool.navTitle} runs 100% locally in client-side memory using modern JavaScript and WebAssembly engines.
            </p>
            <p>
              This architecture guarantees absolute privacy protection, zero data transmission risk, and instant performance unconstrained by upload bandwidth limits.
            </p>
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
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">100% Client Browser</span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Cost / License</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-1 block">Free / Unlimited</span>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block uppercase">Server Uploads</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">Zero (0 Bytes)</span>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP HOW TO USE */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          How to Use {tool.navTitle}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <li className="glass-card p-6 rounded-2xl relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">1</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Select or Drag Files</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Open {tool.title} in your browser and upload or drag-and-drop your target files into the interactive work area.
            </p>
          </li>
          <li className="glass-card p-6 rounded-2xl relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">2</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Configure Settings</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Adjust parameters, formats, dimensions, compression levels, or custom preferences using real-time canvas controls.
            </p>
          </li>
          <li className="glass-card p-6 rounded-2xl relative">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mb-4">3</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Export & Download</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Click export to generate your processed file instantly in your local browser memory and save it directly to your drive.
            </p>
          </li>
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

    </div>
  );
};
