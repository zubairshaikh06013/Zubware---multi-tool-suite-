import React, { useState, useMemo } from 'react';
import { Calculator, BarChart3, Copy, Check, Info } from 'lucide-react';

interface ModeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const ModeCalculatorTool: React.FC<ModeCalculatorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('4, 7, 2, 7, 9, 3, 7, 4, 2, 8, 4');
  const [copied, setCopied] = useState<boolean>(false);

  // Parse input
  const numbers = useMemo(() => {
    return inputText
      .split(/[\s,;\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  }, [inputText]);

  // Calculations
  const stats = useMemo(() => {
    if (numbers.length === 0) {
      return null;
    }

    const sorted = [...numbers].sort((a, b) => a - b);
    const count = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    // Median
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Frequencies
    const freqMap: Record<number, number> = {};
    sorted.forEach(num => {
      freqMap[num] = (freqMap[num] || 0) + 1;
    });

    const entries = Object.entries(freqMap).map(([k, v]) => ({
      num: Number(k),
      freq: v
    }));

    const maxFreq = Math.max(...entries.map(e => e.freq));

    // Determine Mode
    let modeType: 'no-mode' | 'unimodal' | 'bimodal' | 'multimodal' = 'unimodal';
    let modes: number[] = [];

    if (maxFreq === 1 || entries.every(e => e.freq === maxFreq)) {
      modeType = 'no-mode';
    } else {
      modes = entries.filter(e => e.freq === maxFreq).map(e => e.num);
      if (modes.length === 1) modeType = 'unimodal';
      else if (modes.length === 2) modeType = 'bimodal';
      else modeType = 'multimodal';
    }

    return {
      count,
      mean,
      median,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      range: sorted[sorted.length - 1] - sorted[0],
      maxFreq,
      modeType,
      modes,
      frequencyTable: entries.sort((a, b) => b.freq - a.freq || a.num - b.num)
    };
  }, [numbers]);

  const copyMode = () => {
    if (!stats) return;
    const text = stats.modeType === 'no-mode' ? 'No mode' : stats.modes.join(', ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast(`Copied mode: ${text}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📊</span> Mode Calculator (Statistical Mode & Frequencies)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find the most frequent number(s) in a dataset with unimodal, bimodal, multimodal, and frequency breakdown analysis.
          </p>
        </div>
        <button
          onClick={copyMode}
          disabled={!stats}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Mode</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Enter Numbers (comma, space, or line separated)
            </label>
            <span className="text-xs font-mono font-bold text-indigo-600">
              {numbers.length} values parsed
            </span>
          </div>

          <textarea
            rows={5}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="e.g. 12, 15, 12, 19, 24, 12, 15"
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
            <button
              onClick={() => setInputText('4, 7, 2, 7, 9, 3, 7, 4, 2, 8, 4')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300"
            >
              Unimodal (Single Mode 7)
            </button>
            <button
              onClick={() => setInputText('10, 20, 20, 30, 30, 40, 50')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300"
            >
              Bimodal (20 & 30)
            </button>
            <button
              onClick={() => setInputText('1, 2, 3, 4, 5, 6')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300"
            >
              No Mode (All Freq 1)
            </button>
          </div>
        </div>

        {/* Mode Results Hero */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Calculated Mode
            </span>

            {stats ? (
              <div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                  {stats.modeType === 'no-mode'
                    ? 'No Mode'
                    : stats.modes.join(', ')}
                </div>
                <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  {stats.modeType === 'no-mode'
                    ? 'All numbers have equal frequency'
                    : `${stats.modeType} (Appears ${stats.maxFreq} times)`}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Enter numbers to compute mode</p>
            )}

            {stats && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Mean (Average)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                    {stats.mean.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Median (Middle)</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                    {stats.median}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frequency Distribution Table */}
      {stats && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Frequency Distribution
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {stats.frequencyTable.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  stats.modes.includes(item.num)
                    ? 'bg-indigo-500/10 border-indigo-500/40'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="text-base font-black font-mono text-slate-900 dark:text-white">
                  {item.num}
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                  Freq: <span className="text-indigo-600 font-bold">{item.freq}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
