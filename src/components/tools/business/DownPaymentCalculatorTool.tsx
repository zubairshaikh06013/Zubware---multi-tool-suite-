import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Percent, 
  PiggyBank, 
  ShieldAlert, 
  Calendar, 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  Sparkles, 
  Home, 
  Info, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

interface DownPaymentCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const LOAN_TYPE_PRESETS = [
  { name: 'Conventional (Standard)', downPct: 20, desc: 'No PMI required, lowest monthly payment' },
  { name: 'Conventional (Minimum)', downPct: 3, desc: 'Requires Private Mortgage Insurance (PMI)' },
  { name: 'FHA Loan', downPct: 3.5, desc: 'Federal Housing Administration backed' },
  { name: 'VA Loan (Veterans)', downPct: 0, desc: 'Zero down payment required' },
  { name: 'Jumbo Luxury', downPct: 15, desc: 'High-balance home purchases' }
];

export const DownPaymentCalculatorTool: React.FC<DownPaymentCalculatorToolProps> = ({ onShowToast }) => {
  const [purchasePrice, setPurchasePrice] = useState<number>(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [timeframeMonths, setTimeframeMonths] = useState<number>(24);
  const [currentSavings, setCurrentSavings] = useState<number>(20000);
  const [closingCostPercent, setClosingCostPercent] = useState<number>(3.0);
  const [hysaApy, setHysaApy] = useState<number>(4.25); // High-yield savings interest rate
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const downPaymentAmount = Math.round((purchasePrice * downPaymentPercent) / 100);
  const loanBalance = Math.max(0, purchasePrice - downPaymentAmount);
  const closingCosts = Math.round((purchasePrice * closingCostPercent) / 100);
  const totalCashNeeded = downPaymentAmount + closingCosts;

  // Monthly savings schedule considering HYSA compound growth
  const { netPrincipalNeeded, monthlyContribution, estimatedInterestEarned } = useMemo(() => {
    const rawShortfall = Math.max(0, totalCashNeeded - currentSavings);
    if (timeframeMonths <= 0) {
      return { netPrincipalNeeded: rawShortfall, monthlyContribution: rawShortfall, estimatedInterestEarned: 0 };
    }

    const r = (hysaApy / 100) / 12;
    // Future value of current savings: FV_initial = currentSavings * (1+r)^n
    const fvInitial = currentSavings * Math.pow(1 + r, timeframeMonths);
    const shortfallAtEnd = Math.max(0, totalCashNeeded - fvInitial);

    // Monthly PMT to reach shortfallAtEnd: PMT = shortfall * r / ((1+r)^n - 1)
    let pmt = 0;
    if (r > 0 && timeframeMonths > 0) {
      pmt = (shortfallAtEnd * r) / (Math.pow(1 + r, timeframeMonths) - 1);
    } else {
      pmt = shortfallAtEnd / timeframeMonths;
    }

    const totalContributed = currentSavings + (pmt * timeframeMonths);
    const totalEarnedInterest = Math.max(0, totalCashNeeded - totalContributed);

    return {
      netPrincipalNeeded: rawShortfall,
      monthlyContribution: Math.round(pmt),
      estimatedInterestEarned: Math.round(totalEarnedInterest)
    };
  }, [totalCashNeeded, currentSavings, timeframeMonths, hysaApy]);

  // PMI Estimation: Typically 0.5% to 1.5% of original loan balance per year if down payment < 20%
  const requiresPmi = downPaymentPercent < 20;
  const estimatedAnnualPmi = requiresPmi ? Math.round(loanBalance * 0.008) : 0;
  const estimatedMonthlyPmi = Math.round(estimatedAnnualPmi / 12);

  const copySummary = () => {
    const text = `Down Payment Savings Plan:
Purchase Price: $${purchasePrice.toLocaleString()}
Down Payment: $${downPaymentAmount.toLocaleString()} (${downPaymentPercent}%)
Closing Costs: $${closingCosts.toLocaleString()} (${closingCostPercent}%)
Total Cash Required: $${totalCashNeeded.toLocaleString()}

Savings Roadmap (${timeframeMonths} Months):
Current Savings: $${currentSavings.toLocaleString()}
Recommended Monthly Deposit: $${monthlyContribution.toLocaleString()}/mo
Interest Earned (at ${hysaApy}% APY): $${estimatedInterestEarned.toLocaleString()}
${requiresPmi ? `⚠️ Est. Monthly PMI: $${estimatedMonthlyPmi}/mo (until 20% equity)` : '✅ No PMI required!'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied down payment plan to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportPlan = () => {
    const text = `=== Zubware Down Payment Planning Report ===
Purchase Price: $${purchasePrice.toLocaleString()}
Down Payment (${downPaymentPercent}%): $${downPaymentAmount.toLocaleString()}
Loan Principal Amount: $${loanBalance.toLocaleString()}
Closing Costs (${closingCostPercent}%): $${closingCosts.toLocaleString()}
Total Cash at Closing: $${totalCashNeeded.toLocaleString()}

Timeframe: ${timeframeMonths} months
Current Savings: $${currentSavings.toLocaleString()}
Target Monthly Deposit: $${monthlyContribution.toLocaleString()}
Projected Interest Growth: $${estimatedInterestEarned.toLocaleString()}
PMI Status: ${requiresPmi ? `Estimated $${estimatedMonthlyPmi}/month` : 'Zero PMI'}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `down-payment-savings-plan.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded savings roadmap!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Home Down Payment & Savings Roadmap
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate target down payments, closing costs, monthly savings goals with high-yield interest, and PMI costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copySummary}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Plan</span>
          </button>
          <button
            onClick={exportPlan}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-500" />
            <span>Property & Target Criteria</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Purchase Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Home Price ($)
              </label>
              <input
                type="number"
                min="50000"
                step="10000"
                value={purchasePrice}
                onChange={e => setPurchasePrice(Math.max(1000, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Down Payment % */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-700 dark:text-slate-300">Down Payment %</label>
                <span className="text-indigo-600 font-mono">${downPaymentAmount.toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={downPaymentPercent}
                onChange={e => setDownPaymentPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Loan Presets */}
            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Common Loan Programs:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LOAN_TYPE_PRESETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setDownPaymentPercent(p.downPct)}
                    className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                      downPaymentPercent === p.downPct
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{p.downPct}% Down</span>
                    <span className="text-[10px] text-slate-500 block truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Savings */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Dedicated Savings ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={currentSavings}
                onChange={e => setCurrentSavings(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Months to purchase */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Savings Goal Timeline (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={timeframeMonths}
                onChange={e => setTimeframeMonths(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Closing Costs & HYSA APY */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Est. Closing Costs (%)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={closingCostPercent}
                onChange={e => setClosingCostPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                High-Yield Savings APY (%)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                step="0.25"
                value={hysaApy}
                onChange={e => setHysaApy(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Target Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Target Monthly Savings Deposit
              </span>
              <div className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                ${monthlyContribution.toLocaleString()}
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/month</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/50 dark:border-slate-800/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Down Payment Amount:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ${downPaymentAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Closing Costs ({closingCostPercent}%):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  ${closingCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800 font-extrabold text-sm">
                <span className="text-slate-900 dark:text-white">Total Cash Required at Closing:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                  ${totalCashNeeded.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Interest Growth Bonus */}
            {estimatedInterestEarned > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  HYSA Compound Interest:
                </span>
                <span className="font-black font-mono">+${estimatedInterestEarned.toLocaleString()} free cash</span>
              </div>
            )}

            {/* PMI Notification */}
            <div className={`p-3.5 rounded-2xl border text-xs ${
              requiresPmi 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
            }`}>
              {requiresPmi ? (
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">PMI Required (Under 20% Down)</span>
                    <span className="opacity-90">
                      Estimated Private Mortgage Insurance: <strong>${estimatedMonthlyPmi}/month</strong> (~${estimatedAnnualPmi}/year) until you reach 20% equity.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  <span className="font-extrabold">20%+ Down Payment: You avoid paying monthly PMI!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
