import React, { useState } from 'react';
import { Gauge, Fuel, DollarSign, ArrowRight, Check, Copy } from 'lucide-react';

interface MileageCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const MileageCalculatorTool: React.FC<MileageCalculatorToolProps> = ({ onShowToast }) => {
  const [unitSystem, setUnitSystem] = useState<'us' | 'metric'>('us');
  const [distance, setDistance] = useState<number>(350); // miles or km
  const [fuelUsed, setFuelUsed] = useState<number>(11.5); // gallons or liters
  const [fuelPrice, setFuelPrice] = useState<number>(3.65); // $ per gal or liter
  const [irsRate, setIrsRate] = useState<number>(0.67); // standard 2024 IRS rate $0.67/mi
  const [copied, setCopied] = useState<boolean>(false);

  // Conversions & Fuel Economy:
  // US System: distance in miles, fuel in gallons
  let mpgUs = 0;
  let lPer100Km = 0;
  let kmPerL = 0;
  let totalCost = fuelUsed * fuelPrice;
  let costPerUnitDistance = distance > 0 ? totalCost / distance : 0;
  let irsDeduction = unitSystem === 'us' ? distance * irsRate : (distance * 0.621371) * irsRate;

  if (unitSystem === 'us') {
    mpgUs = fuelUsed > 0 ? distance / fuelUsed : 0;
    // 235.214 / MPG = L/100km
    lPer100Km = mpgUs > 0 ? 235.215 / mpgUs : 0;
    kmPerL = mpgUs * 0.425144;
  } else {
    // distance in km, fuel in liters
    kmPerL = fuelUsed > 0 ? distance / fuelUsed : 0;
    lPer100Km = distance > 0 ? (fuelUsed / distance) * 100 : 0;
    mpgUs = lPer100Km > 0 ? 235.215 / lPer100Km : 0;
  }

  const copyResult = () => {
    const text = `Trip Mileage: ${distance} ${unitSystem === 'us' ? 'miles' : 'km'}, Efficiency: ${mpgUs.toFixed(1)} MPG (${lPer100Km.toFixed(1)} L/100km), Total Cost: $${totalCost.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied mileage calculation!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⛽</span> Gas Mileage & Fuel Economy Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate vehicle fuel economy (MPG & L/100km), total fuel trip costs, cost per mile, and tax mileage deductions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setUnitSystem('us')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unitSystem === 'us' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              US (Miles / Gallons)
            </button>
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unitSystem === 'metric' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Metric (Km / Liters)
            </button>
          </div>
          <button
            onClick={copyResult}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-indigo-500" />
            <span>Trip & Fuel Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trip Distance */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Trip Distance ({unitSystem === 'us' ? 'miles' : 'km'})
              </label>
              <input
                type="number"
                min="1"
                step="5"
                value={distance}
                onChange={e => setDistance(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Fuel Used */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fuel Consumed ({unitSystem === 'us' ? 'gallons' : 'liters'})
              </label>
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={fuelUsed}
                onChange={e => setFuelUsed(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Fuel Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fuel Price ($ per {unitSystem === 'us' ? 'gal' : 'liter'})
              </label>
              <input
                type="number"
                min="0.5"
                step="0.05"
                value={fuelPrice}
                onChange={e => setFuelPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Business Mileage Reimbursement */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                IRS Business Mileage Rate ($/mi)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.01"
                value={irsRate}
                onChange={e => setIrsRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Fuel Efficiency
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {mpgUs.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-500">MPG (US)</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Metric Consumption:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {lPer100Km.toFixed(2)} L/100 km
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Fuel Cost:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Fuel Cost per {unitSystem === 'us' ? 'Mile' : 'Km'}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${costPerUnitDistance.toFixed(3)}
                </span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Est. IRS Business Deduction:</span>
                <span className="font-mono text-emerald-600">
                  ${irsDeduction.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
