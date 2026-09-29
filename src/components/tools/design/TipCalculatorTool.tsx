import React, { useState } from 'react';
import { Users, DollarSign, Utensils, Copy, Check, Sparkles, Plus, Trash2, SplitSquareVertical } from 'lucide-react';

interface TipCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const CURRENCIES = [
  { symbol: '$', code: 'USD' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '₹', code: 'INR' },
  { symbol: '¥', code: 'JPY' },
  { symbol: 'C$', code: 'CAD' },
  { symbol: 'A$', code: 'AUD' }
];

export const TipCalculatorTool: React.FC<TipCalculatorToolProps> = ({ onShowToast }) => {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [billAmount, setBillAmount] = useState<number>(85);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [roundOption, setRoundOption] = useState<'none' | 'person' | 'total'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const taxAmount = (billAmount * taxPercent) / 100;
  const tipAmountRaw = (billAmount * tipPercent) / 100;
  let totalAmountRaw = billAmount + taxAmount + tipAmountRaw;
  let perPersonRaw = totalAmountRaw / (peopleCount || 1);

  let finalTotal = totalAmountRaw;
  let finalPerPerson = perPersonRaw;
  let finalTip = tipAmountRaw;

  if (roundOption === 'total') {
    finalTotal = Math.ceil(totalAmountRaw);
    finalTip = finalTotal - billAmount - taxAmount;
    finalPerPerson = finalTotal / (peopleCount || 1);
  } else if (roundOption === 'person') {
    finalPerPerson = Math.ceil(perPersonRaw);
    finalTotal = finalPerPerson * peopleCount;
    finalTip = finalTotal - billAmount - taxAmount;
  }

  const perPersonTip = finalTip / (peopleCount || 1);

  const handleCopySummary = () => {
    const text = `🍽️ Zubware Bill Split & Tip Summary
------------------------------------
Bill Amount: ${currency.symbol}${billAmount.toFixed(2)}
${taxPercent > 0 ? `Tax (${taxPercent}%): ${currency.symbol}${taxAmount.toFixed(2)}\n` : ''}Tip (${tipPercent}%): ${currency.symbol}${finalTip.toFixed(2)}
Total Amount: ${currency.symbol}${finalTotal.toFixed(2)}
------------------------------------
People: ${peopleCount}
👉 Each Pays: ${currency.symbol}${finalPerPerson.toFixed(2)} (includes ${currency.symbol}${perPersonTip.toFixed(2)} tip each)

Calculated on Zubware`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Bill split copied! Ready to paste into group chat.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Utensils className="w-5 h-5" />
            </span>
            Restaurant Tip & Bill Split Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate accurate tips, include sales tax, split totals across group members, and round up totals.
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Controls Column (7 cols) */}
        <div className="md:col-span-7 glass-card p-6 rounded-3xl space-y-6 border border-slate-200/80 dark:border-slate-800">
          {/* Bill Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Total Food / Service Bill Amount ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={billAmount}
                onChange={e => setBillAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tip Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Tip Percentage</span>
              <span className="text-indigo-600 font-extrabold text-sm">{tipPercent}%</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[10, 15, 18, 20, 25, 30].map(pct => (
                <button
                  key={pct}
                  onClick={() => setTipPercent(pct)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    tipPercent === pct
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={tipPercent}
              onChange={e => setTipPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
          </div>

          {/* People Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" /> Split Across Group
              </span>
              <span className="text-indigo-600 font-extrabold text-sm">{peopleCount} People</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center text-base"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="25"
                value={peopleCount}
                onChange={e => setPeopleCount(Math.max(1, Number(e.target.value)))}
                className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <button
                onClick={() => setPeopleCount(peopleCount + 1)}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center justify-center text-base"
              >
                +
              </button>
            </div>
          </div>

          {/* Optional Tax & Rounding Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sales Tax (%)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={taxPercent}
                onChange={e => setTaxPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Rounding Preference</label>
              <select
                value={roundOption}
                onChange={e => setRoundOption(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                <option value="none">Exact (Cents/Fractions)</option>
                <option value="person">Round Up Per Person</option>
                <option value="total">Round Up Total Bill</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Hero Column (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-2xl border border-indigo-500/30 space-y-6">
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-[11px] tracking-wider uppercase mb-2">
                Each Person Pays
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-1">
                <span>{currency.symbol}{finalPerPerson.toFixed(2)}</span>
                <span className="text-xs text-indigo-300 font-semibold">/ person</span>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1">
                Includes {currency.symbol}{perPersonTip.toFixed(2)} tip contribution per person
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Original Bill:</span>
                <span className="font-mono font-bold text-white">{currency.symbol}{billAmount.toFixed(2)}</span>
              </div>
              {taxPercent > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Sales Tax ({taxPercent}%):</span>
                  <span className="font-mono font-bold text-white">+{currency.symbol}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-indigo-300 font-bold">
                <span>Total Tip ({tipPercent}%):</span>
                <span className="font-mono text-emerald-400">+{currency.symbol}{finalTip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-white/10">
                <span>Total Payable:</span>
                <span className="font-mono text-indigo-300">{currency.symbol}{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopySummary}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary for Group Chat'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
