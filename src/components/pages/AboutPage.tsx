import { ABOUT_QUALITY, REPORT_A_PROBLEM } from '../../data/siteTrustContent';
import React from 'react';
import { Sparkles, ShieldCheck, Zap, Heart, Globe, FileText, Calculator, Home, Briefcase, Image as ImageIcon, QrCode } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate: _onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 my-4 sm:my-6">
      
      {/* Hero Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs inline-block mb-3 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
          Zubware Mission & Engineering
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          About Zubware
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          Practical online tools with clear privacy choices: local processing where available and transparent disclosure when a tool uses an online service.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
        
        {/* Mission Statement */}
        <div className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Our Core Mission
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Zubware was created by <strong>Zubair Shaikh</strong> to solve a pervasive problem on the modern web: traditional file tools force users to upload their confidential documents, private photos, and personal information to unknown third-party cloud servers.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Many Zubware utilities process data directly inside your browser using HTML5 Canvas, WebAssembly, and modern Web APIs. Some features use online services: for example, Background Remover's Smart AI Removal sends a selected photo to Cloudflare only after you consent and start. Its Quick and Private modes process the photo on your device.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Client-Side Privacy</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                No Zubware server upload for local-processing tools. Your files stay securely in browser memory.
              </p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <Zap className="w-6 h-6 text-amber-500 mb-2" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Instant Execution</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                No server upload wait time. Enjoy rapid local conversion, compression, and mathematical calculations.
              </p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex flex-col justify-between">
            <div>
              <Heart className="w-6 h-6 text-emerald-500 mb-2" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Free to Use</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                No mandatory accounts, no hidden paywalls, and zero added watermarks across our browser utilities.
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">Who maintains Zubware & how to report corrections</h2>
          <p>{ABOUT_QUALITY}</p>
          <p>{REPORT_A_PROBLEM}</p>
          <a href="/contact" className="text-indigo-600 dark:text-indigo-400 underline">Contact Zubair about a tool or correction</a>
        </section>

        {/* Tools Included */}
        <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> The Zubware Suite (300+ Modern Online Tools)
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <li className="glass-card p-3.5 rounded-xl font-medium flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span><strong>Advanced PDF Suite</strong>: Drag-and-drop page reordering, per-page 90° rotation, thumbnail inspector, split, merge, and compression options.</span>
            </li>
            <li className="glass-card p-3.5 rounded-xl font-medium flex items-start gap-2.5">
              <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Income Tax & Financial Suite</strong>: Selected-year IRS and India tax estimates with standard deductions and Section 87A rebate models.</span>
            </li>
            <li className="glass-card p-3.5 rounded-xl font-medium flex items-start gap-2.5">
              <Home className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Home Loan & Down Payment Roadmap</strong>: Target savings plans with compound growth, mortgage calculators, and PMI estimators.</span>
            </li>
            <li className="glass-card p-3.5 rounded-xl font-medium flex items-start gap-2.5">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <span><strong>Career & Resume Studio</strong>: ATS resume scoring, work experience overlap calculator, CV builders, and professional summary generators.</span>
            </li>
            <li className="glass-card p-3.5 rounded-xl font-medium flex items-start gap-2.5">
              <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Batch Image Studio</strong>: High-speed local compression, format conversion (PNG, JPG, WebP and browser-dependent AVIF), cropping, and photo merging.</span>
            </li>
            <li className="glass-card p-3.5 rounded-xl font-medium flex items-start gap-2.5">
              <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <span><strong>QR & Business Card Suite</strong>: vCard QR code generator with executive theme mockups and vector exports.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
