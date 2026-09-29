import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent, Copy, Check, ArrowRight, ShieldCheck, Sparkles, HelpCircle, BarChart3 } from 'lucide-react';

interface SalaryHikeCalculatorToolProps {
  onShowToast: (msg: string) => void;
}

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '₹', code: 'INR' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'A$', code: 'AUD' }
];

export const SalaryHikeCalculatorTool: React.FC<SalaryHikeCalculatorToolProps> = ({ onShowToast }) => {
  const [calcMode, setCalcMode] = useState<'forward' | 'reverse'>('forward');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [currentCtc, setCurrentCtc] = useState<number>(80000);
  const [offeredCtc, setOfferedCtc] = useState<number>(115000);
  const [desiredHikePct, setDesiredHikePct] = useState<number>(35);
  const [inflationRate, setInflationRate] = useState<number>(4.5);
  const [copied, setCopied] = useState<boolean>(false);

  // Forward calculations (Current + Offered -> Hike %)
  const absoluteIncreaseForward = Math.max(0, offeredCtc - currentCtc);
  const percentageHikeForward = currentCtc > 0 ? (absoluteIncreaseForward / currentCtc) * 100 : 0;
  
  // Reverse calculations (Current + Target % -> Target Offered CTC)
  const targetOfferedCtc = Math.round(currentCtc * (1 + desiredHikePct / 100));
  const absoluteIncreaseReverse = Math.max(0, targetOfferedCtc - currentCtc);

  // Active metrics based on active mode
  const effectiveOffered = calcMode === 'forward' ? offeredCtc : targetOfferedCtc;
  const effectiveIncrease = calcMode === 'forward' ? absoluteIncreaseForward : absoluteIncreaseReverse;
  const effectivePct = calcMode === 'forward' ? percentageHikeForward : desiredHikePct;

  // Real purchasing power hike after inflation
  const realHikePct = Math.max(-100, effectivePct - inflationRate);

  // Granular increments
  const monthlyCurrent = Math.round(currentCtc / 12);
  const monthlyOffered = Math.round(effectiveOffered / 12);
  const monthlyDiff = monthlyOffered - monthlyCurrent;

  const biweeklyDiff = Math.round(effectiveIncrease / 26);
  const weeklyDiff = Math.round(effectiveIncrease / 52);
  const dailyDiff = Math.round(effectiveIncrease / 260); // 260 work days
  const hourlyDiff = (effectiveIncrease / 2080).toFixed(2); // 2,080 annual work hours

  // Market Appraisal Verdict
  const getVerdict = (pct: number) => {
    if (pct >= 50) return { label: 'Exceptional Mega Hike', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', note: 'Top-tier career progression, typically seen in specialized tech or leadership pivots.' };
    if (pct >= 30) return { label: 'Strong Career Jump', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', note: 'Significantly above standard inflation and well above annual retention benchmarks.' };
    if (pct >= 15) return { label: 'Healthy Standard Increment', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', note: 'Solid market-standard raise covering cost of living and merit performance.' };
    if (pct >= 5) return { label: 'Modest / Cost of Living Raise', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', note: 'Covers average inflation; consider negotiating higher if taking on increased scope.' };
    return { label: 'Below Market Benchmark', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', note: 'Below inflation rate; net real purchasing power may decline.' };
  };

  const verdict = getVerdict(effectivePct);

  const handleCopyReport = () => {
    const report = `Zubware Salary Hike Appraisal Report
----------------------------------------
Currency: ${currency.code} (${currency.symbol})
Current Annual Compensation: ${currency.symbol}${currentCtc.toLocaleString()}
New Offered Compensation: ${currency.symbol}${effectiveOffered.toLocaleString()}

Hike Metrics:
- Absolute Annual Increment: +${currency.symbol}${effectiveIncrease.toLocaleString()}
- Percentage Hike: +${effectivePct.toFixed(1)}%
- Inflation Adjusted (Real) Hike: +${realHikePct.toFixed(1)}% (at ${inflationRate}% inflation)
- Appraisal Verdict: ${verdict.label}

Cashflow Bump Breakdown:
- Monthly Increase: +${currency.symbol}${monthlyDiff.toLocaleString()} / month
- Bi-weekly Increase: +${currency.symbol}${biweeklyDiff.toLocaleString()} / 2 weeks
- Weekly Increase: +${currency.symbol}${weeklyDiff.toLocaleString()} / week
- Hourly Rate Bump: +${currency.symbol}${hourlyDiff} / hour

Generated with Zubware Salary Hike Calculator`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    onShowToast('Salary hike report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            Salary Hike Percentage Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate your percentage raise, inflation-adjusted purchasing power, and target offer negotiation rates.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Currency:</span>
          <select
            value={currency.code}
            onChange={(e) => {
              const selected = CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0];
              setCurrency(selected);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 text-xs font-bold max-w-md mx-auto">
        <button
          onClick={() => setCalcMode('forward')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            calcMode === 'forward' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Calculate Offer Hike %
        </button>
        <button
          onClick={() => setCalcMode('reverse')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            calcMode === 'reverse' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Target Hike Negotiation
        </button>
      </div>

      {/* Hero Highlight Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] tracking-wider uppercase">
              {calcMode === 'forward' ? 'Calculated Raise Percentage' : 'Target Counter-Offer Package'}
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
              <span>+{effectivePct.toFixed(1)}%</span>
              <span className="text-lg font-bold text-emerald-300">Raise</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              +{currency.symbol}{effectiveIncrease.toLocaleString()} Annual Increase ({currency.symbol}{monthlyDiff.toLocaleString()}/mo)
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold ${verdict.color}`}>
              {verdict.label}
            </div>

            <button
              onClick={handleCopyReport}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Summary!' : 'Copy Hike Report'}</span>
            </button>
          </div>
        </div>

        {/* Inflation Adjustment Sub-Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span>Inflation Rate:</span>
            <input
              type="number"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-16 px-2 py-0.5 rounded-lg bg-white/10 border border-white/20 font-bold text-white text-center focus:outline-none"
            />
            <span>%</span>
          </div>

          <div className="font-extrabold text-emerald-300">
            Real Purchasing Power Hike: +{realHikePct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Inputs & Detailed Increment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-500" />
              {calcMode === 'forward' ? 'Salary Inputs' : 'Negotiation Target Inputs'}
            </h3>

            {/* Current CTC */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Annual Compensation ({currency.code})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={currentCtc}
                  onChange={(e) => setCurrentCtc(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                />
              </div>
            </div>

            {/* Forward Mode: Offered CTC */}
            {calcMode === 'forward' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Offered Annual Compensation ({currency.code})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={offeredCtc}
                    onChange={(e) => setOfferedCtc(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                  />
                </div>
              </div>
            )}

            {/* Reverse Mode: Desired Hike % */}
            {calcMode === 'reverse' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Desired Hike Percentage</span>
                  <span className="text-indigo-600 font-extrabold">+{desiredHikePct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={desiredHikePct}
                  onChange={(e) => setDesiredHikePct(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex gap-2 pt-1">
                  {[20, 30, 40, 50].map(p => (
                    <button
                      key={p}
                      onClick={() => setDesiredHikePct(p)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold ${
                        desiredHikePct === p ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Benchmark Note */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-extrabold text-slate-900 dark:text-white block">Negotiation Context:</span>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {verdict.note}
              </p>
            </div>
          </div>
        </div>

        {/* Right Incremental Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              Granular Cashflow Increase Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-left">
                    <th className="py-2.5 font-bold">Frequency</th>
                    <th className="py-2.5 font-bold">Current Rate</th>
                    <th className="py-2.5 font-bold">New Offer Rate</th>
                    <th className="py-2.5 font-bold text-right">Net Increase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Annual CTC</td>
                    <td className="py-3 text-slate-500">{currency.symbol}{currentCtc.toLocaleString()}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{currency.symbol}{effectiveOffered.toLocaleString()}</td>
                    <td className="py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">+{currency.symbol}{effectiveIncrease.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Monthly</td>
                    <td className="py-3 text-slate-500">{currency.symbol}{monthlyCurrent.toLocaleString()}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{currency.symbol}{monthlyOffered.toLocaleString()}</td>
                    <td className="py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">+{currency.symbol}{monthlyDiff.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Bi-Weekly</td>
                    <td className="py-3 text-slate-500">{currency.symbol}{Math.round(currentCtc / 26).toLocaleString()}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{currency.symbol}{Math.round(effectiveOffered / 26).toLocaleString()}</td>
                    <td className="py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">+{currency.symbol}{biweeklyDiff.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Weekly</td>
                    <td className="py-3 text-slate-500">{currency.symbol}{Math.round(currentCtc / 52).toLocaleString()}</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{currency.symbol}{Math.round(effectiveOffered / 52).toLocaleString()}</td>
                    <td className="py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">+{currency.symbol}{weeklyDiff.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">Hourly Equivalent</td>
                    <td className="py-3 text-slate-500">{currency.symbol}{(currentCtc / 2080).toFixed(2)}/hr</td>
                    <td className="py-3 text-slate-900 dark:text-white font-bold">{currency.symbol}{(effectiveOffered / 2080).toFixed(2)}/hr</td>
                    <td className="py-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">+{currency.symbol}{hourlyDiff}/hr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900 flex items-center justify-between text-xs mt-4">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">Next Career Milestone</span>
                <span className="text-[10px] text-slate-500">Target offer satisfies inflation buffer + merit progression</span>
              </div>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                +{currency.symbol}{effectiveIncrease.toLocaleString()}/yr
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
