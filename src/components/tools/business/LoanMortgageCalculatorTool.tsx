import React, { useState } from 'react';
import { Calculator, Download, DollarSign, Calendar, PieChart, ShieldCheck } from 'lucide-react';

export function LoanMortgageCalculatorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [extraPayment, setExtraPayment] = useState<number>(0);

  // EMI Calculation Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  } else {
    monthlyPayment = loanAmount / totalMonths;
  }

  const effectiveMonthlyPayment = monthlyPayment + extraPayment;

  // Calculate Amortization
  let balance = loanAmount;
  let totalInterestPaid = 0;
  let actualMonths = 0;
  let yearlySchedule: { year: number; principalPaid: number; interestPaid: number; endingBalance: number }[] = [];

  let currentYearPrincipal = 0;
  let currentYearInterest = 0;

  for (let m = 1; m <= totalMonths && balance > 0; m++) {
    actualMonths++;
    const interestForMonth = balance * monthlyRate;
    let principalForMonth = effectiveMonthlyPayment - interestForMonth;

    if (principalForMonth > balance) {
      principalForMonth = balance;
    }

    balance -= principalForMonth;
    totalInterestPaid += interestForMonth;

    currentYearPrincipal += principalForMonth;
    currentYearInterest += interestForMonth;

    if (m % 12 === 0 || balance <= 0) {
      yearlySchedule.push({
        year: Math.ceil(m / 12),
        principalPaid: currentYearPrincipal,
        interestPaid: currentYearInterest,
        endingBalance: Math.max(0, balance)
      });
      currentYearPrincipal = 0;
      currentYearInterest = 0;
    }
  }

  const totalPaid = loanAmount + totalInterestPaid;
  const principalPercentage = (loanAmount / totalPaid) * 100;
  const interestPercentage = (totalInterestPaid / totalPaid) * 100;

  const exportCsv = () => {
    let csv = 'Year,Principal Paid,Interest Paid,Ending Balance\n';
    yearlySchedule.forEach((row) => {
      csv += `${row.year},${row.principalPaid.toFixed(2)},${row.interestPaid.toFixed(2)},${row.endingBalance.toFixed(2)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Loan_Amortization_Schedule.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported Amortization Schedule to CSV! 📄');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Loan Term (Years)
          </label>
          <select
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-base outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[5, 10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>{y} Years ({y * 12} Months)</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Extra Monthly Payment ($)
          </label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Monthly Payment</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ${effectiveMonthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {extraPayment > 0 && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
              Includes ${extraPayment}/mo extra
            </span>
          )}
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total Interest</span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            ${totalInterestPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total Amount Paid</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Payoff Time</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.floor(actualMonths / 12)} yrs {actualMonths % 12} mos
          </div>
        </div>
      </div>

      {/* Visual Breakdown Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>Principal: {principalPercentage.toFixed(1)}%</span>
          <span>Total Interest: {interestPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div className="bg-indigo-600 h-full transition-all" style={{ width: `${principalPercentage}%` }} />
          <div className="bg-amber-500 h-full transition-all" style={{ width: `${interestPercentage}%` }} />
        </div>
      </div>

      {/* Amortization Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Yearly Amortization Schedule
          </h3>
          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                <th className="p-3.5">Year</th>
                <th className="p-3.5">Principal Paid</th>
                <th className="p-3.5">Interest Paid</th>
                <th className="p-3.5">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 font-mono">
              {yearlySchedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">Year {row.year}</td>
                  <td className="p-3.5 text-indigo-600 dark:text-indigo-400">${row.principalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-3.5 text-amber-500">${row.interestPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-3.5 font-bold">${row.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
