import React, { useState } from 'react';
import { Wallet, PieChart, DollarSign, Copy, Check, Printer, RefreshCw, Sparkles, HelpCircle, Shield, Award } from 'lucide-react';

interface CtcCalculatorToolProps {
  onShowToast: (msg: string) => void;
}

const CURRENCIES = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' }
];

const PRESETS = [
  { name: 'Standard Corporate', ctc: 120000, basicPct: 50, hraPct: 20, pfPct: 12, profTaxMonthly: 200 },
  { name: 'Tech Startup / High Flex', ctc: 160000, basicPct: 40, hraPct: 25, pfPct: 12, profTaxMonthly: 200 },
  { name: 'Entry Level / Fresher', ctc: 45000, basicPct: 50, hraPct: 20, pfPct: 12, profTaxMonthly: 150 },
  { name: 'Executive Package', ctc: 250000, basicPct: 45, hraPct: 25, pfPct: 12, profTaxMonthly: 200 }
];

export const CtcCalculatorTool: React.FC<CtcCalculatorToolProps> = ({ onShowToast }) => {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [grossCtc, setGrossCtc] = useState<number>(120000);
  const [basicPct, setBasicPct] = useState<number>(50);
  const [hraPct, setHraPct] = useState<number>(20);
  const [pfPct, setPfPct] = useState<number>(12);
  const [profTaxMonthly, setProfTaxMonthly] = useState<number>(200);
  const [includeGratuity, setIncludeGratuity] = useState<boolean>(true);
  const [includeHealthInsurance, setIncludeHealthInsurance] = useState<boolean>(true);
  const [insuranceMonthly, setInsuranceMonthly] = useState<number>(150);
  const [taxRegime, setTaxRegime] = useState<'standard' | 'simplified' | 'none'>('standard');
  const [viewMode, setViewMode] = useState<'monthly' | 'annual'>('monthly');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const basicAnnual = Math.round(grossCtc * (basicPct / 100));
  const hraAnnual = Math.round(grossCtc * (hraPct / 100));
  const pfEmployeeAnnual = Math.round(basicAnnual * (pfPct / 100));
  const pfEmployerAnnual = Math.round(basicAnnual * (pfPct / 100)); // CTC includes employer PF
  const gratuityAnnual = includeGratuity ? Math.round(basicAnnual * 0.0481) : 0;
  
  // Special Allowance is whatever remains in Gross CTC after Basic, HRA, Employer PF, Gratuity
  const specialAllowanceAnnual = Math.max(0, grossCtc - basicAnnual - hraAnnual - pfEmployerAnnual - gratuityAnnual);

  // Gross Earnings received on payslip
  const grossMonthlyEarnings = Math.round((basicAnnual + hraAnnual + specialAllowanceAnnual) / 12);
  const grossAnnualEarnings = grossMonthlyEarnings * 12;

  // Deductions from payslip: Employee PF + Professional Tax + Health Insurance
  const profTaxAnnual = profTaxMonthly * 12;
  const insuranceAnnual = includeHealthInsurance ? insuranceMonthly * 12 : 0;
  
  // Estimated Income Tax
  let estimatedAnnualTax = 0;
  if (taxRegime === 'standard') {
    const taxableIncome = Math.max(0, grossAnnualEarnings - 50000); // standard deduction
    if (taxableIncome > 100000) {
      estimatedAnnualTax = Math.round(taxableIncome * 0.20);
    } else if (taxableIncome > 50000) {
      estimatedAnnualTax = Math.round(taxableIncome * 0.12);
    } else if (taxableIncome > 25000) {
      estimatedAnnualTax = Math.round(taxableIncome * 0.05);
    }
  } else if (taxRegime === 'simplified') {
    estimatedAnnualTax = Math.round(grossAnnualEarnings * 0.10);
  }

  const totalDeductionsAnnual = pfEmployeeAnnual + profTaxAnnual + insuranceAnnual + estimatedAnnualTax;
  const totalDeductionsMonthly = Math.round(totalDeductionsAnnual / 12);

  const netAnnualTakeHome = Math.max(0, grossAnnualEarnings - totalDeductionsAnnual);
  const netMonthlyInHand = Math.round(netAnnualTakeHome / 12);

  const takeHomePercentage = grossCtc > 0 ? ((netAnnualTakeHome / grossCtc) * 100).toFixed(1) : '0';

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setGrossCtc(preset.ctc);
    setBasicPct(preset.basicPct);
    setHraPct(preset.hraPct);
    setPfPct(preset.pfPct);
    setProfTaxMonthly(preset.profTaxMonthly);
    onShowToast(`Applied ${preset.name} preset!`);
  };

  const handleCopyBreakdown = () => {
    const report = `Zubware CTC to In-Hand Salary Breakdown
----------------------------------------
Currency: ${currency.code} (${currency.symbol})
Total Annual Package (CTC): ${currency.symbol}${grossCtc.toLocaleString()}

Estimated Net In-Hand Salary:
- Monthly Take-Home: ${currency.symbol}${netMonthlyInHand.toLocaleString()} / month
- Annual Take-Home: ${currency.symbol}${netAnnualTakeHome.toLocaleString()} / year
- Take-Home Ratio: ${takeHomePercentage}% of CTC

Earnings Breakdown (Monthly):
- Basic Salary: ${currency.symbol}${Math.round(basicAnnual / 12).toLocaleString()}
- House Rent Allowance (HRA): ${currency.symbol}${Math.round(hraAnnual / 12).toLocaleString()}
- Special Allowances: ${currency.symbol}${Math.round(specialAllowanceAnnual / 12).toLocaleString()}
- Gross Monthly Earnings: ${currency.symbol}${grossMonthlyEarnings.toLocaleString()}

Monthly Deductions:
- Provident Fund (PF): ${currency.symbol}${Math.round(pfEmployeeAnnual / 12).toLocaleString()}
- Professional Tax: ${currency.symbol}${profTaxMonthly.toLocaleString()}
${includeHealthInsurance ? `- Health Insurance: ${currency.symbol}${insuranceMonthly.toLocaleString()}\n` : ''}${estimatedAnnualTax > 0 ? `- Estimated Income Tax (TDS): ${currency.symbol}${Math.round(estimatedAnnualTax / 12).toLocaleString()}\n` : ''}- Total Deductions: ${currency.symbol}${totalDeductionsMonthly.toLocaleString()}

Generated with Zubware Salary Calculator`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    onShowToast('Salary breakdown report copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Wallet className="w-5 h-5" />
            </span>
            CTC to In-Hand Salary Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate accurate net monthly in-hand take-home salary after PF, HRA, gratuity, and tax deductions.
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
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Results Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900/90 via-indigo-950 to-slate-950 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[11px] tracking-wider uppercase mb-2">
                Estimated Net In-Hand Take-Home
              </span>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
                <span>{currency.symbol}{viewMode === 'monthly' ? netMonthlyInHand.toLocaleString() : netAnnualTakeHome.toLocaleString()}</span>
                <span className="text-sm sm:text-base font-semibold text-indigo-300">
                  / {viewMode === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1.5">
                {takeHomePercentage}% of your total {currency.symbol}{grossCtc.toLocaleString()} annual CTC package
              </p>
            </div>

            {/* Toggle Monthly vs Annual & Copy */}
            <div className="flex flex-col sm:items-end gap-3">
              <div className="flex rounded-xl bg-white/10 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'monthly' ? 'bg-indigo-500 text-white shadow-sm' : 'text-indigo-200 hover:text-white'
                  }`}
                >
                  Monthly View
                </button>
                <button
                  onClick={() => setViewMode('annual')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'annual' ? 'bg-indigo-500 text-white shadow-sm' : 'text-indigo-200 hover:text-white'
                  }`}
                >
                  Annual View
                </button>
              </div>

              <button
                onClick={handleCopyBreakdown}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Report!' : 'Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Visual Percentage Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex justify-between text-[11px] font-bold text-indigo-200">
              <span>Salary Composition</span>
              <span>Net Take-Home vs Deductions</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${takeHomePercentage}%` }}
                className="bg-emerald-400 h-full transition-all duration-300"
                title={`Take Home: ${takeHomePercentage}%`}
              />
              <div
                style={{ width: `${100 - Number(takeHomePercentage)}%` }}
                className="bg-rose-400 h-full transition-all duration-300"
                title={`Deductions: ${(100 - Number(takeHomePercentage)).toFixed(1)}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Net Take-Home ({takeHomePercentage}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Total Deductions ({(100 - Number(takeHomePercentage)).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Inputs & Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configurable Sliders & Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" /> Compensation Inputs
            </h3>

            {/* Total Annual CTC Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Annual Package (CTC in {currency.code})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={grossCtc}
                  onChange={(e) => setGrossCtc(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                />
              </div>
            </div>

            {/* Basic % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Basic Salary Share</span>
                <span className="text-indigo-600 font-extrabold">{basicPct}% of CTC</span>
              </div>
              <input
                type="range"
                min="30"
                max="60"
                value={basicPct}
                onChange={(e) => setBasicPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400 block">Typical industry standard is 40% - 50%</span>
            </div>

            {/* HRA % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>House Rent Allowance (HRA)</span>
                <span className="text-indigo-600 font-extrabold">{hraPct}% of CTC</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={hraPct}
                onChange={(e) => setHraPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* PF % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Employee PF Rate</span>
                <span className="text-indigo-600 font-extrabold">{pfPct}% of Basic</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={pfPct}
                onChange={(e) => setPfPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Tax Regime Mode */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Income Tax Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTaxRegime('standard')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                    taxRegime === 'standard' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setTaxRegime('simplified')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                    taxRegime === 'simplified' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Flat 10%
                </button>
                <button
                  onClick={() => setTaxRegime('none')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                    taxRegime === 'none' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Pre-Tax
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeGratuity}
                  onChange={(e) => setIncludeGratuity(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Include Gratuity in CTC (4.81% of Basic)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeHealthInsurance}
                  onChange={(e) => setIncludeHealthInsurance(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Include Health / Medical Insurance ({currency.symbol}{insuranceMonthly}/mo)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Itemized Payslip Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Earnings Card */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-500" />
                Gross Earnings ({viewMode === 'monthly' ? 'Monthly' : 'Annual'})
              </h3>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                +{currency.symbol}{viewMode === 'monthly' ? grossMonthlyEarnings.toLocaleString() : grossAnnualEarnings.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Basic Salary</span>
                  <span className="text-[10px] text-slate-400">{basicPct}% of Total CTC</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                  {currency.symbol}{viewMode === 'monthly' ? Math.round(basicAnnual / 12).toLocaleString() : basicAnnual.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">House Rent Allowance (HRA)</span>
                  <span className="text-[10px] text-slate-400">{hraPct}% of Total CTC</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                  {currency.symbol}{viewMode === 'monthly' ? Math.round(hraAnnual / 12).toLocaleString() : hraAnnual.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Special Allowance / Flexi-Pay</span>
                  <span className="text-[10px] text-slate-400">Balancing taxable allowances</span>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                  {currency.symbol}{viewMode === 'monthly' ? Math.round(specialAllowanceAnnual / 12).toLocaleString() : specialAllowanceAnnual.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Card */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                Deductions ({viewMode === 'monthly' ? 'Monthly' : 'Annual'})
              </h3>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                -{currency.symbol}{viewMode === 'monthly' ? totalDeductionsMonthly.toLocaleString() : totalDeductionsAnnual.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 text-rose-500 dark:text-rose-400">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Employee Provident Fund (PF)</span>
                  <span className="text-[10px] text-slate-400">{pfPct}% of Basic Salary</span>
                </div>
                <span className="font-extrabold font-mono">
                  -{currency.symbol}{viewMode === 'monthly' ? Math.round(pfEmployeeAnnual / 12).toLocaleString() : pfEmployeeAnnual.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 text-rose-500 dark:text-rose-400">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Professional Tax</span>
                  <span className="text-[10px] text-slate-400">Statutory municipal tax</span>
                </div>
                <span className="font-extrabold font-mono">
                  -{currency.symbol}{viewMode === 'monthly' ? profTaxMonthly.toLocaleString() : profTaxAnnual.toLocaleString()}
                </span>
              </div>

              {includeHealthInsurance && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 text-rose-500 dark:text-rose-400">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Medical Insurance Premium</span>
                    <span className="text-[10px] text-slate-400">Health coverage contribution</span>
                  </div>
                  <span className="font-extrabold font-mono">
                    -{currency.symbol}{viewMode === 'monthly' ? insuranceMonthly.toLocaleString() : insuranceAnnual.toLocaleString()}
                  </span>
                </div>
              )}

              {estimatedAnnualTax > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 text-rose-500 dark:text-rose-400">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Estimated Income Tax (TDS)</span>
                    <span className="text-[10px] text-slate-400">Based on standard tax estimation</span>
                  </div>
                  <span className="font-extrabold font-mono">
                    -{currency.symbol}{viewMode === 'monthly' ? Math.round(estimatedAnnualTax / 12).toLocaleString() : estimatedAnnualTax.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Summary Total Bar */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900 flex items-center justify-between mt-4">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Net Credited into Bank Account</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Final take-home after all statutory and tax deductions</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                  {currency.symbol}{viewMode === 'monthly' ? netMonthlyInHand.toLocaleString() : netAnnualTakeHome.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">/ {viewMode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
