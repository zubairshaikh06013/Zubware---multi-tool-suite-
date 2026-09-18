import React, { useState } from 'react';
import { DollarSign, Percent, Calendar, ShieldCheck, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface LoanEligibilityCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const LoanEligibilityCalculatorTool: React.FC<LoanEligibilityCalculatorToolProps> = ({ onShowToast }) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6000);
  const [existingEmi, setExistingEmi] = useState<number>(800);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [maxDtiPercent, setMaxDtiPercent] = useState<number>(45);

  // Maximum allowed total monthly obligations based on DTI
  const maxAllowableObligation = (monthlyIncome * maxDtiPercent) / 100;
  // Maximum EMI borrower can afford for new loan
  const maxNewEmi = Math.max(0, maxAllowableObligation - existingEmi);

  // Calculate Loan Amount (Present Value) using standard EMI formula:
  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let eligibleLoanAmount = 0;
  if (monthlyRate > 0 && maxNewEmi > 0) {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    eligibleLoanAmount = Math.round(maxNewEmi * ((factor - 1) / (monthlyRate * factor)));
  }

  // Current DTI without new loan
  const currentDti = monthlyIncome > 0 ? (existingEmi / monthlyIncome) * 100 : 0;
  // Projected DTI with new loan
  const projectedDti = monthlyIncome > 0 ? ((existingEmi + maxNewEmi) / monthlyIncome) * 100 : 0;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏛️</span> Loan Eligibility Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Determine your maximum borrowing capacity based on net monthly income, existing debts, and lender Debt-to-Income (DTI) caps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Borrower Financial Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Net Monthly Take-Home Income ($)
              </label>
              <input
                type="number"
                min="500"
                step="100"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Existing Debts / EMIs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Existing Monthly Debt / EMIs ($)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={existingEmi}
                onChange={e => setExistingEmi(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Expected Interest Rate (% p.a.)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                step="0.1"
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Loan Tenure */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                min="1"
                max="35"
                value={tenureYears}
                onChange={e => setTenureYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          {/* DTI Limit Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Lender Max Debt-to-Income (DTI) Limit</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{maxDtiPercent}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="60"
              step="5"
              value={maxDtiPercent}
              onChange={e => setMaxDtiPercent(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200 dark:bg-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Conservative (30%)</span>
              <span>Standard (45%)</span>
              <span>Aggressive (60%)</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hero Max Loan */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-500/5 to-indigo-500/10 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
              Maximum Estimated Eligible Loan
            </span>

            <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
              ${eligibleLoanAmount.toLocaleString()}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Based on your monthly net income and existing financial commitments, lenders may approve up to this amount.
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Max New EMI</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  ${Math.round(maxNewEmi).toLocaleString()} <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Term</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {totalMonths} <span className="text-xs font-normal text-slate-400">months</span>
                </div>
              </div>
            </div>
          </div>

          {/* DTI Health Status */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">DTI Health Assessment</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  currentDti < 35
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : currentDti < 50
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-rose-500/10 text-rose-600'
                }`}
              >
                {currentDti < 35 ? 'Healthy Profile' : currentDti < 50 ? 'Moderate Debt' : 'High Debt Burden'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Current Debt Ratio:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{currentDti.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Projected Combined DTI:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{projectedDti.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Lending Disclaimer:</span>
            Final loan approval depends on credit score (FICO / CIBIL), employment stability, loan type, and underwriting standards of individual financial institutions.
          </div>
        </div>
      </div>
    </div>
  );
};
