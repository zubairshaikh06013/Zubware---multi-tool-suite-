import React, { useState } from 'react';
import { DollarSign, Percent, Calendar, ShieldCheck, ArrowRight, Check, Copy } from 'lucide-react';

interface PersonalLoanCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const PersonalLoanCalculatorTool: React.FC<PersonalLoanCalculatorToolProps> = ({ onShowToast }) => {
  const [loanAmount, setLoanAmount] = useState<number>(15000);
  const [interestRate, setInterestRate] = useState<number>(10.5); // %
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36); // months
  const [originationFeePct, setOriginationFeePct] = useState<number>(3); // %
  const [copied, setCopied] = useState<boolean>(false);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 100 / 12;
  let monthlyEmi = 0;
  if (monthlyRate > 0 && loanTermMonths > 0) {
    const factor = Math.pow(1 + monthlyRate, loanTermMonths);
    monthlyEmi = (loanAmount * monthlyRate * factor) / (factor - 1);
  } else if (loanTermMonths > 0) {
    monthlyEmi = loanAmount / loanTermMonths;
  }

  const totalPayment = monthlyEmi * loanTermMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const originationFeeAmount = (loanAmount * originationFeePct) / 100;
  const netDisbursedAmount = Math.max(0, loanAmount - originationFeeAmount);

  const copyResult = () => {
    const text = `Personal Loan: $${loanAmount.toLocaleString()} at ${interestRate}% for ${loanTermMonths} mos. Monthly Payment: $${monthlyEmi.toFixed(2)}, Total Interest: $${totalInterest.toFixed(2)}, Net Disbursed: $${netDisbursedAmount.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied loan summary!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💳</span> Personal Loan Calculator (EMI & Fees)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate monthly personal loan payments (EMI), interest charges, upfront origination fees, and net funded proceeds.
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Summary</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Loan Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Loan Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Borrowing Amount ($)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={loanAmount}
                onChange={e => setLoanAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Annual Percentage Rate (APR %)
              </label>
              <input
                type="number"
                min="1"
                max="40"
                step="0.25"
                value={interestRate}
                onChange={e => setInterestRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Term Months */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Loan Tenure (Months)
              </label>
              <select
                value={loanTermMonths}
                onChange={e => setLoanTermMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
                <option value={72}>72 Months (6 Years)</option>
                <option value={84}>84 Months (7 Years)</option>
              </select>
            </div>

            {/* Origination Fee */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Origination Fee ({originationFeePct}%)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={originationFeePct}
                onChange={e => setOriginationFeePct(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Estimated Monthly Payment
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                ${monthlyEmi.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-400">/ month</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Interest Paid:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${totalInterest.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Origination Fee Deducted:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  -${originationFeeAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Net Cash Funded to You:</span>
                <span className="font-mono font-bold text-emerald-600">
                  ${netDisbursedAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total Loan Repayment:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                  ${totalPayment.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
