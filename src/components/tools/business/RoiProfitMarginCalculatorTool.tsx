import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent, PieChart, Sparkles, HelpCircle, ArrowRight, Layers, Calculator } from 'lucide-react';

export function RoiProfitMarginCalculatorTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<'margin' | 'roi' | 'breakeven'>('margin');
  const [currency, setCurrency] = useState<string>('$');

  // Profit Margin & Markup Inputs
  const [costPrice, setCostPrice] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number>(80);
  const [quantity, setQuantity] = useState<number>(100);
  const [additionalExpenses, setAdditionalExpenses] = useState<number>(500);

  // ROI Inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [finalValue, setFinalValue] = useState<number>(14500);
  const [investmentDurationYears, setInvestmentDurationYears] = useState<number>(2);

  // Break-Even Inputs
  const [fixedCosts, setFixedCosts] = useState<number>(5000);
  const [pricePerUnit, setPricePerUnit] = useState<number>(100);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(60);

  // Margin & Markup Math
  const unitGrossProfit = sellingPrice - costPrice;
  const grossProfitMarginPercent = sellingPrice > 0 ? (unitGrossProfit / sellingPrice) * 100 : 0;
  const markupPercent = costPrice > 0 ? (unitGrossProfit / costPrice) * 100 : 0;
  
  const totalRevenue = sellingPrice * quantity;
  const totalCogs = costPrice * quantity;
  const totalGrossProfit = unitGrossProfit * quantity;
  const totalNetProfit = totalGrossProfit - additionalExpenses;
  const netProfitMarginPercent = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  // ROI Math
  const netGain = finalValue - initialInvestment;
  const roiPercentage = initialInvestment > 0 ? (netGain / initialInvestment) * 100 : 0;
  const annualizedRoi = (initialInvestment > 0 && investmentDurationYears > 0)
    ? (Math.pow(finalValue / initialInvestment, 1 / investmentDurationYears) - 1) * 100
    : 0;

  // Break Even Math
  const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
  const contributionMarginRatio = pricePerUnit > 0 ? (contributionMarginPerUnit / pricePerUnit) * 100 : 0;
  const breakEvenUnits = contributionMarginPerUnit > 0 ? Math.ceil(fixedCosts / contributionMarginPerUnit) : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header & Currency Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Profit Margin, Markup & ROI Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate gross profit, net profit margin, markup percentage, return on investment, and break-even point.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {['$', '₹', '€', '£', 'AED'].map((sym) => (
            <button
              key={sym}
              onClick={() => { setCurrency(sym); onShowToast(`Currency set to ${sym}`); }}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                currency === sym
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
        <button
          onClick={() => setActiveTab('margin')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'margin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Profit Margin & Markup
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ROI Calculator
        </button>
        <button
          onClick={() => setActiveTab('breakeven')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'breakeven' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Break-Even Analysis
        </button>
      </div>

      {/* TAB 1: MARGIN & MARKUP */}
      {activeTab === 'margin' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Cost of Goods ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={costPrice}
                onChange={(e) => setCostPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Cost to produce or acquire 1 unit</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Selling Price ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Final price charged to customer</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Quantity Units Sold
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Total volume for net calculations</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Operating Overhead ({currency})
              </label>
              <input
                type="number"
                min={0}
                value={additionalExpenses}
                onChange={(e) => setAdditionalExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Marketing, rent, shipping, etc.</span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Gross Profit Margin %</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {grossProfitMarginPercent.toFixed(2)}%
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">(Profit / Revenue) &times; 100</span>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Markup %</span>
              <div className="text-3xl font-black text-amber-500 mt-1">
                {markupPercent.toFixed(2)}%
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">(Profit / Cost Price) &times; 100</span>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Unit Profit</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {currency}{unitGrossProfit.toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Per individual unit</span>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Net Profit Margin %</span>
              <div className={`text-3xl font-black mt-1 ${netProfitMarginPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {netProfitMarginPercent.toFixed(2)}%
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">After {currency}{additionalExpenses.toLocaleString()} overhead</span>
            </div>
          </div>

          {/* Volume Summary Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Total Volume Financial Summary ({quantity.toLocaleString()} Units)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Gross Revenue</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{currency}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Cost of Goods</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{currency}{totalCogs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Gross Profit</span>
                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{currency}{totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Net Take-Home Profit</span>
                <span className={`text-base font-black ${totalNetProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>{currency}{totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Explainer: Margin vs Markup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <strong className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" /> What is Profit Margin?
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Profit Margin measures the percentage of final selling revenue that is profit. A 50% profit margin means for every $1.00 you earn, $0.50 is gross profit. Margin can never exceed 100%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <strong className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" /> What is Markup?
              </strong>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Markup is the percentage added on top of your original cost price to set the selling price. A 100% markup on a $50 cost means you add $50, selling for $100 (which equals a 50% margin).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROI */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Initial Investment ({currency})
              </label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Final Value / Revenue ({currency})
              </label>
              <input
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Duration (Years)
              </label>
              <input
                type="number"
                step="0.5"
                value={investmentDurationYears}
                onChange={(e) => setInvestmentDurationYears(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total ROI</span>
              <div className={`text-3xl font-black mt-1 ${roiPercentage >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                {roiPercentage.toFixed(2)}%
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Annualized ROI (CAGR)</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {annualizedRoi.toFixed(2)}%
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Net Profit / Gain</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {currency}{netGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BREAK EVEN */}
      {activeTab === 'breakeven' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Fixed Overhead Costs ({currency})
              </label>
              <input
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Selling Price / Unit ({currency})
              </label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Variable Cost / Unit ({currency})
              </label>
              <input
                type="number"
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 bg-indigo-50/40 dark:bg-slate-900/40">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Break-Even Units</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {breakEvenUnits.toLocaleString()} units
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Break-Even Revenue</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {currency}{breakEvenRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Contribution Margin / Unit</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {currency}{contributionMarginPerUnit.toFixed(2)}
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Contribution Ratio</span>
              <div className="text-3xl font-black text-amber-500 mt-1">
                {contributionMarginRatio.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

