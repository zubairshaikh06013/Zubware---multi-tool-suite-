import React, { useState } from 'react';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Edit3, 
  Briefcase, 
  Layers 
} from 'lucide-react';

interface SummaryOption {
  id: string;
  tone: string;
  description: string;
  text: string;
}

export const SummaryGeneratorTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [role, setRole] = useState<string>('Senior Software Engineer');
  const [yearsExp, setYearsExp] = useState<number>(6);
  const [coreSkills, setCoreSkills] = useState<string>('React, TypeScript, Node.js, Cloud Distributed Systems');
  const [metricAchievement, setMetricAchievement] = useState<string>('reducing API p99 latencies by 42% and leading multi-functional engineering teams');
  const [industryDomain, setIndustryDomain] = useState<string>('high-growth SaaS and fintech platforms');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Metric Preset Chips
  const metricChips = [
    'reduced API latency by 45%',
    'increased conversion rates by 28%',
    'managed a $3M annual budget',
    'mentored 12 junior engineers',
    'scaled product from 50k to 1M+ MAUs',
    'decreased AWS infrastructure costs by 30%'
  ];

  // 6 Curated Career Formulas
  const summaryOptions: SummaryOption[] = [
    {
      id: 'impact',
      tone: 'Results & High Impact',
      description: 'Ideal for tech leaders, senior individual contributors, and performance-focused hires.',
      text: `Results-driven ${role} with ${yearsExp}+ years of proven experience building scalable solutions across ${industryDomain}. Specialized in ${coreSkills}. Recognized for ${metricAchievement}. Adept at collaborating with executive stakeholders to translate high-level product strategy into robust, production-grade systems.`
    },
    {
      id: 'tech',
      tone: 'Technical Excellence & Architecture',
      description: 'Emphasizes deep technical depth, engineering rigor, code quality, and performance.',
      text: `Detail-oriented ${role} offering ${yearsExp}+ years of hands-on expertise architecting high-reliability systems using ${coreSkills}. Track record of ${metricAchievement} while instituting rigorous automated testing and CI/CD best practices across ${industryDomain}.`
    },
    {
      id: 'leadership',
      tone: 'Executive Leadership & Strategy',
      description: 'Best for managers, directors, staff/principal leads, and cross-functional team leaders.',
      text: `Accomplished ${role} with ${yearsExp}+ years of progressive leadership driving digital execution and organizational agility in ${industryDomain}. Expert in ${coreSkills}. Proven champion of engineering culture, with verified successes including ${metricAchievement}.`
    },
    {
      id: 'pivot',
      tone: 'Career Pivot & Domain Adaptability',
      description: 'Perfect for professionals shifting industries or bringing complementary cross-domain skills.',
      text: `Dynamic ${role} blending ${yearsExp}+ years of versatile experience with acute proficiency in ${coreSkills}. Proven track record of accelerated onboarding and delivering measurable wins, notably ${metricAchievement}. Excited to apply analytical rigor and cross-industry problem solving to high-impact teams.`
    },
    {
      id: 'entry',
      tone: 'Entry Level / High-Velocity Learner',
      description: 'Crafted for junior specialists, bootcamp grads, and ambitious career starters.',
      text: `Proactive and detail-minded ${role} possessing rigorous practical foundation in ${coreSkills}. Demonstrated execution capability through ${metricAchievement}. Committed to writing clean, maintainable code and accelerating feature delivery within collaborative agile environments.`
    },
    {
      id: 'innovation',
      tone: 'Innovation & Problem Solver',
      description: 'Highlights creative thinking, system optimization, and zero-to-one problem solving.',
      text: `Innovative ${role} with ${yearsExp}+ years of experience turning complex, ambiguous requirements into streamlined user-centric products. Deeply skilled in ${coreSkills}. Recognized for ${metricAchievement} and establishing scalable architectures in ${industryDomain}.`
    }
  ];

  const handleApplySummary = (text: string) => {
    const current = getActiveResume();
    const updated = {
      ...current,
      personalInfo: {
        ...current.personalInfo,
        summary: text
      }
    };
    saveActiveResume(updated);
    onShowToast('Applied summary to active resume profile!');
    if (onNavigate) {
      onNavigate('/resume-builder.html');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('Summary copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Executive & Career Summary Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate 6 tailored professional summary variations highlighting leadership, technical depth, metrics, and achievements.
          </p>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Customize Your Professional Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Job Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Years of Experience</label>
            <input
              type="number"
              min={0}
              max={40}
              value={yearsExp}
              onChange={(e) => setYearsExp(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Industry / Domain</label>
            <input
              type="text"
              value={industryDomain}
              onChange={(e) => setIndustryDomain(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Core Technical or Professional Skills</label>
            <input
              type="text"
              value={coreSkills}
              onChange={(e) => setCoreSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Key Measurable Accomplishment</label>
            <input
              type="text"
              value={metricAchievement}
              onChange={(e) => setMetricAchievement(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white mb-2"
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Metric Ideas:</span>
              {metricChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setMetricAchievement(chip)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] font-medium hover:bg-indigo-100 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Options Cards (2x3 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {summaryOptions.map((opt) => {
          const wordCount = opt.text.trim().split(/\s+/).filter(Boolean).length;
          const charCount = opt.text.length;

          return (
            <div
              key={opt.id}
              className="glass-card p-5 rounded-3xl flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all border border-slate-200 dark:border-slate-800"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {opt.tone}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {wordCount} words
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  {opt.description}
                </p>

                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 selection:bg-indigo-500/20">
                  "{opt.text}"
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(opt.id, opt.text)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    {copiedId === opt.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === opt.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleApplySummary(opt.text)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Insert</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
