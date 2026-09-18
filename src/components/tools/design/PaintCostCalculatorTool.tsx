import React, { useState } from 'react';
import { Paintbrush, DollarSign, Box, ShieldCheck, Copy, Check } from 'lucide-react';

interface PaintCostCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const PaintCostCalculatorTool: React.FC<PaintCostCalculatorToolProps> = ({ onShowToast }) => {
  const [roomLength, setRoomLength] = useState<number>(14); // ft
  const [roomWidth, setRoomWidth] = useState<number>(12); // ft
  const [wallHeight, setWallHeight] = useState<number>(9); // ft
  const [doors, setDoors] = useState<number>(2); // 21 sq ft each
  const [windows, setWindows] = useState<number>(2); // 15 sq ft each
  const [coats, setCoats] = useState<number>(2);
  const [pricePerGallon, setPricePerGallon] = useState<number>(45);
  const [includePrimer, setIncludePrimer] = useState<boolean>(true);
  const [includeLabor, setIncludeLabor] = useState<boolean>(false);
  const [laborCostPerSqFt, setLaborCostPerSqFt] = useState<number>(1.5);
  const [copied, setCopied] = useState<boolean>(false);

  // Surface area calculation:
  // Perimeter = 2 * (L + W)
  // Wall gross area = Perimeter * Height
  const perimeter = 2 * (roomLength + roomWidth);
  const grossWallArea = perimeter * wallHeight;

  // Deduct doors and windows
  const deductions = doors * 21 + windows * 15;
  const netWallArea = Math.max(0, grossWallArea - deductions);

  // Total paintable area for all coats
  const totalCoatedArea = netWallArea * coats;

  // 1 gallon covers approx 350 sq ft
  const COVERAGE_PER_GALLON = 350;
  const gallonsNeeded = Math.ceil(totalCoatedArea / COVERAGE_PER_GALLON);
  const primerGallonsNeeded = includePrimer ? Math.ceil(netWallArea / COVERAGE_PER_GALLON) : 0;

  // Costs
  const paintCost = gallonsNeeded * pricePerGallon;
  const primerCost = primerGallonsNeeded * 25; // ~$25/gal primer
  const laborCost = includeLabor ? netWallArea * laborCostPerSqFt : 0;
  const totalProjectCost = paintCost + primerCost + laborCost;

  const copyEstimate = () => {
    const text = `Painting Estimate: ${netWallArea.toFixed(0)} sq ft (${coats} coats), ${gallonsNeeded} gallons paint. Total Est Cost: $${totalProjectCost.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied painting estimate!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎨</span> Paint & Labor Cost Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate paint gallons, surface coverage area, primer, and contractor labor costs for interior rooms.
          </p>
        </div>
        <button
          onClick={copyEstimate}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Estimate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Box className="w-4 h-4 text-indigo-500" />
            <span>Room Dimensions & Openings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Length (ft)</label>
              <input
                type="number"
                min="1"
                value={roomLength}
                onChange={e => setRoomLength(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Width (ft)</label>
              <input
                type="number"
                min="1"
                value={roomWidth}
                onChange={e => setRoomWidth(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Ceiling Height (ft)</label>
              <input
                type="number"
                min="6"
                max="25"
                value={wallHeight}
                onChange={e => setWallHeight(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Doors Count</label>
              <input
                type="number"
                min="0"
                value={doors}
                onChange={e => setDoors(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Windows Count</label>
              <input
                type="number"
                min="0"
                value={windows}
                onChange={e => setWindows(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Coats of Paint</label>
              <select
                value={coats}
                onChange={e => setCoats(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                <option value={1}>1 Coat (Touchup / Refresh)</option>
                <option value={2}>2 Coats (Standard)</option>
                <option value={3}>3 Coats (Dark to Light change)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paint Price ($ / Gallon)</label>
              <input
                type="number"
                min="10"
                step="5"
                value={pricePerGallon}
                onChange={e => setPricePerGallon(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="flex flex-col justify-center space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includePrimer}
                  onChange={e => setIncludePrimer(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span>Include 1 Coat Primer (~$25/gal)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeLabor}
                  onChange={e => setIncludeLabor(e.target.checked)}
                  className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
                />
                <span>Include Pro Painter Labor ($1.50/sq ft)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Estimated Paint Required
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {gallonsNeeded}
              </span>
              <span className="text-sm font-bold text-slate-500">gallons ({coats} coats)</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Net Wall Surface Area:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {netWallArea.toFixed(0)} sq ft
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Paint Material Cost:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ${paintCost.toFixed(2)}
                </span>
              </div>
              {includePrimer && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Primer ({primerGallonsNeeded} gal):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${primerCost.toFixed(2)}
                  </span>
                </div>
              )}
              {includeLabor && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Contractor Labor:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${laborCost.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                <span>Total Estimated Project Budget:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-base">
                  ${totalProjectCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
