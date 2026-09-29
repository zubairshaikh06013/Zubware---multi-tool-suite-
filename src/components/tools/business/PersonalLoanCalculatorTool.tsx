import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Copy, 
  Download, 
  TrendingDown, 
  Sparkles, 
  Table 
} from 'lucide-react';

interface PersonalLoanCalculatorToolProps {
  onShowToast: (message: string) => void;
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export const PersonalLoanCalculatorTool: React.FC<PersonalLoanCalculatorToolProps> = ({ onShowToast }) => {
  const [loanAmount, setLoanAmount] = useState<number>(20000);
  const [interestRate, setInterestRate] = useState<number>(10.5); // %
  const [loanTermMonths, setLoanTermMonths] = useState<number>(36); // months
  const [originationFeePct, setOriginationFeePct] = useState<number>(3); // %
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(50); // optional prepayment
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Standard EMI calculation without prepayment
  const monthlyRate = interestRate / 100 / 12;
  const standardEmi = useMemo(() => {
    if (monthlyRate > 0 && loanTermMonths > 0) {
      const factor = Math.pow(1 + monthlyRate, loanTermMonths);
      return (loanAmount * monthlyRate * factor) / (factor - 1);
    } else if (loanTermMonths > 0) {
      return loanAmount / loanTermMonths;
    }
    return 0;
  }, [loanAmount, monthlyRate, loanTermMonths]);

  // Amortization schedule simulation (with extra prepayment)
  const scheduleData = useMemo(() => {
    const rows: AmortizationRow[] = [];
    let balance = loanAmount;
    let totalInterestPaid = 0;
    let actualMonths = 0;

    const monthlyPay = standardEmi + extraMonthlyPayment;

    for (let m = 1; m <= loanTermMonths * 2; m++) {
      if (balance <= 0.01) break;

      const interestForMonth = balance * monthlyRate;
      let principalForMonth = monthlyPay - interestForMonth;

      if (principalForMonth > balance) {
        principalForMonth = balance;
      }

      balance = Math.max(0, balance - principalForMonth);
      totalInterestPaid += interestForMonth;
      actualMonths = m;

      rows.push({
        month: m,
        payment: principalForMonth + interestForMonth,
        principal: principalForMonth,
        interest: interestForMonth,
        remainingBalance: balance
      });
    }

    const baselineTotalInterest = (standardEmi * loanTermMonths) - loanAmount;
    const interestSaved = Math.max(0, baselineTotalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, loanTermMonths - actualMonths);

    return {
      rows,
      actualMonths,
      totalInterestPaid,
      interestSaved,
      monthsSaved,
      totalCost: loanAmount + totalInterestPaid
    };
  }, [loanAmount, monthlyRate, loanTermMonths, standardEmi, extraMonthlyPayment]);

  const originationFeeAmount = (loanAmount * originationFeePct) / 100;
  const netDisbursedAmount = Math.max(0, loanAmount - originationFeeAmount);

  const copySummary = () => {
    const text = `Personal Loan Calculation:
Borrowing: $${loanAmount.toLocaleString()} at ${interestRate}% APR for ${loanTermMonths} months.
Monthly Payment: $${(standardEmi + extraMonthlyPayment).toFixed(2)}/mo
Total Interest: $${scheduleData.totalInterestPaid.toFixed(2)}
Origination Fee: $${originationFeeAmount.toFixed(2)} (${originationFeePct}%)
Net Cash Disbursed: $${netDisbursedAmount.toFixed(2)}
${extraMonthlyPayment > 0 ? `With +$${extraMonthlyPayment}/mo extra: Pay off ${scheduleData.monthsSaved} months early and save $${scheduleData.interestSaved.toFixed(2)} in interest!` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied loan summary to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    const headers = ['Month', 'Total Payment', 'Principal Paid', 'Interest Paid', 'Remaining Balance'];
    const csvContent = [
      headers.join(','),
      ...scheduleData.rows.map(r => [
        r.month,
        r.payment.toFixed(2),
        r.principal.toFixed(2),
        r.interest.toFixed(2),
        r.remainingBalance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal_loan_amortization_${loanAmount}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported amortization schedule as CSV!');
  };

  const principalRatio = (loanAmount / scheduleData.totalCost) * 100;
  const interestRatio = (scheduleData.totalInterestPaid / scheduleData.totalCost) * 100;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Personal Loan Calculator & Prepayment Simulator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate monthly payments (EMI), origination fees, interest costs, prepayment savings, and full amortization schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copySummary}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Summary</span>
          </button>

          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Loan Parameters & Options</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Loan Amount ($)
              </label>
              <input
                type="number"
                min="500"
                step="500"
                value={loanAmount}
                onChange={e => setLoanAmount(Math.max(100, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Interest Rate (APR %)
              </label>
              <input
                type="number"
                min="0.1"
                max="45"
                step="0.25"
                value={interestRate}
                onChange={e => setInterestRate(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Loan Term (Months)
              </label>
              <select
                value={loanTermMonths}
                onChange={e => setLoanTermMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Origination Fee (%)
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

            <div className="sm:col-span-2 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                <span>Extra Prepayment Per Month ($)</span>
                <span className="font-mono">${extraMonthlyPayment}/mo</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="25"
                value={extraMonthlyPayment}
                onChange={e => setExtraMonthlyPayment(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Simulate paying a little extra each month to crush interest and retire the debt sooner.
              </p>
            </div>
          </div>
        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Estimated Monthly Payment
            </span>

            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              ${(standardEmi + extraMonthlyPayment).toFixed(2)}
              <span className="text-xs font-normal text-slate-500 uppercase ml-2">/ month</span>
            </div>

            {/* Principal vs Interest Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-indigo-600">Principal: {principalRatio.toFixed(0)}%</span>
                <span className="text-rose-500">Interest: {interestRatio.toFixed(0)}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${principalRatio}%` }} className="bg-indigo-600 h-full" />
                <div style={{ width: `${interestRatio}%` }} className="bg-rose-500 h-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Interest</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  ${scheduleData.totalInterestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Amount Paid</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  ${scheduleData.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Origination Fee</span>
                <span className="text-base font-black text-amber-500 font-mono">
                  -${originationFeeAmount.toFixed(2)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Cash Funded</span>
                <span className="text-base font-black text-emerald-500 font-mono">
                  ${netDisbursedAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Prepayment Impact Banner */}
            {extraMonthlyPayment > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Early Payoff Advantage
                </div>
                <p className="text-[11px] leading-relaxed">
                  By paying an extra ${extraMonthlyPayment}/mo, you save <span className="font-bold text-slate-900 dark:text-white">${scheduleData.interestSaved.toFixed(2)}</span> in interest and become debt-free <span className="font-bold text-slate-900 dark:text-white">{scheduleData.monthsSaved} months earlier</span>!
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAmortization(!showAmortization)}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{showAmortization ? 'Hide Monthly Schedule' : `View Amortization Schedule (${scheduleData.rows.length} Months)`}</span>
          </button>
        </div>
      </div>

      {/* Amortization Table (Expandable) */}
      {showAmortization && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Monthly Amortization Schedule
            </h3>
            <button
              onClick={exportCsv}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> Download CSV
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] uppercase text-slate-400 bg-slate-50 dark:bg-slate-900/60 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Month</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Principal</th>
                  <th className="py-2.5 px-3">Interest</th>
                  <th className="py-2.5 px-3">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {scheduleData.rows.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-2 px-3 font-bold">{row.month}</td>
                    <td className="py-2 px-3">${row.payment.toFixed(2)}</td>
                    <td className="py-2 px-3 text-emerald-600">${row.principal.toFixed(2)}</td>
                    <td className="py-2 px-3 text-rose-500">${row.interest.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold">${row.remainingBalance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
