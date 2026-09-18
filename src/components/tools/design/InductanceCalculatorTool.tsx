import React, { useState } from 'react';
import { Zap, Cpu, Info, Copy, Check } from 'lucide-react';

interface InductanceCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const InductanceCalculatorTool: React.FC<InductanceCalculatorToolProps> = ({ onShowToast }) => {
  const [turns, setTurns] = useState<number>(50);
  const [diameterMm, setDiameterMm] = useState<number>(20); // 20mm diameter
  const [lengthMm, setLengthMm] = useState<number>(40); // 40mm coil length
  const [corePermeability, setCorePermeability] = useState<number>(1); // Air core = 1
  const [copied, setCopied] = useState<boolean>(false);

  // Wheeler's standard continuous single-layer solenoid formula:
  // L (uH) = (d^2 * n^2) / (18d + 40l) where d and l are in inches
  // Convert mm to inches: 1 inch = 25.4 mm
  const dInches = diameterMm / 25.4;
  const lInches = lengthMm / 25.4;

  let inductanceMicroHenries = 0;
  if (dInches > 0 && lInches > 0 && turns > 0) {
    const numerator = Math.pow(dInches, 2) * Math.pow(turns, 2);
    const denominator = 18 * dInches + 40 * lInches;
    inductanceMicroHenries = (numerator / denominator) * corePermeability;
  }

  // Estimated wire length required: N * pi * diameter
  const wireLengthMeters = (turns * Math.PI * (diameterMm / 1000)).toFixed(2);

  const formatInductance = (uH: number) => {
    if (uH >= 1e6) return `${(uH / 1e6).toFixed(3)} H`;
    if (uH >= 1000) return `${(uH / 1000).toFixed(3)} mH`;
    if (uH >= 1) return `${uH.toFixed(2)} µH`;
    return `${(uH * 1000).toFixed(1)} nH`;
  };

  const copyResult = () => {
    const text = formatInductance(inductanceMicroHenries);
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast(`Copied inductance: ${text}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚡</span> Coil Inductance Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate the self-inductance of single-layer air-core and magnetic-core cylindrical coils using Wheeler’s formula.
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Value</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Coil Geometry</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Turns */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Number of Turns (N)
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={turns}
                onChange={e => setTurns(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Coil Diameter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Coil Diameter (mm)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={diameterMm}
                onChange={e => setDiameterMm(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Coil Length */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Coil Length / Height (mm)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={lengthMm}
                onChange={e => setLengthMm(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Core Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Core Material</label>
              <select
                value={corePermeability}
                onChange={e => setCorePermeability(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                <option value={1}>Air / Non-magnetic (µr = 1.0)</option>
                <option value={20}>Iron Powder Core (µr ≈ 20)</option>
                <option value={100}>Ferrite Core (µr ≈ 100)</option>
                <option value={300}>High Permeability Ferrite (µr ≈ 300)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Calculated Inductance (L)
            </span>

            <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {formatInductance(inductanceMicroHenries)}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Microhenrys (µH):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {inductanceMicroHenries.toFixed(2)} µH
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Millihenrys (mH):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {(inductanceMicroHenries / 1000).toFixed(4)} mH
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Estimated Wire Length:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {wireLengthMeters} meters
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
