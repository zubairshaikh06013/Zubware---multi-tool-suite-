import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Layers, Sparkles } from 'lucide-react';

export function CompoundInterestCalculatorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<'compound' | 'cagr'>('compound');

  // Compound Interest Inputs
  const [principal, setPrincipal] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(200);
  const [annualRate, setAnnualRate] = useState<number>(7.5);
  const [years, setYears] = useState<number>(10);
  const [frequency, setFrequency] = useState<number>(12); // 12 = monthly, 1 = annually, 4 = quarterly, 365 = daily

  // CAGR Inputs
  const [startVal, setStartVal] = useState<number>(5000);
  const [endVal, setEndVal] = useState<number>(15000);
  const [cagrYears, setCagrYears] = useState<number>(5);

  // Compound Interest Calculation
  // Monthly compounding loop
  let totalBalance = principal;
  let totalDeposits = principal;
  let yearlyBreakdown: { year: number; balance: number; deposits: number; interest: number }[] = [];

  const ratePerPeriod = (annualRate / 100) / frequency;
  const totalPeriods = years * frequency;
  const contributionsPerPeriod = (monthlyContribution * 12) / frequency;

  for (let y = 1; y <= years; y++) {
    for (let p = 1; p <= frequency; p++) {
      totalBalance += contributionsPerPeriod;
      totalBalance += totalBalance * ratePerPeriod;
      totalDeposits += contributionsPerPeriod;
    }
    yearlyBreakdown.push({
      year: y,
      balance: totalBalance,
      deposits: totalDeposits,
      interest: totalBalance - totalDeposits
    });
  }

  const totalInterest = totalBalance - totalDeposits;

  // CAGR Calculation: ((End / Start) ^ (1 / n)) - 1
  const cagr = startVal > 0 && cagrYears > 0 ? (Math.pow(endVal / startVal, 1 / cagrYears) - 1) * 100 : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Tab Switcher */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('compound')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'compound' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Compound Interest Calculator
        </button>
        <button
          onClick={() => setActiveTab('cagr')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cagr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          CAGR Growth Calculator
        </button>
      </div>

      {activeTab === 'compound' && (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Initial Principal ($)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Monthly Deposit ($)
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Interest Rate (%/yr)
              </label>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Investment Years
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value))))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Compounding
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={12}>Monthly</option>
                <option value={4}>Quarterly</option>
                <option value={1}>Annually</option>
                <option value={365}>Daily</option>
              </select>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Future Balance</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total Principal Deposited</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                ${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total Interest Earned</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                ${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Year-by-Year Growth Schedule</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                    <th className="p-3">Year</th>
                    <th className="p-3">Total Deposited</th>
                    <th className="p-3">Interest Earned</th>
                    <th className="p-3">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium font-mono">
                  {yearlyBreakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">${row.deposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400">${row.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">${row.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cagr' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Beginning Value ($)
              </label>
              <input
                type="number"
                value={startVal}
                onChange={(e) => setStartVal(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Ending Value ($)
              </label>
              <input
                type="number"
                value={endVal}
                onChange={(e) => setEndVal(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Number of Years
              </label>
              <input
                type="number"
                value={cagrYears}
                onChange={(e) => setCagrYears(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40 max-w-md mx-auto text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
              Compound Annual Growth Rate (CAGR)
            </span>
            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {cagr.toFixed(2)}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Your investment grew at an annualized rate of {cagr.toFixed(2)}% per year over {cagrYears} years.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
