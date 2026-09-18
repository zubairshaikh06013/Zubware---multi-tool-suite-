import React, { useState } from 'react';
import { DollarSign, ShieldAlert, PieChart, TrendingUp, Copy, Check, Info } from 'lucide-react';

interface UsIncomeTaxCalculatorToolProps {
  onShowToast: (message: string) => void;
}

type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

// 2024 Federal Tax Brackets
const BRACKETS_2024: Record<FilingStatus, { rate: number; upTo: number }[]> = {
  single: [
    { rate: 0.1, upTo: 11600 },
    { rate: 0.12, upTo: 47150 },
    { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243725 },
    { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_joint: [
    { rate: 0.1, upTo: 23200 },
    { rate: 0.12, upTo: 94300 },
    { rate: 0.22, upTo: 201050 },
    { rate: 0.24, upTo: 383900 },
    { rate: 0.32, upTo: 487450 },
    { rate: 0.35, upTo: 731200 },
    { rate: 0.37, upTo: Infinity }
  ],
  married_separate: [
    { rate: 0.1, upTo: 11600 },
    { rate: 0.12, upTo: 47150 },
    { rate: 0.22, upTo: 100525 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243725 },
    { rate: 0.35, upTo: 365600 },
    { rate: 0.37, upTo: Infinity }
  ],
  head_of_household: [
    { rate: 0.1, upTo: 16550 },
    { rate: 0.12, upTo: 63100 },
    { rate: 0.22, upTo: 100500 },
    { rate: 0.24, upTo: 191950 },
    { rate: 0.32, upTo: 243700 },
    { rate: 0.35, upTo: 609350 },
    { rate: 0.37, upTo: Infinity }
  ]
};

const STANDARD_DEDUCTION_2024: Record<FilingStatus, number> = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_of_household: 21900
};

export const UsIncomeTaxCalculatorTool: React.FC<UsIncomeTaxCalculatorToolProps> = ({ onShowToast }) => {
  const [grossIncome, setGrossIncome] = useState<number>(85000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [preTaxDeductions, setPreTaxDeductions] = useState<number>(5000); // 401k/HSA
  const [copied, setCopied] = useState<boolean>(false);

  const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus];
  const taxableIncome = Math.max(0, grossIncome - preTaxDeductions - standardDeduction);

  // Calculate Federal Income Tax progressive brackets
  let federalTax = 0;
  let prevLimit = 0;
  let marginalRate = 0.1;

  const brackets = BRACKETS_2024[filingStatus];
  for (const b of brackets) {
    if (taxableIncome > prevLimit) {
      const taxableInBracket = Math.min(taxableIncome - prevLimit, b.upTo - prevLimit);
      federalTax += taxableInBracket * b.rate;
      marginalRate = b.rate;
      prevLimit = b.upTo;
    } else {
      break;
    }
  }

  // FICA:
  // Social Security: 6.2% up to $168,600 wage base (2024)
  const ssTaxableWage = Math.min(grossIncome, 168600);
  const socialSecurityTax = ssTaxableWage * 0.062;

  // Medicare: 1.45% on all income + 0.9% additional surtax over threshold
  const medicareThreshold = filingStatus === 'married_joint' ? 250000 : 200000;
  let medicareTax = grossIncome * 0.0145;
  if (grossIncome > medicareThreshold) {
    medicareTax += (grossIncome - medicareThreshold) * 0.009;
  }

  const totalTax = federalTax + socialSecurityTax + medicareTax;
  const netTakeHome = grossIncome - totalTax - preTaxDeductions;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
  const monthlyTakeHome = netTakeHome / 12;
  const biweeklyTakeHome = netTakeHome / 26;

  const copyResult = () => {
    const text = `Gross: $${grossIncome.toLocaleString()} | Fed Tax: $${Math.round(federalTax).toLocaleString()} | FICA: $${Math.round(socialSecurityTax + medicareTax).toLocaleString()} | Net Take-Home: $${Math.round(netTakeHome).toLocaleString()}/yr ($${Math.round(monthlyTakeHome).toLocaleString()}/mo)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied tax breakdown!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🇺🇸</span> US Federal Income Tax & Take-Home Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate 2024 IRS federal income tax brackets, FICA taxes (Social Security & Medicare), and estimated paycheck take-home pay.
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Breakdown</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Income & Tax Status</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gross Annual Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Gross Annual Income ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={grossIncome}
                onChange={e => setGrossIncome(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Filing Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Filing Status</label>
              <select
                value={filingStatus}
                onChange={e => setFilingStatus(e.target.value as FilingStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
              >
                <option value="single">Single</option>
                <option value="married_joint">Married Filing Jointly</option>
                <option value="married_separate">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>

            {/* Pre-tax deductions (401k, HSA) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Pre-Tax Deductions (401k, HSA) ($)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={preTaxDeductions}
                onChange={e => setPreTaxDeductions(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Standard deduction note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Standard Deduction (2024)
              </label>
              <div className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                ${standardDeduction.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-emerald-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Estimated Net Take-Home Pay
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">
                ${Math.round(netTakeHome).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-400">/ year</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Monthly Take-Home</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                  ${Math.round(monthlyTakeHome).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Bi-Weekly Paycheck</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                  ${Math.round(biweeklyTakeHome).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Federal Income Tax:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${Math.round(federalTax).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Social Security (6.2%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${Math.round(socialSecurityTax).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Medicare (1.45%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${Math.round(medicareTax).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Marginal Tax Bracket:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(marginalRate * 100)}%
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Effective Tax Rate:</span>
                <span className="font-mono text-rose-500">
                  {effectiveTaxRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
