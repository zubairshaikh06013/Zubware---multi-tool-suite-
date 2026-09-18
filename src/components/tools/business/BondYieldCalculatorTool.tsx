import React, { useState } from 'react';
import { DollarSign, Percent, TrendingUp, Calendar, ShieldCheck, Info } from 'lucide-react';

interface BondYieldCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const BondYieldCalculatorTool: React.FC<BondYieldCalculatorToolProps> = ({ onShowToast }) => {
  const [faceValue, setFaceValue] = useState<number>(1000);
  const [marketPrice, setMarketPrice] = useState<number>(950);
  const [couponRate, setCouponRate] = useState<number>(5); // 5%
  const [yearsToMaturity, setYearsToMaturity] = useState<number>(10);
  const [couponFrequency, setCouponFrequency] = useState<number>(2); // semi-annual

  // Annual coupon payment
  const annualCoupon = (faceValue * couponRate) / 100;
  // Current Yield = Annual Coupon / Market Price
  const currentYield = marketPrice > 0 ? (annualCoupon / marketPrice) * 100 : 0;

  // Approximate Yield to Maturity (YTM) standard formula:
  // YTM approx = [ C + (F - P) / n ] / [ (F + P) / 2 ]
  // Where C = annual coupon, F = face value, P = price, n = years
  let ytmApprox = 0;
  if (yearsToMaturity > 0 && marketPrice > 0) {
    const numerator = annualCoupon + (faceValue - marketPrice) / yearsToMaturity;
    const denominator = (faceValue + marketPrice) / 2;
    ytmApprox = (numerator / denominator) * 100;
  }

  // Capital gain/loss at maturity
  const capitalGain = faceValue - marketPrice;
  const totalCoupons = annualCoupon * yearsToMaturity;
  const totalReturn = totalCoupons + capitalGain;

  const bondType =
    marketPrice < faceValue
      ? 'Discount Bond (Price < Face Value)'
      : marketPrice > faceValue
      ? 'Premium Bond (Price > Face Value)'
      : 'Par Bond (Price = Face Value)';

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📈</span> Bond Yield Calculator (YTM & Current Yield)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate Yield to Maturity (YTM), current yield, coupon income, and capital appreciation for fixed-income securities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-500" />
            <span>Bond Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Face Value */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Par / Face Value ($)
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={faceValue}
                onChange={e => setFaceValue(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Current Market Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Market Price ($)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={marketPrice}
                onChange={e => setMarketPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Annual Coupon Rate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Annual Coupon Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={couponRate}
                onChange={e => setCouponRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Years to Maturity */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Years to Maturity
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={yearsToMaturity}
                onChange={e => setYearsToMaturity(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Hero Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Yield to Maturity (YTM)
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {ytmApprox.toFixed(2)}%
              </span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {bondType}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Current Yield:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentYield.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Annual Coupon Payout:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${annualCoupon.toFixed(2)} / yr
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Coupon Payouts ({yearsToMaturity} yrs):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${totalCoupons.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Capital Gain / Loss:</span>
                <span className={`font-mono font-bold ${capitalGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {capitalGain >= 0 ? `+$${capitalGain.toFixed(2)}` : `-$${Math.abs(capitalGain).toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">Financial Note:</span>
            Yield to Maturity assumes all interim coupon payments are reinvested at the same YTM rate and that the bond is held until full maturity.
          </div>
        </div>
      </div>
    </div>
  );
};
