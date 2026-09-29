import React, { useState } from 'react';
import { 
  Tag, 
  Percent, 
  DollarSign, 
  ShoppingBag, 
  Copy, 
  Check, 
  Sparkles, 
  Receipt, 
  Layers, 
  TrendingDown, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SalePriceCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'CAD', symbol: 'CA$' },
  { code: 'AUD', symbol: 'AU$' }
];

const TAX_PRESETS = [
  { name: 'None (0%)', rate: 0 },
  { name: 'US Avg (~8.25%)', rate: 8.25 },
  { name: 'CA / NY (~8.875%)', rate: 8.875 },
  { name: 'India GST (18%)', rate: 18.0 },
  { name: 'UK VAT (20%)', rate: 20.0 },
  { name: 'EU Avg (21%)', rate: 21.0 }
];

export const SalePriceCalculatorTool: React.FC<SalePriceCalculatorToolProps> = ({ onShowToast }) => {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Primary Discount
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(25);

  // Extra Stacked Coupon
  const [extraCouponType, setExtraCouponType] = useState<'percent' | 'fixed'>('percent');
  const [extraCouponValue, setExtraCouponValue] = useState<number>(10);

  // Sales Tax
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(8.25);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const grossOriginalTotal = originalPrice * quantity;

  // Step 1: Initial markdown
  let firstDiscountAmount = 0;
  if (discountType === 'percent') {
    firstDiscountAmount = (originalPrice * Math.min(100, Math.max(0, discountValue))) / 100;
  } else {
    firstDiscountAmount = Math.min(originalPrice, Math.max(0, discountValue));
  }
  const priceAfterFirst = Math.max(0, originalPrice - firstDiscountAmount);

  // Step 2: Extra stackable promo coupon
  let extraDiscountAmount = 0;
  if (extraCouponType === 'percent') {
    extraDiscountAmount = (priceAfterFirst * Math.min(100, Math.max(0, extraCouponValue))) / 100;
  } else {
    extraDiscountAmount = Math.min(priceAfterFirst, Math.max(0, extraCouponValue));
  }
  const unitSalePriceBeforeTax = Math.max(0, priceAfterFirst - extraDiscountAmount);

  // Quantity totals
  const subtotalBeforeTax = unitSalePriceBeforeTax * quantity;
  const unitSavings = originalPrice - unitSalePriceBeforeTax;
  const totalSavings = unitSavings * quantity;
  const effectiveSavingsPercent = originalPrice > 0 ? (unitSavings / originalPrice) * 100 : 0;

  // Step 3: Sales tax
  const totalTaxAmount = (subtotalBeforeTax * Math.max(0, salesTaxPercent)) / 100;
  const finalTotalWithTax = subtotalBeforeTax + totalTaxAmount;

  const copyResult = () => {
    const text = `Sale Price Breakdown (${currency.code}):
Original Price: ${currency.symbol}${originalPrice.toFixed(2)} (Qty: ${quantity} = ${currency.symbol}${grossOriginalTotal.toFixed(2)})
Discounts Applied: Initial ${discountType === 'percent' ? `${discountValue}%` : `${currency.symbol}${discountValue}`} + Extra ${extraCouponType === 'percent' ? `${extraCouponValue}%` : `${currency.symbol}${extraCouponValue}`}
Net Sale Price: ${currency.symbol}${unitSalePriceBeforeTax.toFixed(2)} each (${currency.symbol}${subtotalBeforeTax.toFixed(2)} subtotal)
Total Savings: ${currency.symbol}${totalSavings.toFixed(2)} (${effectiveSavingsPercent.toFixed(1)}% OFF)
Sales Tax (${salesTaxPercent}%): ${currency.symbol}${totalTaxAmount.toFixed(2)}
Final Checkout Price: ${currency.symbol}${finalTotalWithTax.toFixed(2)}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied full sale price breakdown!');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetDefaults = () => {
    setOriginalPrice(100);
    setQuantity(1);
    setDiscountType('percent');
    setDiscountValue(20);
    setExtraCouponType('percent');
    setExtraCouponValue(10);
    setSalesTaxPercent(8.25);
    onShowToast('Reset to default values');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Sale Price & Stacked Coupon Calculator
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate multistep markdown discounts, stacked promo codes, sales tax, and total savings at register checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currency.code === c.code ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                {c.symbol}
              </button>
            ))}
          </div>

          <button
            onClick={copyResult}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Breakdown</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500" />
              <span>Pricing & Promo Stack</span>
            </h3>
            <button
              onClick={resetDefaults}
              className="text-xs text-slate-400 hover:text-indigo-600 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Original Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Original Tag / List Price ({currency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Primary Markdown */}
            <div className="sm:col-span-2 space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Primary Store Discount
                </label>
                <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setDiscountType('percent')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer ${discountType === 'percent' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Percent (%)
                  </button>
                  <button
                    onClick={() => setDiscountType('fixed')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer ${discountType === 'fixed' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Amount ({currency.symbol})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percent' ? 100 : originalPrice}
                  value={discountValue}
                  onChange={e => setDiscountValue(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
                />
                <span className="text-xs font-bold text-slate-500 min-w-[20px]">
                  {discountType === 'percent' ? '%' : currency.symbol}
                </span>
              </div>

              {/* Quick % chips */}
              {discountType === 'percent' && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[10, 15, 20, 25, 30, 40, 50, 70].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setDiscountValue(pct)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer border ${
                        discountValue === pct ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stacked Coupon */}
            <div className="sm:col-span-2 space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Stacked Promo Code / Additional Coupon
                </label>
                <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setExtraCouponType('percent')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer ${extraCouponType === 'percent' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Percent (%)
                  </button>
                  <button
                    onClick={() => setExtraCouponType('fixed')}
                    className={`px-2 py-0.5 rounded-md cursor-pointer ${extraCouponType === 'fixed' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Amount ({currency.symbol})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={extraCouponType === 'percent' ? 100 : priceAfterFirst}
                  value={extraCouponValue}
                  onChange={e => setExtraCouponValue(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
                />
                <span className="text-xs font-bold text-slate-500 min-w-[20px]">
                  {extraCouponType === 'percent' ? '%' : currency.symbol}
                </span>
              </div>
            </div>

            {/* Sales Tax */}
            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Sales Tax / VAT Rate (%)
                </label>
                <span className="text-xs font-black text-indigo-600">
                  {salesTaxPercent}%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TAX_PRESETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setSalesTaxPercent(p.rate)}
                    className={`p-2 rounded-xl text-[11px] font-bold text-left border cursor-pointer transition-all ${
                      salesTaxPercent === p.rate 
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Final Checkout Total (With Tax)
              </span>
              <div className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {currency.symbol}{finalTotalWithTax.toFixed(2)}
              </div>
            </div>

            {/* Savings Pill */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <div>
                  <span className="text-xs font-extrabold block">Total Money Saved</span>
                  <span className="text-lg font-black font-mono">
                    {currency.symbol}{totalSavings.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">{effectiveSavingsPercent.toFixed(0)}%</span>
                <span className="text-[10px] uppercase font-bold block">Combined Off</span>
              </div>
            </div>

            {/* Detailed Line Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Original List Price</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {currency.symbol}{grossOriginalTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">First Markdown Savings</span>
                <span className="font-bold text-emerald-600">
                  -{currency.symbol}{(firstDiscountAmount * quantity).toFixed(2)}
                </span>
              </div>
              {extraDiscountAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                  <span className="text-slate-500">Stacked Promo Savings</span>
                  <span className="font-bold text-emerald-600">
                    -{currency.symbol}{(extraDiscountAmount * quantity).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Subtotal Before Tax</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currency.symbol}{subtotalBeforeTax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                <span className="text-slate-500">Sales Tax ({salesTaxPercent}%)</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  +{currency.symbol}{totalTaxAmount.toFixed(2)}
                </span>
              </div>
              {quantity > 1 && (
                <div className="flex justify-between py-1 text-slate-500 font-semibold">
                  <span>Price Per Unit (all inclusive)</span>
                  <span className="font-mono text-indigo-600 font-bold">
                    {currency.symbol}{(finalTotalWithTax / quantity).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
