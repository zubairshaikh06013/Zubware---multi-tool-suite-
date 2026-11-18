import React, { useEffect, useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Layers, SlidersHorizontal } from 'lucide-react';

import { CATEGORIES, STYLES, generateYouTubeTitles, type Category } from '../../../lib/youtubeTitleSuggestions';

export const YouTubeTitleGeneratorTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [topic, setTopic] = useState('React 19 & Next.js');
  const [category, setCategory] = useState<Category>('Tech');
  const [style, setStyle] = useState('High CTR & Curiosity');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);


  const [orderOffset, setOrderOffset] = useState(0);
  useEffect(() => {
    setCopiedIndex(null);
    setOrderOffset(0);
  }, [topic, category, style]);
  const suggestions = generateYouTubeTitles(topic, category, style);
  const offset = orderOffset % suggestions.length;
  const titles = [...suggestions.slice(offset), ...suggestions.slice(0, offset)];

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      onShowToast('Title copied to clipboard!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(null);
      onShowToast('Copy failed. Select the title text and copy it manually.');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            YouTube Title Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create title drafts from local templates. Review each suggestion so it accurately describes your video.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-1.5">
          <label htmlFor="youtube-title-topic" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Video Topic / Keywords
          </label>
          <input
            id="youtube-title-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Python Basics, iPhone 16 Review"
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="youtube-title-category" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> Category Preset
          </label>
          <select
            id="youtube-title-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="youtube-title-style" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" /> Formula Style
          </label>
          <select
            id="youtube-title-style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white cursor-pointer"
          >
            {STYLES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills Quick Selector */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-[11px] font-bold text-slate-400">Quick Category:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        These are editable ideas, not verified claims or live trend data. Replace any testing periods,
        numbers or promises that do not match your video. No title guarantees views or rankings.
        YouTube allows up to 100 characters; the visible preview varies by screen.
      </p>

      {/* Generated Suggestions Grid */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Suggested Video Titles ({titles.length})
          </h3>
          <button
            onClick={() => { setOrderOffset(value => value + 1); setCopiedIndex(null); }}
            className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reorder Suggestions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {titles.map((titleText, idx) => {
            const charCount = titleText.length;
            const withinLimit = charCount <= 100;
            return (
              <div
                key={idx}
                className="glass-card p-4 rounded-2xl flex flex-col justify-between gap-3 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-500/40 transition-all group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Option {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        withinLimit
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}
                      title={withinLimit ? 'Within the 100-character title limit' : 'Shorten this draft before publishing: over 100 characters'}
                    >
                      {charCount}/100 chars{!withinLimit && ' — shorten before publishing'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {titleText}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {category} • {style}
                  </span>
                  <button
                    onClick={() => handleCopy(titleText, idx)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Title
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
