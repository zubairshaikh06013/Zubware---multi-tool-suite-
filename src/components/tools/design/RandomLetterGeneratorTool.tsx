import React, { useState } from 'react';
import { Shuffle, Copy, Check, Sparkles, RotateCcw } from 'lucide-react';

interface RandomLetterGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const RandomLetterGeneratorTool: React.FC<RandomLetterGeneratorToolProps> = ({ onShowToast }) => {
  const [caseType, setCaseType] = useState<'upper' | 'lower' | 'mixed'>('upper');
  const [filterType, setFilterType] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [quantity, setQuantity] = useState<number>(5);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [delimiter, setDelimiter] = useState<'' | ' ' | ', ' | '\n'>(' ');
  const [generatedLetters, setGeneratedLetters] = useState<string[]>(['M', 'K', 'R', 'P', 'X']);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const getAlphabet = () => {
    const vowels = 'AEIOU';
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';

    let pool = '';
    if (filterType === 'vowels') pool = vowels;
    else if (filterType === 'consonants') pool = consonants;
    else pool = vowels + consonants;

    return pool;
  };

  const generate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const pool = getAlphabet();
      const chars = pool.split('');
      const results: string[] = [];

      const targetCount = allowDuplicates ? quantity : Math.min(quantity, chars.length);

      if (allowDuplicates) {
        for (let i = 0; i < targetCount; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          results.push(formatChar(char));
        }
      } else {
        const available = [...chars];
        for (let i = 0; i < targetCount; i++) {
          const randIdx = Math.floor(Math.random() * available.length);
          results.push(formatChar(available[randIdx]));
          available.splice(randIdx, 1);
        }
      }

      setGeneratedLetters(results);
      setIsGenerating(false);
      onShowToast(`Generated ${results.length} random letters!`);
    }, 200);
  };

  const formatChar = (char: string) => {
    if (caseType === 'upper') return char.toUpperCase();
    if (caseType === 'lower') return char.toLowerCase();
    return Math.random() < 0.5 ? char.toUpperCase() : char.toLowerCase();
  };

  const outputString = generatedLetters.join(delimiter);

  const copyOutput = () => {
    navigator.clipboard.writeText(outputString);
    setCopied(true);
    onShowToast('Copied letters to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔤</span> Random Letter Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pick random letters from the alphabet with vowel/consonant filters, case options, and custom formatting.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Shuffle className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>Generate Letters</span>
        </button>
      </div>

      {/* Hero Display Card */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 via-slate-500/5 to-transparent text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
          Random Letter Output
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3 min-h-[60px]">
          {generatedLetters.map((l, idx) => (
            <div
              key={idx}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-md flex items-center justify-center text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white hover:scale-105 transition-transform"
            >
              {l}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={copyOutput}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy String</span>
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Quantity */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Quantity: <span className="text-indigo-600 font-mono">{quantity}</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200 dark:bg-slate-800 mt-2"
          />
        </div>

        {/* Case */}
        <div className="glass-card p-5 rounded-2xl space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Letter Case</label>
          <select
            value={caseType}
            onChange={e => setCaseType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
          >
            <option value="upper">UPPERCASE (A-Z)</option>
            <option value="lower">lowercase (a-z)</option>
            <option value="mixed">Mixed Case (Aa-Zz)</option>
          </select>
        </div>

        {/* Filter Type */}
        <div className="glass-card p-5 rounded-2xl space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Alphabet Filter</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
          >
            <option value="all">All Letters (A–Z)</option>
            <option value="vowels">Vowels Only (A, E, I, O, U)</option>
            <option value="consonants">Consonants Only</option>
          </select>
        </div>

        {/* Separator / Delimiter */}
        <div className="glass-card p-5 rounded-2xl space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Delimiter</label>
          <select
            value={delimiter}
            onChange={e => setDelimiter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
          >
            <option value=" ">Space (&quot; &quot;)</option>
            <option value="">No Space (&quot;&quot;)</option>
            <option value=", ">Comma (&quot;, &quot;)</option>
            <option value={"\n"}>New Line</option>
          </select>
        </div>
      </div>
    </div>
  );
};
