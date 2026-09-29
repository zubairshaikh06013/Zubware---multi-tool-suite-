import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ShoppingBag, Plus, Trash2, Percent, DollarSign } from 'lucide-react';

interface DiscountCalculatorToolProps {
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

interface CartItem {
  id: string;
  name: string;
  price: number;
  discount: number;
  type: 'percent' | 'flat';
}

export const DiscountCalculatorTool: React.FC<DiscountCalculatorToolProps> = ({ onShowToast }) => {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [calculatorMode, setCalculatorMode] = useState<'single' | 'cart'>('single');

  // Single Item State
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(25);
  const [extraCouponPct, setExtraCouponPct] = useState<number>(10);
  const [useExtraCoupon, setUseExtraCoupon] = useState<boolean>(false);
  const [taxPercent, setTaxPercent] = useState<number>(8);
  const [copied, setCopied] = useState<boolean>(false);

  // Cart Items State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Sneakers / Shoes', price: 90, discount: 20, type: 'percent' },
    { id: '2', name: 'Denim Jacket', price: 65, discount: 15, type: 'flat' }
  ]);

  // Single Calculations
  const firstDiscountAmount = discountType === 'percent'
    ? (originalPrice * discountValue) / 100
    : Math.min(originalPrice, discountValue);

  const priceAfterFirstDiscount = Math.max(0, originalPrice - firstDiscountAmount);
  
  const couponDiscountAmount = useExtraCoupon
    ? (priceAfterFirstDiscount * extraCouponPct) / 100
    : 0;

  const totalDiscountAmount = firstDiscountAmount + couponDiscountAmount;
  const priceBeforeTax = Math.max(0, originalPrice - totalDiscountAmount);
  const taxAmount = (priceBeforeTax * taxPercent) / 100;
  const finalPrice = priceBeforeTax + taxAmount;
  const effectiveSavingsPct = originalPrice > 0 ? ((totalDiscountAmount / originalPrice) * 100).toFixed(1) : '0';

  // Cart Calculations
  const cartSubtotal = cartItems.reduce((acc, it) => acc + it.price, 0);
  const cartSavings = cartItems.reduce((acc, it) => {
    const d = it.type === 'percent' ? (it.price * it.discount) / 100 : Math.min(it.price, it.discount);
    return acc + d;
  }, 0);
  const cartAfterDiscount = Math.max(0, cartSubtotal - cartSavings);
  const cartTax = (cartAfterDiscount * taxPercent) / 100;
  const cartTotal = cartAfterDiscount + cartTax;

  const handleAddItem = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      name: `Item #${cartItems.length + 1}`,
      price: 50,
      discount: 10,
      type: 'percent'
    };
    setCartItems([...cartItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(i => i.id !== id));
  };

  const handleCopyReceipt = () => {
    let report = '';
    if (calculatorMode === 'single') {
      report = `🏷️ Zubware Discount & Savings Receipt
---------------------------------------
Original Retail Price: ${currency.symbol}${originalPrice.toFixed(2)}
Primary Discount: ${discountType === 'percent' ? `${discountValue}%` : `${currency.symbol}${discountValue}`} (-${currency.symbol}${firstDiscountAmount.toFixed(2)})
${useExtraCoupon ? `Stacked Coupon (${extraCouponPct}%): -${currency.symbol}${couponDiscountAmount.toFixed(2)}\n` : ''}Total Savings: -${currency.symbol}${totalDiscountAmount.toFixed(2)} (${effectiveSavingsPct}%)
Sales Tax (${taxPercent}%): +${currency.symbol}${taxAmount.toFixed(2)}
---------------------------------------
Final Payable Amount: ${currency.symbol}${finalPrice.toFixed(2)}

Calculated on Zubware Discount Calculator`;
    } else {
      report = `🛒 Zubware Shopping Cart Savings Summary
---------------------------------------
Cart Items: ${cartItems.length}
Subtotal: ${currency.symbol}${cartSubtotal.toFixed(2)}
Total Discount Savings: -${currency.symbol}${cartSavings.toFixed(2)}
Sales Tax (${taxPercent}%): +${currency.symbol}${cartTax.toFixed(2)}
---------------------------------------
Final Cart Total: ${currency.symbol}${cartTotal.toFixed(2)}

Calculated on Zubware Discount Calculator`;
    }

    navigator.clipboard.writeText(report);
    setCopied(true);
    onShowToast('Receipt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Tag className="w-5 h-5" />
            </span>
            Shopping Discount & Cart Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate sale prices, stacked coupons, flat discounts, sales taxes, and multi-item shopping carts.
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
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1.5 text-xs font-bold max-w-sm mx-auto">
        <button
          onClick={() => setCalculatorMode('single')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            calculatorMode === 'single' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Single Item
        </button>
        <button
          onClick={() => setCalculatorMode('cart')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            calculatorMode === 'cart' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Shopping Cart ({cartItems.length})
        </button>
      </div>

      {calculatorMode === 'single' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls Column (7 cols) */}
          <div className="md:col-span-7 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
            {/* Original Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Original Price ({currency.symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-extrabold text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Discount Type & Value */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Discount Type</span>
                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
                  <button
                    onClick={() => setDiscountType('percent')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${discountType === 'percent' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                  >
                    % Off
                  </button>
                  <button
                    onClick={() => setDiscountType('flat')}
                    className={`px-2.5 py-1 rounded text-xs font-bold ${discountType === 'flat' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
                  >
                    {currency.symbol} Off
                  </button>
                </div>
              </div>

              {discountType === 'percent' ? (
                <>
                  <div className="grid grid-cols-6 gap-2">
                    {[10, 15, 20, 25, 30, 50].map(pct => (
                      <button
                        key={pct}
                        onClick={() => setDiscountValue(pct)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          discountValue === pct
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-1"
                  />
                </>
              ) : (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={discountValue}
                    onChange={e => setDiscountValue(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                  />
                </div>
              )}
            </div>

            {/* Stacked Coupon */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={useExtraCoupon}
                  onChange={e => setUseExtraCoupon(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Apply Additional Stacked Coupon Code</span>
              </label>

              {useExtraCoupon && (
                <div className="flex items-center gap-2 pl-6">
                  <span className="text-xs text-slate-500 font-medium">Extra Discount:</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={extraCouponPct}
                    onChange={e => setExtraCouponPct(Number(e.target.value))}
                    className="w-20 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center"
                  />
                  <span className="text-xs font-bold text-emerald-600">% OFF</span>
                </div>
              )}
            </div>

            {/* Tax */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sales Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={taxPercent}
                onChange={e => setTaxPercent(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-emerald-500/30 space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[11px] tracking-wider uppercase">
                    Final Price to Pay
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-xs">
                    Save {effectiveSavingsPct}%
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-3">
                  {currency.symbol}{finalPrice.toFixed(2)}
                </div>
                <p className="text-xs text-emerald-300 mt-1 font-semibold">
                  You save {currency.symbol}{totalDiscountAmount.toFixed(2)} in total!
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Original Price:</span>
                  <span className="font-mono line-through">{currency.symbol}{originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Primary Discount:</span>
                  <span className="font-mono">-{currency.symbol}{firstDiscountAmount.toFixed(2)}</span>
                </div>
                {useExtraCoupon && (
                  <div className="flex justify-between text-emerald-300 font-bold">
                    <span>Stacked Coupon ({extraCouponPct}%):</span>
                    <span className="font-mono">-{currency.symbol}{couponDiscountAmount.toFixed(2)}</span>
                  </div>
                )}
                {taxPercent > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Sales Tax ({taxPercent}%):</span>
                    <span className="font-mono">+{currency.symbol}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleCopyReceipt}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Receipt!' : 'Copy Savings Receipt'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Cart Mode */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              Multi-Item Cart Items ({cartItems.length})
            </h3>
            <button
              onClick={handleAddItem}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => {
                      const updated = [...cartItems];
                      updated[index].name = e.target.value;
                      setCartItems(updated);
                    }}
                    className="font-bold text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400 font-bold">{currency.symbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={e => {
                        const updated = [...cartItems];
                        updated[index].price = Math.max(0, Number(e.target.value));
                        setCartItems(updated);
                      }}
                      className="w-20 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs text-center"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-emerald-600 font-bold">Disc:</span>
                    <input
                      type="number"
                      min="0"
                      value={item.discount}
                      onChange={e => {
                        const updated = [...cartItems];
                        updated[index].discount = Math.max(0, Number(e.target.value));
                        setCartItems(updated);
                      }}
                      className="w-16 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-xs text-center"
                    />
                    <select
                      value={item.type}
                      onChange={e => {
                        const updated = [...cartItems];
                        updated[index].type = e.target.value as any;
                        setCartItems(updated);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    >
                      <option value="percent">%</option>
                      <option value="flat">{currency.symbol}</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total Summary Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-500/30 shadow-xl">
            <div>
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                Total Cart Payable (with {taxPercent}% tax)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                {currency.symbol}{cartTotal.toFixed(2)}
              </div>
              <span className="text-xs text-slate-300">
                Subtotal {currency.symbol}{cartSubtotal.toFixed(2)} • Total Savings: -{currency.symbol}{cartSavings.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCopyReceipt}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Receipt!' : 'Copy Cart Breakdown'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
