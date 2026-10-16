import React, { useState } from 'react';
import { formatNumberWords, parseWordsToNumber } from '../../../lib/numberWords';
import { Copy, Check, Sparkles, RefreshCw, ArrowLeftRight, Hash } from 'lucide-react';

export function WordsToNumberTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [mode, setMode] = useState<'wordsToNum' | 'numToWords'>('wordsToNum');
  const [inputText, setInputText] = useState<string>('Two Million Five Hundred Thirty Four Thousand Seven Hundred Eighty Nine');
  const [numInput, setNumInput] = useState<string>('2534789');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = parseWordsToNumber(inputText);
  const numValue = parsed.value;

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Indian numbering formatter (e.g. 12,34,567)
  const formatIndianNumber = (num: number): string => {
    const parts = num.toString().split('.');
    let intStr = parts[0];
    const isNeg = intStr.startsWith('-');
    if (isNeg) intStr = intStr.substring(1);

    if (intStr.length <= 3) {
      return (isNeg ? '-' : '') + intStr + (parts[1] ? '.' + parts[1] : '');
    }

    const lastThree = intStr.slice(-3);
    const otherDigits = intStr.slice(0, -3);
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return (isNeg ? '-' : '') + formattedOther + ',' + lastThree + (parts[1] ? '.' + parts[1] : '');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Words to Numbers Converter & Math Translator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert spelled-out English & Indian number phrases into digits, currency, decimals, and hex notation with bi-directional conversion.
          </p>
        </div>

        <button
          onClick={() => setMode(mode === 'wordsToNum' ? 'numToWords' : 'wordsToNum')}
          className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:bg-indigo-100"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{mode === 'wordsToNum' ? 'Switch: Numbers to Words' : 'Switch: Words to Numbers'}</span>
        </button>
      </div>

      {mode === 'wordsToNum' ? (
        <div className="space-y-6">
          {/* Words Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Enter Words, Quantities, or Spelled-Out Phrases
            </label>
            <textarea aria-label="Number phrase"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Two million five hundred thousand three hundred..."
              className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Quick Sample Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Samples:</span>
              {[
                'Three Million Two Hundred Fifty Thousand',
                'Forty Five Lakhs Twenty Thousand',
                'Seven Hundred Fifty Four Point Nine',
                'Negative One Hundred Twenty Five',
                'Five Crore Sixty Lakhs'
              ].map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(ex)}
                  className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium hover:bg-indigo-100 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {parsed.error && <p role="alert" className="text-red-600">{parsed.error}</p>}
          {/* Formatted Number Results Matrix */}
          <div hidden={!!parsed.error} className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Parsed Numeric Representations</span>
              <span className="text-indigo-600 font-mono text-xs font-bold">Base 10 Decimal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Standard International Format */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Standard Format</span>
                  <button onClick={() => copyToClipboard(numValue.toLocaleString("en-US", { maximumFractionDigits: 15 }), 'std', 'Standard Number')} className="hover:text-indigo-600">
                    {copiedKey === 'std' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono truncate select-all">
                  {numValue.toLocaleString("en-US", { maximumFractionDigits: 15 })}
                </div>
                <span className="text-[10px] text-slate-400">Thousands comma grouping</span>
              </div>

              {/* Indian Number Format */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Indian (Lakhs & Crores)</span>
                  <button onClick={() => copyToClipboard(formatIndianNumber(numValue), 'ind', 'Indian Format')} className="hover:text-indigo-600">
                    {copiedKey === 'ind' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono truncate select-all">
                  {formatIndianNumber(numValue)}
                </div>
                <span className="text-[10px] text-slate-400">Lakh / Crore separators</span>
              </div>

              {/* Raw Digits */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Raw Digits</span>
                  <button onClick={() => copyToClipboard(numValue.toString(), 'raw', 'Raw Digits')} className="hover:text-indigo-600">
                    {copiedKey === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono truncate select-all">
                  {numValue.toString()}
                </div>
                <span className="text-[10px] text-slate-400">Clean unformatted numbers</span>
              </div>

              {/* US Dollars ($) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>US Dollars ($)</span>
                  <button onClick={() => copyToClipboard(`$${numValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'usd', 'USD')} className="hover:text-indigo-600">
                    {copiedKey === 'usd' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono truncate select-all">
                  ${numValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Indian Rupees (₹) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Indian Rupee (₹)</span>
                  <button onClick={() => copyToClipboard(`₹${formatIndianNumber(numValue)}`, 'inr', 'INR')} className="hover:text-indigo-600">
                    {copiedKey === 'inr' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono truncate select-all">
                  ₹{formatIndianNumber(numValue)}
                </div>
              </div>

              {/* Hexadecimal representation */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Hex Notation</span>
                  <button onClick={() => copyToClipboard(`0x${Math.floor(Math.abs(numValue)).toString(16).toUpperCase()}`, 'hex', 'Hex')} className="hover:text-indigo-600">
                    {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono truncate select-all">
                  0x{Math.floor(Math.abs(numValue)).toString(16).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Numbers Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Enter Numeric Value
            </label>
            <input
              type="number"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xl font-bold font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Words Output */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Spelled-Out English Words
              </span>
              <button
                onClick={() => copyToClipboard(formatNumberWords(numInput), 'words', 'Words')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {copiedKey === 'words' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Words</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-lg font-bold text-indigo-600 dark:text-indigo-400 capitalize leading-relaxed select-all">
              {formatNumberWords(numInput)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
