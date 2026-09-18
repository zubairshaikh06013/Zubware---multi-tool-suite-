import React, { useState } from 'react';
import { DollarSign, Percent, PiggyBank, ShieldAlert, Calendar, ArrowRight, Check } from 'lucide-react';

interface DownPaymentCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const DownPaymentCalculatorTool: React.FC<DownPaymentCalculatorToolProps> = ({ onShowToast }) => {
  const [purchasePrice, setPurchasePrice] = useState<number>(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [timeframeMonths, setTimeframeMonths] = useState<number>(24);
  const [currentSavings, setCurrentSavings] = useState<number>(15000);
  const [closingCostPercent, setClosingCostPercent] = useState<number>(3);

  // Calculations
  const downPaymentAmount = Math.round((purchasePrice * downPaymentPercent) / 100);
  const loanBalance = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCosts = Math.round((purchasePrice * closingCostPercent) / 100);
  const totalCashNeeded = downPaymentAmount + closingCosts;

  // Monthly savings plan
  const remainingSavingsNeeded = Math.max(0, totalCashNeeded - currentSavings);
  const monthlySavingsTarget = timeframeMonths > 0 ? Math.round(remainingSavingsNeeded / timeframeMonths) : 0;

  const requiresPmi = downPaymentPercent < 20;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏡</span> Down Payment Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate target down payments, closing costs, loan balances, and plan a monthly savings schedule to buy your home.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Property & Target Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Purchase Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Purchase Price ($)
              </label>
              <input
                type="number"
                min="10000"
                step="5000"
                value={purchasePrice}
                onChange={e => setPurchasePrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Down Payment % */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Down Payment</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{downPaymentPercent}%</span>
              </div>
              <input
                type="number"
                min="1"
                max="90"
                value={downPaymentPercent}
                onChange={e => setDownPaymentPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Quick Percentage Presets */}
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              {[3.5, 5, 10, 15, 20, 25].map(pct => (
                <button
                  key={pct}
                  onClick={() => setDownPaymentPercent(pct)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    downPaymentPercent === pct
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pct}% {pct === 3.5 ? '(FHA)' : pct === 20 ? '(No PMI)' : ''}
                </button>
              ))}
            </div>

            {/* Current Savings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Saved Cash ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={currentSavings}
                onChange={e => setCurrentSavings(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Timeframe to buy */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Timeline (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={timeframeMonths}
                onChange={e => setTimeframeMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          {/* PMI Alert */}
          {requiresPmi ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start text-xs text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
              <div>
                <span className="font-bold block">Private Mortgage Insurance (PMI) Notice:</span>
                Since your down payment is less than 20% (${Math.round(purchasePrice * 0.2).toLocaleString()}), most conventional lenders will require monthly PMI until your equity reaches 20%.
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Great job! A 20%+ down payment exempts you from monthly PMI insurance charges.</span>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Down Payment Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Required Down Payment Amount
            </span>

            <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              ${downPaymentAmount.toLocaleString()}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Financed Loan Balance:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${loanBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Estimated Closing Costs ({closingCostPercent}%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${closingCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total Cash Needed at Closing:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  ${totalCashNeeded.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Monthly Savings Target Card */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              <span>Recommended Monthly Savings Plan</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                ${monthlySavingsTarget.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-400">/ month</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Save this amount each month for <span className="font-bold">{timeframeMonths} months</span> to bridge the remaining <span className="font-bold">${remainingSavingsNeeded.toLocaleString()}</span> needed for closing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
