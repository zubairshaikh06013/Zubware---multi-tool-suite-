import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

export function WordsToNumberTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [wordsInput, setWordsInput] = useState<string>('One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven');
  const [copied, setCopied] = useState(false);

  const wordToNumber = (text: string): { digits: string; formatted: string } => {
    if (!text || !text.trim()) return { digits: '0', formatted: '0' };

    const cleanText = text
      .toLowerCase()
      .replace(/\band\b/g, ' ')
      .replace(/[^a-z\s-]/g, '')
      .replace(/-/g, ' ')
      .trim();

    if (!cleanText) return { digits: '0', formatted: '0' };

    const smallWords: { [key: string]: number } = {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
      ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
      seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
      sixty: 60, seventy: 70, eighty: 80, ninety: 90
    };

    const magnitudeWords: { [key: string]: number } = {
      hundred: 100,
      thousand: 1000,
      lakh: 100000,
      lakhs: 100000,
      million: 1000000,
      millions: 1000000,
      crore: 10000000,
      crores: 10000000,
      billion: 1000000000,
      billions: 1000000000,
      trillion: 1000000000000,
      trillions: 1000000000000
    };

    const tokens = cleanText.split(/\s+/);
    let total = 0;
    let current = 0;

    for (let token of tokens) {
      if (smallWords[token] !== undefined) {
        current += smallWords[token];
      } else if (token === 'hundred') {
        current = current === 0 ? 100 : current * 100;
      } else if (magnitudeWords[token] !== undefined) {
        const mult = magnitudeWords[token];
        current = current === 0 ? 1 : current;
        total += current * mult;
        current = 0;
      }
    }

    const resultNum = total + current;
    return {
      digits: resultNum.toString(),
      formatted: new Intl.NumberFormat().format(resultNum)
    };
  };

  const { digits, formatted } = wordToNumber(wordsInput);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    onShowToast('Copied digits to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Enter Words or Number Phrases
        </label>
        <textarea
          rows={3}
          value={wordsInput}
          onChange={(e) => setWordsInput(e.target.value)}
          placeholder="e.g. Five hundred twenty thousand four hundred twenty"
          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium text-base focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Quick Examples */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Examples:</span>
          {[
            'Two Million Five Hundred Thousand',
            'Seven Hundred Fifty Four',
            'Fifteen Lakhs Twenty Thousand',
            'Three Crore Fifty Lakhs',
          ].map((ex, idx) => (
            <button
              key={idx}
              onClick={() => setWordsInput(ex)}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium hover:bg-indigo-100 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Output Panel */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-indigo-500/20 bg-indigo-50/30 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Converted Numeric Digits
            </h3>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Digits'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 block mb-1">Standard Formatted Number</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono select-all">
              {formatted}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 block mb-1">Raw Digits (No Commas)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono select-all">
              {digits}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
