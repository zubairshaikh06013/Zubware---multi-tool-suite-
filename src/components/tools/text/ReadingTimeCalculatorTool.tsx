import React, { useState } from 'react';
import { Clock, Sliders, FileText, Copy, Check, Upload, Trash2, Mic, BookOpen, Sparkles, Award } from 'lucide-react';

interface ReadingTimeCalculatorToolProps {
  onShowToast: (msg: string) => void;
}

const SAMPLE_TEXTS = [
  {
    name: 'Tech Blog Post',
    content: `Artificial intelligence and modern web engineering are converging to create unprecedented browser-based productivity applications. Today, client-side WebAssembly, Canvas rendering, and modern JavaScript engines enable complex image processing, document generation, and scientific calculations directly within the browser without sending sensitive personal data to external servers.\n\nThis architectural shift not only enhances user privacy by orders of magnitude, but also eliminates cloud bandwidth costs and server round-trip latency. As edge devices become more powerful, web applications will continue to replace bulky desktop software while delivering instantaneous, zero-install experiences.`
  },
  {
    name: 'Keynote Speech',
    content: `Good morning everyone, and welcome. Today marks a pivotal milestone in our collective journey. Over the past twelve months, our cross-functional team has solved challenges that many declared impossible. We reimagined our core product architecture from the ground up, placing speed, privacy, and user delight at the center of every single decision.\n\nAs we look ahead to the next quarter, our commitment remains unshakable: empower creators, support independent builders, and remove technical barriers for everyone across the globe. Thank you for your unwavering trust and partnership.`
  },
  {
    name: 'Executive Summary',
    content: `This quarterly report analyzes strategic growth vectors, unit economics, and operational efficiency across three core product tiers. Gross margins expanded by 18% quarter-over-quarter driven by serverless infrastructure optimization and organic search discovery. Customer retention rates reached an all-time high of 94.2%, outperforming peer SaaS benchmarks.`
  }
];

export const ReadingTimeCalculatorTool: React.FC<ReadingTimeCalculatorToolProps> = ({ onShowToast }) => {
  const [text, setText] = useState<string>(SAMPLE_TEXTS[0].content);
  const [customWpm, setCustomWpm] = useState<number>(200);
  const [copied, setCopied] = useState<boolean>(false);

  // Text Parsing & Metrics
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s+/g, '').length;
  
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0) : [];
  const sentenceCount = sentences.length || (wordCount > 0 ? 1 : 0);
  
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0) : [];
  const paragraphCount = paragraphs.length || (wordCount > 0 ? 1 : 0);

  const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : '0';
  const avgCharsPerWord = wordCount > 0 ? (charNoSpaces / wordCount).toFixed(1) : '0';

  // Flesch Reading Ease Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  // Simplified syllable estimate (count vowel groups)
  const estimatedSyllables = words.reduce((acc, word) => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return acc + 1;
    const matches = w.match(/[aeiouy]{1,2}/g);
    return acc + Math.max(1, matches ? matches.length : 1);
  }, 0);

  let fleschScore = 70;
  if (wordCount > 0 && sentenceCount > 0) {
    const asl = wordCount / sentenceCount;
    const asw = estimatedSyllables / wordCount;
    fleschScore = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * asl - 84.6 * asw)));
  }

  const getReadabilityGrade = (score: number) => {
    if (score >= 80) return { level: 'Easy (5th - 6th Grade)', desc: 'Conversational, simple words, highly accessible to general readers.' };
    if (score >= 60) return { level: 'Standard (8th - 9th Grade)', desc: 'Plain English. Ideal for blogs, marketing, and mainstream media.' };
    if (score >= 40) return { level: 'Fairly Difficult (High School / College)', desc: 'Technical or academic vocabulary with longer compound sentences.' };
    return { level: 'Very Complex (Academic / Legal)', desc: 'Dense academic or specialized language requiring domain knowledge.' };
  };

  const readability = getReadabilityGrade(fleschScore);

  // Time Formatter
  const formatReadingDuration = (wpm: number) => {
    if (wordCount === 0) return '0 sec';
    const totalSeconds = Math.ceil((wordCount / wpm) * 60);
    if (totalSeconds < 60) return `${totalSeconds} sec`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
        onShowToast(`Loaded "${file.name}" (${file.size} bytes)`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopyBadge = () => {
    const badge = `⏱️ ${formatReadingDuration(200)} read (${wordCount.toLocaleString()} words)`;
    navigator.clipboard.writeText(badge);
    setCopied(true);
    onShowToast('Copied reading badge to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </span>
            Reading Time & Speech Duration Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate accurate reading pace, speaking time, readability scores, and generate blog read-time badges.
          </p>
        </div>

        {/* Copy Badge Button */}
        <button
          onClick={handleCopyBadge}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>Copy Read-Time Badge</span>
        </button>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Silent Reading */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2 bg-gradient-to-br from-indigo-500/5 to-transparent">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Silent Reading
          </span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {formatReadingDuration(200)}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Standard adult pace (200 WPM)</span>
        </div>

        {/* Speed Reading */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Speed Reading
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatReadingDuration(320)}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Fast skimming (320 WPM)</span>
        </div>

        {/* Speaking / Speech */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2 bg-gradient-to-br from-amber-500/5 to-transparent">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-amber-500" /> Speech / Keynote
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            {formatReadingDuration(130)}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Spoken presentation (130 WPM)</span>
        </div>

        {/* Custom Pace */}
        <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2 bg-gradient-to-br from-purple-500/5 to-transparent">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-500" /> Custom ({customWpm} WPM)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
            {formatReadingDuration(customWpm)}
          </div>
          <span className="text-[11px] text-slate-400 block font-medium">Configurable pace</span>
        </div>
      </div>

      {/* Readability & Text Diagnostic Banner */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-900 flex items-center justify-center font-black text-lg text-indigo-600 dark:text-indigo-400 shrink-0">
            {fleschScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Flesch Reading Ease:</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px]">
                {readability.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {readability.desc}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-400 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <span>{wordCount.toLocaleString()} words</span>
          <span>•</span>
          <span>{sentenceCount} sentences</span>
          <span>•</span>
          <span>{paragraphCount} paragraphs</span>
          <span>•</span>
          <span>~{avgWordsPerSentence} words/sentence</span>
        </div>
      </div>

      {/* Custom WPM Slider */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Fine-Tune Custom Reading Speed (WPM)
          </label>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {customWpm} Words Per Minute
          </span>
        </div>
        <input
          type="range"
          min={60}
          max={500}
          step={10}
          value={customWpm}
          onChange={(e) => setCustomWpm(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span>60 WPM (Audiobook/Learn)</span>
          <span>200 WPM (Average Adult)</span>
          <span>500 WPM (Speed Reader)</span>
        </div>
      </div>

      {/* Editor Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sample Preset Loaders */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Sample Texts:</span>
            {SAMPLE_TEXTS.map((s) => (
              <button
                key={s.name}
                onClick={() => { setText(s.content); onShowToast(`Loaded ${s.name}`); }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer"
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.json,.xml,.html"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => { setText(''); onShowToast('Cleared text'); }}
              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={11}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or write your manuscript, speech, blog post, or article here to instantly compute reading times..."
          className="w-full p-5 text-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-normal shadow-sm"
        />
      </div>
    </div>
  );
};
