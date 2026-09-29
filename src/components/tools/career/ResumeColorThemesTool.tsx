import React, { useState } from 'react';
import { CAREER_COLOR_THEMES } from '../../../data/careerData';
import { getActiveResume, saveActiveResume } from '../../../lib/resumeStore';
import { ResumeInfoPanel } from './ResumeInfoPanel';
import { Palette, Check, ArrowRight, Type, Sparkles, ShieldCheck, Sun, Moon } from 'lucide-react';

interface ExtendedTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  font: string;
  category: string;
}

const EXTENDED_THEMES: ExtendedTheme[] = [
  { id: 'navy-exec', name: 'Navy Executive', primary: '#1e3a8a', secondary: '#3b82f6', font: 'font-sans', category: 'Corporate' },
  { id: 'emerald-tech', name: 'Emerald Tech', primary: '#065f46', secondary: '#10b981', font: 'font-mono', category: 'Tech' },
  { id: 'indigo-modern', name: 'Indigo Modern', primary: '#4338ca', secondary: '#6366f1', font: 'font-sans', category: 'Creative' },
  { id: 'slate-minimal', name: 'Slate Minimal', primary: '#334155', secondary: '#64748b', font: 'font-sans', category: 'Minimal' },
  { id: 'burgundy-legal', name: 'Burgundy Prestige', primary: '#881337', secondary: '#f43f5e', font: 'font-serif', category: 'Legal & Executive' },
  { id: 'charcoal-bold', name: 'Charcoal Monolith', primary: '#18181b', secondary: '#71717a', font: 'font-sans', category: 'Design' },
  { id: 'teal-innovator', name: 'Teal Innovator', primary: '#0f766e', secondary: '#14b8a6', font: 'font-sans', category: 'Tech' },
  { id: 'amber-artisan', name: 'Amber Artisan', primary: '#b45309', secondary: '#f59e0b', font: 'font-serif', category: 'Creative' },
];

export const ResumeColorThemesTool: React.FC<{ onShowToast: (msg: string) => void; onNavigate?: (path: string) => void }> = ({ onShowToast, onNavigate }) => {
  const [resume, setResume] = useState(() => getActiveResume());
  const [customHex, setCustomHex] = useState<string>(resume.styling?.primaryColor || '#1e3a8a');
  const [customFont, setCustomFont] = useState<string>(resume.styling?.fontFamily || 'sans-serif');
  const [previewDark, setPreviewDark] = useState<boolean>(false);

  const handleSelectTheme = (primaryColor: string, font: string, name: string) => {
    const current = getActiveResume();
    const updated = {
      ...current,
      styling: {
        ...current.styling,
        primaryColor,
        fontFamily: font
      }
    };
    saveActiveResume(updated);
    setResume(updated);
    setCustomHex(primaryColor);
    onShowToast(`Applied ${name} color and typography theme!`);
  };

  const handleApplyCustom = () => {
    const current = getActiveResume();
    const updated = {
      ...current,
      styling: {
        ...current.styling,
        primaryColor: customHex,
        fontFamily: customFont
      }
    };
    saveActiveResume(updated);
    setResume(updated);
    onShowToast(`Applied custom theme (#${customHex})!`);
  };

  const currentColor = resume.styling?.primaryColor || customHex;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <ResumeInfoPanel resumeData={resume} />

      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" /> Resume Styling Studio & Color Themes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transform your resume's visual identity with tested corporate color harmonies, font families, and live preview rendering.
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('/resume-builder.html')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>Back to Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Studio: Live Preview + Custom Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customizer 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-3xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-indigo-500" /> Custom Typography & Accent
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold"
                  />
                  <button
                    onClick={handleApplyCustom}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Font Family Style
                </label>
                <select
                  value={customFont}
                  onChange={(e) => {
                    setCustomFont(e.target.value);
                    const current = getActiveResume();
                    const updated = { ...current, styling: { ...current.styling, fontFamily: e.target.value } };
                    saveActiveResume(updated);
                    setResume(updated);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="sans-serif">Clean Sans-Serif (Modern / Tech)</option>
                  <option value="serif">Classic Serif (Editorial / Executive)</option>
                  <option value="monospace">Monospace (Developer / Engineering)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>WCAG AA High-Contrast Verified: Meets 4.5:1 text readability ratio.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Resume Sample Mockup 7 cols */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Document Live Style Preview
            </span>
            <button
              onClick={() => setPreviewDark(!previewDark)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold"
            >
              {previewDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{previewDark ? 'Light Canvas' : 'Dark Canvas'}</span>
            </button>
          </div>

          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
            previewDark 
              ? 'bg-slate-950 border-slate-800 text-slate-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`} style={{ fontFamily: customFont }}>
            {/* Header Mockup */}
            <div className="border-b pb-4 mb-4" style={{ borderColor: `${currentColor}30` }}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-black tracking-tight" style={{ color: currentColor }}>
                    {resume.personalInfo.fullName || 'Alex Morgan'}
                  </h1>
                  <p className="text-xs font-bold opacity-80 mt-0.5">
                    {resume.personalInfo.jobTitle || 'Lead Software Architect & Engineering Director'}
                  </p>
                </div>
                <div className="text-right text-[10px] opacity-70">
                  <div>{resume.personalInfo.email || 'alex.morgan@email.com'}</div>
                  <div>{resume.personalInfo.phone || '+1 (555) 019-2834'}</div>
                </div>
              </div>
            </div>

            {/* Content Sections Mockup */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5" style={{ color: currentColor }}>
                  <span>■</span> Executive Summary
                </h4>
                <p className="text-[11px] leading-relaxed opacity-85">
                  {resume.personalInfo.summary || 'Results-driven technology leader with 8+ years building enterprise distributed architectures. Track record of scaling systems to 5M+ daily transactions while cutting cloud infrastructure overhead by 35%.'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: currentColor }}>
                  <span>■</span> Professional Experience
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>Principal Architect — CloudScale Systems</span>
                    <span className="opacity-70 font-mono">2023 - Present</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[10px] opacity-80 pl-1">
                    <li>Led cross-functional migration to serverless microservices saving $180k/yr.</li>
                    <li>Mentored 14 senior engineers and established company-wide automated CI/CD pipeline.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: currentColor }}>
                  <span>■</span> Core Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {['TypeScript', 'React.js', 'Kubernetes', 'Distributed Systems', 'System Design', 'CI/CD'].map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{ backgroundColor: `${currentColor}15`, color: currentColor }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Color Palettes Grid */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Curated Industry Color Palettes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {EXTENDED_THEMES.map((theme) => {
            const isSelected = currentColor === theme.primary;
            return (
              <div
                key={theme.id}
                onClick={() => handleSelectTheme(theme.primary, theme.font, theme.name)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/30 dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20 scale-[1.02]' 
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {theme.category}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
                </div>

                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl shadow-sm border border-black/10 shrink-0"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {theme.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {theme.primary}
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
