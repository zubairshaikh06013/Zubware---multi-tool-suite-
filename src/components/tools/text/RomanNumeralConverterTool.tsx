import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, BookOpen } from 'lucide-react';

export function RomanNumeralConverterTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [mode, setMode] = useState<'numberToRoman' | 'romanToNumber'>('numberToRoman');
  const [inputVal, setInputVal] = useState<string>('2026');
  const [copied, setCopied] = useState(false);

  const romanMap: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];

  const numberToRoman = (num: number): { roman: string; breakdown: string[] } => {
    if (isNaN(num) || num < 1 || num > 3999999) {
      return { roman: 'Invalid (Enter 1 to 3,999,999)', breakdown: [] };
    }

    let n = num;
    let result = '';
    let breakdown: string[] = [];

    for (let [val, symbol] of romanMap) {
      while (n >= val) {
        result += symbol;
        breakdown.push(`${symbol} = ${val}`);
        n -= val;
      }
    }

    return { roman: result, breakdown };
  };

  const romanToNumber = (romanStr: string): { num: number; valid: boolean } => {
    const str = romanStr.toUpperCase().trim();
    if (!str) return { num: 0, valid: false };

    const romanValues: { [key: string]: number } = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
    };

    let total = 0;
    let prev = 0;

    for (let i = str.length - 1; i >= 0; i--) {
      const char = str[i];
      const val = romanValues[char];
      if (!val) return { num: 0, valid: false };

      if (val < prev) {
        total -= val;
      } else {
        total += val;
      }
      prev = val;
    }

    return { num: total, valid: total > 0 };
  };

  let outputResult = '';
  let breakdownList: string[] = [];

  if (mode === 'numberToRoman') {
    const parsed = parseInt(inputVal.replace(/,/g, ''), 10);
    const { roman, breakdown } = numberToRoman(parsed);
    outputResult = roman;
    breakdownList = breakdown;
  } else {
    const { num, valid } = romanToNumber(inputVal);
    outputResult = valid ? num.toLocaleString() : 'Invalid Roman Numeral';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    onShowToast('Copied output to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Mode Switcher */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => { setMode('numberToRoman'); setInputVal('2026'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            mode === 'numberToRoman'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Number to Roman (2026 → MMXXVI)
        </button>
        <button
          onClick={() => { setMode('romanToNumber'); setInputVal('MMXXVI'); }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            mode === 'romanToNumber'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Roman to Number (MMXXVI → 2026)
        </button>
      </div>

      {/* Input Field */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-center">
          {mode === 'numberToRoman' ? 'Enter Number or Year (e.g., 2026)' : 'Enter Roman Numeral (e.g., MCMXCIX)'}
        </label>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={mode === 'numberToRoman' ? '2026' : 'MMXXVI'}
          className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-center text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Quick Year Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Quick Years:</span>
          {['2026', '2025', '2000', '1999', '1776', '1000', '50'].map((y) => (
            <button
              key={y}
              onClick={() => {
                if (mode === 'numberToRoman') {
                  setInputVal(y);
                } else {
                  setInputVal(numberToRoman(parseInt(y, 10)).roman);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium hover:bg-indigo-100 transition-colors"
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Output Card */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-indigo-500/20 bg-indigo-50/30 dark:bg-slate-900/50 max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Converted Result
            </h3>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Result'}</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-widest select-all">
          {outputResult}
        </div>
      </div>

      {/* Reference Table */}
      <div className="max-w-2xl mx-auto glass-card p-6 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>Roman Numeral Reference Guide</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono">
          {[
            { symbol: 'I', val: '1' },
            { symbol: 'V', val: '5' },
            { symbol: 'X', val: '10' },
            { symbol: 'L', val: '50' },
            { symbol: 'C', val: '100' },
            { symbol: 'D', val: '500' },
            { symbol: 'M', val: '1000' }
          ].map((item, i) => (
            <div key={i} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="font-black text-indigo-600 dark:text-indigo-400 text-base">{item.symbol}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
