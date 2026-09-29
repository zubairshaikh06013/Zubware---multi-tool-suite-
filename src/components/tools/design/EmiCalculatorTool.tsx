import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Home, 
  Car, 
  User, 
  Table 
} from 'lucide-react';

interface EmiCalculatorToolProps {
  onShowToast: (message: string) => void;
}

interface YearAmortization {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  balance: number;
}

export const EmiCalculatorTool: React.FC<EmiCalculatorToolProps> = ({ onShowToast }) => {
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5); // %
  const [loanTenureYears, setLoanTenureYears] = useState<number>(25); // years
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(100);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Quick Preset Handlers
  const applyPreset = (amount: number, rate: number, years: number) => {
    setLoanAmount(amount);
    setInterestRate(rate);
    setLoanTenureYears(years);
    onShowToast('Applied loan scenario preset!');
  };

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTenureYears * 12;

  // Monthly EMI
  const baseMonthlyEmi = useMemo(() => {
    if (monthlyRate > 0 && totalMonths > 0) {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      return (loanAmount * monthlyRate * factor) / (factor - 1);
    } else if (totalMonths > 0) {
      return loanAmount / totalMonths;
    }
    return 0;
  }, [loanAmount, monthlyRate, totalMonths]);

  // Annual Schedule Simulation
  const amortizationData = useMemo(() => {
    let balance = loanAmount;
    let totalInterestPaid = 0;
    let actualMonths = 0;
    const yearlyRows: YearAmortization[] = [];

    let currentYearPrincipal = 0;
    let currentYearInterest = 0;

    const monthlyPay = baseMonthlyEmi + extraMonthlyPayment;

    for (let m = 1; m <= totalMonths * 2; m++) {
      if (balance <= 0.01) break;

      const interestMonth = balance * monthlyRate;
      let principalMonth = monthlyPay - interestMonth;

      if (principalMonth > balance) {
        principalMonth = balance;
      }

      balance = Math.max(0, balance - principalMonth);
      totalInterestPaid += interestMonth;
      currentYearPrincipal += principalMonth;
      currentYearInterest += interestMonth;
      actualMonths = m;

      if (m % 12 === 0 || balance <= 0.01) {
        yearlyRows.push({
          year: Math.ceil(m / 12),
          principalPaid: currentYearPrincipal,
          interestPaid: currentYearInterest,
          totalPaid: currentYearPrincipal + currentYearInterest,
          balance: balance
        });
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    const baselineTotalInterest = (baseMonthlyEmi * totalMonths) - loanAmount;
    const interestSaved = Math.max(0, baselineTotalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, totalMonths - actualMonths);
    const yearsSaved = (monthsSaved / 12).toFixed(1);

    return {
      yearlyRows,
      actualMonths,
      totalInterestPaid,
      interestSaved,
      monthsSaved,
      yearsSaved,
      totalCost: loanAmount + totalInterestPaid
    };
  }, [loanAmount, monthlyRate, totalMonths, baseMonthlyEmi, extraMonthlyPayment]);

  const copySummary = () => {
    const text = `Loan EMI Calculation:
Principal: $${loanAmount.toLocaleString()} at ${interestRate}% for ${loanTenureYears} Years (${totalMonths} mos)
Monthly EMI: $${baseMonthlyEmi.toFixed(2)}/mo
Total Interest: $${amortizationData.totalInterestPaid.toFixed(2)}
Total Repayment: $${amortizationData.totalCost.toFixed(2)}
${extraMonthlyPayment > 0 ? `With +$${extraMonthlyPayment}/mo prepayment: Save $${amortizationData.interestSaved.toFixed(2)} and finish ${amortizationData.yearsSaved} years earlier!` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied EMI calculation summary!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    const headers = ['Year', 'Principal Paid', 'Interest Paid', 'Total Paid', 'Remaining Balance'];
    const csvContent = [
      headers.join(','),
      ...amortizationData.yearlyRows.map(r => [
        r.year,
        r.principalPaid.toFixed(2),
        r.interestPaid.toFixed(2),
        r.totalPaid.toFixed(2),
        r.balance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emi_annual_amortization_${loanAmount}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported annual schedule CSV!');
  };

  const principalRatio = (loanAmount / amortizationData.totalCost) * 100;
  const interestRatio = (amortizationData.totalInterestPaid / amortizationData.totalCost) * 100;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Loan EMI & Mortgage Calculator Studio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate Equated Monthly Installments (EMI), interest totals, prepayment payoff accelerations, and yearly amortization.
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

      {/* Preset Loan Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 mr-1 uppercase">Presets:</span>
        <button
          onClick={() => applyPreset(300000, 6.75, 30)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Home className="w-3.5 h-3.5 text-indigo-500" />
          <span>Home Mortgage ($300k, 30 Yrs)</span>
        </button>

        <button
          onClick={() => applyPreset(35000, 5.5, 5)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Car className="w-3.5 h-3.5 text-emerald-500" />
          <span>Auto Loan ($35k, 5 Yrs)</span>
        </button>

        <button
          onClick={() => applyPreset(15000, 11.0, 3)}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <User className="w-3.5 h-3.5 text-amber-500" />
          <span>Personal Loan ($15k, 3 Yrs)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Loan Variables</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Loan Principal Amount ($)</span>
                <span className="text-indigo-600 font-mono">${loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="number"
                min="1000"
                step="1000"
                value={loanAmount}
                onChange={e => setLoanAmount(Math.max(100, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Annual Interest Rate (%)</span>
                <span className="text-indigo-600 font-mono">{interestRate}%</span>
              </div>
              <input
                type="number"
                min="0.1"
                max="30"
                step="0.1"
                value={interestRate}
                onChange={e => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Tenure (Years)</span>
                <span className="text-indigo-600 font-mono">{loanTenureYears} Years ({totalMonths} Months)</span>
              </div>
              <input
                type="number"
                min="1"
                max="40"
                value={loanTenureYears}
                onChange={e => setLoanTenureYears(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                <span>Monthly Prepayment Extra Contribution ($)</span>
                <span className="font-mono">+${extraMonthlyPayment}/mo</span>
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={extraMonthlyPayment}
                onChange={e => setExtraMonthlyPayment(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Adding extra monthly principal saves tens of thousands in cumulative interest.
              </p>
            </div>
          </div>
        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Base Monthly EMI
            </span>

            <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              ${baseMonthlyEmi.toFixed(2)}
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
                <span className="text-base font-black text-rose-500 font-mono">
                  ${amortizationData.totalInterestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Payment</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  ${amortizationData.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {extraMonthlyPayment > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Prepayment Impact
                </div>
                <p className="text-[11px] leading-relaxed">
                  With +${extraMonthlyPayment}/mo, you save <span className="font-bold text-slate-900 dark:text-white">${amortizationData.interestSaved.toFixed(2)}</span> and pay off the loan <span className="font-bold text-slate-900 dark:text-white">{amortizationData.yearsSaved} years earlier</span>!
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{showSchedule ? 'Hide Annual Schedule' : `View Annual Breakdown (${amortizationData.yearlyRows.length} Years)`}</span>
          </button>
        </div>
      </div>

      {/* Annual Schedule Table */}
      {showSchedule && (
        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Year-by-Year Amortization Schedule
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
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Total Paid</th>
                  <th className="py-2.5 px-3">Year-End Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {amortizationData.yearlyRows.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="py-2 px-3 font-bold">Year {row.year}</td>
                    <td className="py-2 px-3 text-emerald-600">${row.principalPaid.toFixed(2)}</td>
                    <td className="py-2 px-3 text-rose-500">${row.interestPaid.toFixed(2)}</td>
                    <td className="py-2 px-3">${row.totalPaid.toFixed(2)}</td>
                    <td className="py-2 px-3 font-bold">${row.balance.toFixed(2)}</td>
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
