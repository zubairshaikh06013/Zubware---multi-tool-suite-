import React, { useState } from 'react';
import { Copy, RefreshCw, Hash, Download, Check, BarChart2, Dices, Shuffle, Sparkles, Filter } from 'lucide-react';

interface RandomNumberGeneratorToolProps {
  onShowToast: (message: string) => void;
}

const PRESETS = [
  { name: '1 to 100', min: 1, max: 100, count: 5, decimals: 0, unique: true },
  { name: '1 to 10', min: 1, max: 10, count: 3, decimals: 0, unique: true },
  { name: 'Dice D6 (1-6)', min: 1, max: 6, count: 2, decimals: 0, unique: false },
  { name: 'D&D D20 (1-20)', min: 1, max: 20, count: 1, decimals: 0, unique: false },
  { name: 'Lottery 6/49', min: 1, max: 49, count: 6, decimals: 0, unique: true },
  { name: 'Decimals (0.00 - 1.00)', min: 0, max: 1, count: 5, decimals: 2, unique: false }
];

export const RandomNumberGeneratorTool: React.FC<RandomNumberGeneratorToolProps> = ({ onShowToast }) => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(6);
  const [decimals, setDecimals] = useState<number>(0);
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [delimiter, setDelimiter] = useState<', ' | '\n' | ' ' | 'json'>(', ');
  const [results, setResults] = useState<number[]>([17, 34, 52, 68, 81, 95]);
  const [copied, setCopied] = useState<boolean>(false);

  const generateNumbers = () => {
    if (min >= max) {
      onShowToast('Minimum value must be strictly less than Maximum');
      return;
    }

    if (decimals === 0) {
      const range = max - min + 1;
      if (!allowRepeats && count > range) {
        onShowToast(`Cannot generate ${count} unique integers in a range of ${range}`);
        return;
      }

      const nums: number[] = [];
      if (!allowRepeats) {
        const pool = Array.from({ length: range }, (_, i) => min + i);
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          nums.push(pool[idx]);
          pool.splice(idx, 1);
        }
      } else {
        for (let i = 0; i < count; i++) {
          nums.push(Math.floor(Math.random() * range) + min);
        }
      }

      if (sortOrder === 'asc') nums.sort((a, b) => a - b);
      if (sortOrder === 'desc') nums.sort((a, b) => b - a);

      setResults(nums);
    } else {
      // Float / Decimal generation
      const nums: number[] = [];
      const factor = Math.pow(10, decimals);
      for (let i = 0; i < count; i++) {
        const raw = Math.random() * (max - min) + min;
        nums.push(Math.round(raw * factor) / factor);
      }

      if (sortOrder === 'asc') nums.sort((a, b) => a - b);
      if (sortOrder === 'desc') nums.sort((a, b) => b - a);

      setResults(nums);
    }

    onShowToast(`Generated ${count} random numbers!`);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setMin(p.min);
    setMax(p.max);
    setCount(p.count);
    setDecimals(p.decimals);
    setAllowRepeats(!p.unique);
    onShowToast(`Loaded ${p.name} preset`);
  };

  const formattedOutput = () => {
    if (delimiter === 'json') {
      return JSON.stringify(results, null, 2);
    }
    return results.join(delimiter);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedOutput());
    setCopied(true);
    onShowToast('Numbers copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = formattedOutput();
    const ext = delimiter === 'json' ? 'json' : 'txt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zubware_random_numbers_${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Exported random numbers file`);
  };

  // Stats calculation
  const sum = results.reduce((a, b) => a + b, 0);
  const avg = results.length > 0 ? (sum / results.length).toFixed(2) : '0';
  const minVal = results.length > 0 ? Math.min(...results) : 0;
  const maxVal = results.length > 0 ? Math.max(...results) : 0;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Hash className="w-5 h-5" />
            </span>
            True Random Number Generator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate cryptographically sound random integers or decimals, roll dice, pick unique lottery numbers, and export lists.
          </p>
        </div>

        <button
          onClick={generateNumbers}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/25 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate Numbers</span>
        </button>
      </div>

      {/* Presets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grid: Controls & Live Output */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Controls Column (6 cols) */}
        <div className="md:col-span-6 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            Range & Parameters
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Min Value</label>
              <input
                type="number"
                value={min}
                onChange={e => setMin(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-center"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Value</label>
              <input
                type="number"
                value={max}
                onChange={e => setMax(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity (Count)</label>
              <input
                type="number"
                min="1"
                max="500"
                value={count}
                onChange={e => setCount(Math.max(1, Math.min(500, Number(e.target.value))))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-center"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Decimal Places</label>
              <select
                value={decimals}
                onChange={e => setDecimals(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-center"
              >
                <option value="0">0 (Integers Only)</option>
                <option value="1">1 Decimal (.X)</option>
                <option value="2">2 Decimals (.XX)</option>
                <option value="3">3 Decimals (.XXX)</option>
                <option value="4">4 Decimals</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Sorting Order</span>
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                <button
                  onClick={() => setSortOrder('none')}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${sortOrder === 'none' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  Random
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${sortOrder === 'asc' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  Asc (Low $\to$ High)
                </button>
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${sortOrder === 'desc' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  Desc
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 dark:text-slate-300 pt-2">
              <input
                type="checkbox"
                checked={allowRepeats}
                onChange={e => setAllowRepeats(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Allow Duplicate Numbers (Unchecked = All Unique)</span>
            </label>
          </div>
        </div>

        {/* Live Output & Statistics Column (6 cols) */}
        <div className="md:col-span-6 flex flex-col justify-between glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Generated Results ({results.length})
              </h3>

              {/* Delimiter format */}
              <select
                value={delimiter}
                onChange={e => setDelimiter(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <option value=", ">Comma Separated</option>
                <option value=" ">Space Separated</option>
                <option value="&#10;">New Line</option>
                <option value="json">JSON Array</option>
              </select>
            </div>

            {/* Visual Number Tags (for small count) or Scrollable Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[140px] max-h-[220px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {results.map((n, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 shadow-xs"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Min</span>
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{minVal}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Max</span>
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{maxVal}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Average</span>
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{avg}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Sum</span>
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">{sum.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Numbers'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
              title="Download File"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
