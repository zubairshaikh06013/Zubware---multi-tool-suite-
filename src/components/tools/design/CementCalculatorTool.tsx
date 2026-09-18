import React, { useState } from 'react';
import { Layers, Box, Info, Sparkles, Check } from 'lucide-react';

interface CementCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const CementCalculatorTool: React.FC<CementCalculatorToolProps> = ({ onShowToast }) => {
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [length, setLength] = useState<number>(20); // ft or m
  const [width, setWidth] = useState<number>(10); // ft or m
  const [thickness, setThickness] = useState<number>(4); // inches or cm
  const [wastage, setWastage] = useState<number>(10); // %
  const [bagType, setBagType] = useState<'80lb' | '60lb' | '50kg'>('80lb');
  const [mixRatio, setMixRatio] = useState<'standard' | 'high' | 'lean'>('standard');

  // Convert to cubic yards (imperial) or cubic meters (metric)
  let volumeCuYards = 0;
  let volumeCuMeters = 0;

  if (unitSystem === 'imperial') {
    // length (ft) * width (ft) * (thickness in / 12) / 27
    const volumeCuFt = length * width * (thickness / 12);
    volumeCuYards = (volumeCuFt / 27) * (1 + wastage / 100);
    volumeCuMeters = volumeCuYards * 0.764555;
  } else {
    // length (m) * width (m) * (thickness cm / 100)
    volumeCuMeters = length * width * (thickness / 100) * (1 + wastage / 100);
    volumeCuYards = volumeCuMeters * 1.30795;
  }

  // Pre-mixed bag yields:
  // 80 lb bag yields approx 0.60 cu ft = 0.0222 cu yd (approx 45 bags per cu yd)
  // 60 lb bag yields approx 0.45 cu ft = 0.0167 cu yd (approx 60 bags per cu yd)
  // 50 kg bag yields approx 0.025 cu m of dry cement (for site mixing) or approx 28 bags per cu m
  let bagsNeeded = 0;
  if (bagType === '80lb') {
    bagsNeeded = Math.ceil(volumeCuYards * 45);
  } else if (bagType === '60lb') {
    bagsNeeded = Math.ceil(volumeCuYards * 60);
  } else {
    // 50 kg
    bagsNeeded = Math.ceil(volumeCuMeters * 28);
  }

  // Site-mix raw material estimates (for Standard 1:2:4 ratio):
  // 1 cu yard of concrete needs approx ~5.5 bags of Portland cement + ~0.5 cu yd sand + ~0.8 cu yd gravel
  const sandCuYds = (volumeCuYards * 0.52).toFixed(1);
  const gravelCuYds = (volumeCuYards * 0.84).toFixed(1);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧱</span> Concrete & Cement Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate exact bags of concrete, cubic yards/meters, sand, and gravel needed for slabs, patios, and footings.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'imperial' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Feet & Inches (Imperial)
          </button>
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'metric' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Meters & Centimeters (Metric)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Box className="w-4 h-4 text-indigo-500" />
            <span>Slab or Pour Dimensions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Length */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Length ({unitSystem === 'imperial' ? 'ft' : 'm'})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Width */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Width ({unitSystem === 'imperial' ? 'ft' : 'm'})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Thickness */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Thickness ({unitSystem === 'imperial' ? 'inches' : 'cm'})
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={thickness}
                onChange={e => setThickness(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Bag Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pre-mix Bag Size</label>
              <select
                value={bagType}
                onChange={e => setBagType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="80lb">80 lb (0.6 cu ft / bag)</option>
                <option value="60lb">60 lb (0.45 cu ft / bag)</option>
                <option value="50kg">50 kg Bag (Standard International)</option>
              </select>
            </div>

            {/* Wastage */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Safety & Spillage Allowance: <span className="text-indigo-600 font-mono">+{wastage}%</span>
              </label>
              <select
                value={wastage}
                onChange={e => setWastage(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
              >
                <option value={5}>+5% (Precise formwork)</option>
                <option value={10}>+10% (Recommended standard)</option>
                <option value={15}>+15% (Rough or uneven ground)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Bags Required */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-slate-500/5 to-transparent space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Estimated Pre-mixed Bags Needed
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {bagsNeeded}
              </span>
              <span className="text-sm font-bold text-slate-500">bags ({bagType})</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Cubic Yards</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {volumeCuYards.toFixed(2)} <span className="text-xs font-normal text-slate-400">yd³</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Cubic Meters</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {volumeCuMeters.toFixed(2)} <span className="text-xs font-normal text-slate-400">m³</span>
                </div>
              </div>
            </div>
          </div>

          {/* Site-Mix Raw Ingredients Card */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Site Mixing Breakdown (1:2:4 Mix)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Sand (Fine Agg.)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">~{sandCuYds} yd³</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Gravel (Coarse)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">~{gravelCuYds} yd³</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
