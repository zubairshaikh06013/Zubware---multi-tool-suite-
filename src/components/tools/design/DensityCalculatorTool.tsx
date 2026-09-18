import React, { useState } from 'react';
import { Scale, Box, Info, Copy, Check, Sparkles } from 'lucide-react';

interface DensityCalculatorToolProps {
  onShowToast: (message: string) => void;
}

const COMMON_MATERIALS = [
  { name: 'Water (Pure, 4°C)', densityGPerCm3: 1.0 },
  { name: 'Gold (24k)', densityGPerCm3: 19.32 },
  { name: 'Silver', densityGPerCm3: 10.49 },
  { name: 'Iron / Steel', densityGPerCm3: 7.87 },
  { name: 'Copper', densityGPerCm3: 8.96 },
  { name: 'Aluminum', densityGPerCm3: 2.70 },
  { name: 'Concrete', densityGPerCm3: 2.40 },
  { name: 'Oak Wood (Dry)', densityGPerCm3: 0.75 },
  { name: 'Air (Sea Level)', densityGPerCm3: 0.001225 }
];

export const DensityCalculatorTool: React.FC<DensityCalculatorToolProps> = ({ onShowToast }) => {
  const [calcMode, setCalcMode] = useState<'density' | 'mass' | 'volume'>('density');
  const [mass, setMass] = useState<number>(500); // grams
  const [volume, setVolume] = useState<number>(250); // cm³ / ml
  const [density, setDensity] = useState<number>(2.0); // g/cm³
  const [copied, setCopied] = useState<boolean>(false);

  // Derived values in standard g/cm³
  let calculatedDensity = 0;
  let calculatedMass = 0;
  let calculatedVolume = 0;

  if (calcMode === 'density') {
    calculatedDensity = volume > 0 ? mass / volume : 0;
  } else if (calcMode === 'mass') {
    calculatedMass = density * volume;
  } else {
    calculatedVolume = density > 0 ? mass / density : 0;
  }

  const effectiveDensity = calcMode === 'density' ? calculatedDensity : density;

  // Conversions for density:
  // 1 g/cm³ = 1000 kg/m³ = 62.428 lb/ft³
  const kgPerM3 = effectiveDensity * 1000;
  const lbPerFt3 = effectiveDensity * 62.42796;
  const lbPerGal = effectiveDensity * 8.3454;

  const copyResult = () => {
    let text = '';
    if (calcMode === 'density') text = `Density: ${calculatedDensity.toFixed(4)} g/cm³ (${kgPerM3.toFixed(1)} kg/m³)`;
    else if (calcMode === 'mass') text = `Mass: ${calculatedMass.toFixed(2)} grams`;
    else text = `Volume: ${calculatedVolume.toFixed(2)} cm³`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied calculation result!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚖️</span> Density, Mass & Volume Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate physical density (ρ = m / V), mass, or displacement volume with material reference presets.
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Result</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setCalcMode('density')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'density' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Find Density (ρ)
        </button>
        <button
          onClick={() => setCalcMode('mass')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'mass' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Find Mass (m)
        </button>
        <button
          onClick={() => setCalcMode('volume')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'volume' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Find Volume (V)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-500" />
            <span>Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mass Input */}
            {calcMode !== 'mass' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mass (grams)
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  value={mass}
                  onChange={e => setMass(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>
            )}

            {/* Volume Input */}
            {calcMode !== 'volume' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Volume (cm³ / mL)
                </label>
                <input
                  type="number"
                  min="0.001"
                  step="any"
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>
            )}

            {/* Density Input (if finding mass or volume) */}
            {calcMode !== 'density' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Density (g/cm³)
                </label>
                <input
                  type="number"
                  min="0.0001"
                  step="any"
                  value={density}
                  onChange={e => setDensity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>
            )}
          </div>

          {/* Common Material Presets */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Reference Material Densities:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_MATERIALS.map((mat, idx) => (
                <button
                  key={idx}
                  onClick={() => setDensity(mat.densityGPerCm3)}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-500 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{mat.name}</div>
                  <div className="text-[10px] text-indigo-600 font-mono">{mat.densityGPerCm3} g/cm³</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              {calcMode === 'density' ? 'Calculated Density (ρ)' : calcMode === 'mass' ? 'Calculated Mass (m)' : 'Calculated Volume (V)'}
            </span>

            <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {calcMode === 'density' && `${calculatedDensity.toFixed(3)} g/cm³`}
              {calcMode === 'mass' && `${calculatedMass.toFixed(2)} g`}
              {calcMode === 'volume' && `${calculatedVolume.toFixed(2)} cm³`}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Kilograms per m³ (kg/m³):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {kgPerM3.toFixed(1)} kg/m³
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Pounds per cubic foot (lb/ft³):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {lbPerFt3.toFixed(2)} lb/ft³
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Pounds per US gallon:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {lbPerGal.toFixed(2)} lb/gal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
