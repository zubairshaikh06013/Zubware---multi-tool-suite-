import React, { useState } from 'react';
import { Tag, Percent, DollarSign, ShoppingBag, Copy, Check } from 'lucide-react';

interface SalePriceCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const SalePriceCalculatorTool: React.FC<SalePriceCalculatorToolProps> = ({ onShowToast }) => {
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [extraCouponPercent, setExtraCouponPercent] = useState<number>(10);
  const [salesTaxPercent, setSalesTaxPercent] = useState<number>(8.25);
  const [copied, setCopied] = useState<boolean>(false);

  // Step 1: Initial markdown
  const firstDiscountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterFirstDiscount = Math.max(0, originalPrice - firstDiscountAmount);

  // Step 2: Extra stackable promo coupon
  const extraDiscountAmount = (priceAfterFirstDiscount * extraCouponPercent) / 100;
  const salePriceBeforeTax = Math.max(0, priceAfterFirstDiscount - extraDiscountAmount);

  // Total savings
  const totalSavings = originalPrice - salePriceBeforeTax;
  const effectiveSavingsPercent = originalPrice > 0 ? (totalSavings / originalPrice) * 100 : 0;

  // Step 3: Sales tax
  const salesTaxAmount = (salePriceBeforeTax * salesTaxPercent) / 100;
  const finalPriceWithTax = salePriceBeforeTax + salesTaxAmount;

  const copyResult = () => {
    const text = `Sale Price: $${salePriceBeforeTax.toFixed(2)} (Save $${totalSavings.toFixed(2)} / ${effectiveSavingsPercent.toFixed(1)}% off) | Final with Tax: $${finalPriceWithTax.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied sale price breakdown!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏷️</span> Sale Price & Stacked Coupon Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate markdown sale prices, stacked promo code discounts, sales tax, and total out-of-pocket checkout costs.
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
            <Tag className="w-4 h-4 text-indigo-500" />
            <span>Pricing & Discount Terms</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Original Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Original Tag / List Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={originalPrice}
                onChange={e => setOriginalPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Sale Discount % */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Markdown Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={e => setDiscountPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Extra Coupon % */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Extra Stacked Promo / Coupon (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={extraCouponPercent}
                onChange={e => setExtraCouponPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Sales Tax % */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sales Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                step="0.25"
                value={salesTaxPercent}
                onChange={e => setSalesTaxPercent(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Popular Sales Presets:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '15% Off', d: 15, e: 0 },
                { label: '25% Off', d: 25, e: 0 },
                { label: '40% Clearance', d: 40, e: 0 },
                { label: '50% Half Price', d: 50, e: 0 },
                { label: '30% + Extra 20%', d: 30, e: 20 },
                { label: 'Black Friday (60%)', d: 60, e: 0 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDiscountPercent(p.d);
                    setExtraCouponPercent(p.e);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Final Sale Price (Before Tax)
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                ${salePriceBeforeTax.toFixed(2)}
              </span>
              <span className="text-sm font-bold line-through text-slate-400">
                ${originalPrice.toFixed(2)}
              </span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              You Save ${totalSavings.toFixed(2)} ({effectiveSavingsPercent.toFixed(1)}% total savings)
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Sales Tax ({salesTaxPercent}%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  +${salesTaxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total Due at Register:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                  ${finalPriceWithTax.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
