import React, { useState } from 'react';
import { Percent, Copy, Check, ArrowRight, Sparkles, RefreshCw, Calculator, BookOpen, Trash2 } from 'lucide-react';

interface PercentageCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const PercentageCalculatorTool: React.FC<PercentageCalculatorToolProps> = ({ onShowToast }) => {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<string>('15');
  const [m1Y, setM1Y] = useState<string>('200');

  // Mode 2: X is what percentage of Y?
  const [m2X, setM2X] = useState<string>('30');
  const [m2Y, setM2Y] = useState<string>('200');

  // Mode 3: Percentage Increase/Decrease from X to Y
  const [m3X, setM3X] = useState<string>('100');
  const [m3Y, setM3Y] = useState<string>('150');

  // Mode 4: Add X% to Y (Markup)
  const [m4X, setM4X] = useState<string>('20');
  const [m4Y, setM4Y] = useState<string>('150');

  // Mode 5: Subtract X% from Y (Discount)
  const [m5X, setM5X] = useState<string>('25');
  const [m5Y, setM5Y] = useState<string>('80');

  // Mode 6: Fraction to Percentage
  const [m6Num, setM6Num] = useState<string>('3');
  const [m6Den, setM6Den] = useState<string>('8');

  // Calculations
  const res1 = (parseFloat(m1X || '0') / 100) * parseFloat(m1Y || '0');
  const res2 = parseFloat(m2Y || '0') !== 0 ? (parseFloat(m2X || '0') / parseFloat(m2Y)) * 100 : 0;
  
  const m3Diff = parseFloat(m3Y || '0') - parseFloat(m3X || '0');
  const res3 = parseFloat(m3X || '0') !== 0 ? (m3Diff / parseFloat(m3X)) * 100 : 0;

  const res4 = parseFloat(m4Y || '0') * (1 + parseFloat(m4X || '0') / 100);
  const res5 = parseFloat(m5Y || '0') * (1 - parseFloat(m5X || '0') / 100);

  const res6 = parseFloat(m6Den || '0') !== 0 ? (parseFloat(m6Num || '0') / parseFloat(m6Den)) * 100 : 0;

  const copyVal = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    onShowToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Percent className="w-5 h-5" />
            </span>
            All-in-One Percentage Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate percentage values, markups, discounts, rates of change, and fractions with step-by-step mathematical formulas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: What is X% of Y? */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center text-xs">1</span>
              What is X% of Y?
            </h3>

            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={m1X}
                onChange={e => setM1X(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
              <span className="text-xs font-bold text-slate-500">% of</span>
              <input
                type="number"
                value={m1Y}
                onChange={e => setM1Y(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-500 block">Result:</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {isNaN(res1) ? '0' : Number(res1.toFixed(4)).toString()}
                </span>
              </div>
              <button
                onClick={() => copyVal(res1.toString(), 'result')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 hover:bg-indigo-50 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono block">
            Formula: ({m1X} ÷ 100) × {m1Y} = {res1.toFixed(2)}
          </span>
        </div>

        {/* Mode 2: X is what % of Y? */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-bold flex items-center justify-center text-xs">2</span>
              X is what percentage of Y?
            </h3>

            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={m2X}
                onChange={e => setM2X(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
              <span className="text-xs font-bold text-slate-500">is what % of</span>
              <input
                type="number"
                value={m2Y}
                onChange={e => setM2Y(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 block">Result:</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {isNaN(res2) ? '0' : Number(res2.toFixed(2)).toString()}%
                </span>
              </div>
              <button
                onClick={() => copyVal(`${res2.toFixed(2)}%`, 'percentage')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 hover:bg-emerald-50 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono block">
            Formula: ({m2X} ÷ {m2Y}) × 100 = {res2.toFixed(2)}%
          </span>
        </div>

        {/* Mode 3: Percentage Increase / Decrease */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 font-bold flex items-center justify-center text-xs">3</span>
              Percentage Increase / Decrease
            </h3>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500">From</span>
              <input
                type="number"
                value={m3X}
                onChange={e => setM3X(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
              <span className="text-xs font-bold text-slate-500">To</span>
              <input
                type="number"
                value={m3Y}
                onChange={e => setM3Y(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
            </div>

            <div className={`p-3 rounded-2xl border flex items-center justify-between ${
              res3 >= 0 ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900' : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {res3 >= 0 ? 'Increase / Growth:' : 'Decrease / Loss:'}
                </span>
                <span className={`text-2xl font-black font-mono ${res3 >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {res3 >= 0 ? '+' : ''}{Number(res3.toFixed(2)).toString()}%
                </span>
              </div>
              <button
                onClick={() => copyVal(`${res3 >= 0 ? '+' : ''}${res3.toFixed(2)}%`, 'growth rate')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono block">
            Formula: (({m3Y} - {m3X}) ÷ {m3X}) × 100 = {res3.toFixed(2)}%
          </span>
        </div>

        {/* Mode 4: Add X% Markup */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold flex items-center justify-center text-xs">4</span>
              Add X% to Value (Markup / Tax)
            </h3>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500">Add</span>
              <input
                type="number"
                value={m4X}
                onChange={e => setM4X(e.target.value)}
                className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
              <span className="text-xs font-bold text-slate-500">% to</span>
              <input
                type="number"
                value={m4Y}
                onChange={e => setM4Y(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
            </div>

            <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600 block">Gross Total:</span>
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                  {isNaN(res4) ? '0' : Number(res4.toFixed(2)).toString()}
                </span>
              </div>
              <button
                onClick={() => copyVal(res4.toFixed(2), 'value')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-purple-600 hover:bg-purple-50 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono block">
            Formula: {m4Y} × (1 + {m4X}/100) = {res4.toFixed(2)}
          </span>
        </div>

        {/* Mode 5: Subtract X% Discount */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 font-bold flex items-center justify-center text-xs">5</span>
              Subtract X% from Value (Discount)
            </h3>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500">Take</span>
              <input
                type="number"
                value={m5X}
                onChange={e => setM5X(e.target.value)}
                className="w-20 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
              <span className="text-xs font-bold text-slate-500">% off</span>
              <input
                type="number"
                value={m5Y}
                onChange={e => setM5Y(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Discounted Price:</span>
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                  {isNaN(res5) ? '0' : Number(res5.toFixed(2)).toString()}
                </span>
              </div>
              <button
                onClick={() => copyVal(res5.toFixed(2), 'discounted value')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-rose-600 hover:bg-rose-50 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono block">
            Formula: {m5Y} × (1 - {m5X}/100) = {res5.toFixed(2)}
          </span>
        </div>

        {/* Mode 6: Fraction to Percentage */}
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 font-bold flex items-center justify-center text-xs">6</span>
              Fraction to Percentage Converter
            </h3>

            <div className="flex items-center gap-2.5">
              <input
                type="number"
                value={m6Num}
                onChange={e => setM6Num(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
              <span className="text-sm font-black text-slate-400">/</span>
              <input
                type="number"
                value={m6Den}
                onChange={e => setM6Den(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-center"
              />
            </div>

            <div className="p-3 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-600 block">Percentage Equivalent:</span>
                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
                  {isNaN(res6) ? '0' : Number(res6.toFixed(3)).toString()}%
                </span>
              </div>
              <button
                onClick={() => copyVal(`${res6.toFixed(3)}%`, 'percentage')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-cyan-600 hover:bg-cyan-50 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 font-mono block">
            Formula: ({m6Num} ÷ {m6Den}) × 100 = {res6.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
