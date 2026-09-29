import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Settings, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  RotateCcw 
} from 'lucide-react';

interface CurrencyCalculatorToolProps {
  onShowToast: (message: string) => void;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  ratePerUSD: number;
}

const BENCHMARK_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', ratePerUSD: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', ratePerUSD: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', ratePerUSD: 0.79 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', ratePerUSD: 83.4 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', ratePerUSD: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', ratePerUSD: 1.52 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', ratePerUSD: 156.2 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', ratePerUSD: 0.91 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', ratePerUSD: 3.67 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', ratePerUSD: 3.75 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', ratePerUSD: 1.35 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', ratePerUSD: 7.24 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', ratePerUSD: 5.25 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', ratePerUSD: 18.4 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', ratePerUSD: 1375.0 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', ratePerUSD: 17.1 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', ratePerUSD: 10.65 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', ratePerUSD: 10.75 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', ratePerUSD: 1.64 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', ratePerUSD: 32.2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', ratePerUSD: 7.82 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', ratePerUSD: 36.8 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', ratePerUSD: 16250.0 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', ratePerUSD: 4.71 },
];

const DEFAULT_RATES: Record<string, number> = BENCHMARK_CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr.ratePerUSD;
  return acc;
}, {} as Record<string, number>);

export const CurrencyCalculatorTool: React.FC<CurrencyCalculatorToolProps> = ({ onShowToast }) => {
  const [rates, setRates] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('zubware_custom_rates');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RATES;
  });

  const [amount, setAmount] = useState<number>(100);
  const [fromCurr, setFromCurr] = useState<string>('USD');
  const [toCurr, setToCurr] = useState<string>('EUR');
  const [showRateSettings, setShowRateSettings] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fromRate = rates[fromCurr] || 1;
  const toRate = rates[toCurr] || 1;
  const usdBase = amount / fromRate;
  const convertedResult = usdBase * toRate;

  // Single unit rates
  const unitFromTo = (1 / fromRate) * toRate;
  const unitToFrom = (1 / toRate) * fromRate;

  const updateRate = (curr: string, val: number) => {
    const updated = { ...rates, [curr]: val };
    setRates(updated);
    try {
      localStorage.setItem('zubware_custom_rates', JSON.stringify(updated));
    } catch {}
    onShowToast(`Updated ${curr} exchange rate`);
  };

  const resetRates = () => {
    setRates(DEFAULT_RATES);
    try {
      localStorage.removeItem('zubware_custom_rates');
    } catch {}
    onShowToast('Reset exchange rates to default reference values.');
  };

  const swapCurrencies = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const copyResult = () => {
    const text = `${amount.toLocaleString()} ${fromCurr} = ${convertedResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurr}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied conversion result!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Top multi-currency matrix comparison
  const matrixCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'AED', 'SGD'];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            Multi-Currency Converter & Exchange Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert amounts across 25+ global currencies with custom rate editing and multi-currency comparison matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRateSettings(!showRateSettings)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showRateSettings ? 'Hide Custom Rates' : 'Edit Custom Rates'}</span>
          </button>
        </div>
      </div>

      {/* Main Conversion Dashboard */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Source Currency */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              You Send / Convert
            </label>
            <div className="space-y-2">
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                value={fromCurr}
                onChange={e => setFromCurr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                {BENCHMARK_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex flex-col items-center justify-center pt-4">
            <button
              onClick={swapCurrencies}
              className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:rotate-180 duration-300"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* Target Currency */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Converted Equivalent
              </label>
              <button
                onClick={copyResult}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="space-y-2">
              <div className="w-full px-4 py-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400 select-all truncate">
                {convertedResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurr}
              </div>
              <select
                value={toCurr}
                onChange={e => setToCurr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
              >
                {BENCHMARK_CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rate Conversion Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 font-mono">
          <span>1 {fromCurr} = {unitFromTo.toFixed(4)} {toCurr}</span>
          <span>1 {toCurr} = {unitToFrom.toFixed(4)} {fromCurr}</span>
        </div>

        {/* Quick Amount Multipliers */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Quick Multipliers:</span>
          {[1, 10, 50, 100, 250, 500, 1000, 5000].map(val => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                amount === val
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {val.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Currency Matrix Benchmark */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
          <span>{amount.toLocaleString()} {fromCurr} Across Global Currencies</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">Multi-Exchange Grid</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {BENCHMARK_CURRENCIES.slice(0, 15).map(curr => {
            const matrixTargetRate = rates[curr.code] || 1;
            const matrixVal = usdBase * matrixTargetRate;

            return (
              <div
                key={curr.code}
                onClick={() => setToCurr(curr.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  toCurr === curr.code
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.02]'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                  <span>{curr.code}</span>
                  <span className="opacity-70">{curr.symbol}</span>
                </div>
                <div className="text-sm font-black font-mono truncate">
                  {matrixVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] opacity-75 truncate">{curr.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customizable Exchange Rate Table (Expandable) */}
      {showRateSettings && (
        <div className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Reference Exchange Rates (1 USD = X Currency)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Adjust values for offline calculation or testing specific forex spreads.
              </p>
            </div>
            <button
              onClick={resetRates}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {BENCHMARK_CURRENCIES.map(curr => (
              <div key={curr.code} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                  <span>{curr.code}</span>
                  <span>{curr.symbol}</span>
                </div>
                <input
                  type="number"
                  step="0.0001"
                  value={rates[curr.code] || curr.ratePerUSD}
                  onChange={e => updateRate(curr.code, Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
