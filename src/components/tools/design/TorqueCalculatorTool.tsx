import React, { useState } from 'react';
import { RotateCw, Gauge, Zap, Copy, Check, Info } from 'lucide-react';

interface TorqueCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const TorqueCalculatorTool: React.FC<TorqueCalculatorToolProps> = ({ onShowToast }) => {
  const [calcMode, setCalcMode] = useState<'lever' | 'motor'>('lever');
  // Lever mode
  const [force, setForce] = useState<number>(100); // Newtons
  const [forceUnit, setForceUnit] = useState<'N' | 'lbf' | 'kgf'>('N');
  const [radius, setRadius] = useState<number>(0.5); // meters
  const [radiusUnit, setRadiusUnit] = useState<'m' | 'cm' | 'ft' | 'in'>('m');
  const [angleDegrees, setAngleDegrees] = useState<number>(90); // degrees
  // Motor mode
  const [powerKw, setPowerKw] = useState<number>(15); // kW
  const [rpm, setRpm] = useState<number>(1800); // RPM
  const [copied, setCopied] = useState<boolean>(false);

  // Convert to SI (Newtons & Meters):
  let effectiveForceN = force;
  if (forceUnit === 'lbf') effectiveForceN = force * 4.44822;
  if (forceUnit === 'kgf') effectiveForceN = force * 9.80665;

  let effectiveRadiusM = radius;
  if (radiusUnit === 'cm') effectiveRadiusM = radius / 100;
  if (radiusUnit === 'ft') effectiveRadiusM = radius * 0.3048;
  if (radiusUnit === 'in') effectiveRadiusM = radius * 0.0254;

  let torqueNm = 0;

  if (calcMode === 'lever') {
    const angleRad = (angleDegrees * Math.PI) / 180;
    torqueNm = effectiveForceN * effectiveRadiusM * Math.sin(angleRad);
  } else {
    // Motor formula: Torque (Nm) = (Power in kW * 9548.8) / RPM
    torqueNm = rpm > 0 ? (powerKw * 9548.8) / rpm : 0;
  }

  // Unit conversions for Torque:
  // 1 N*m = 0.737562 ft*lb
  // 1 N*m = 8.85074 in*lb
  // 1 N*m = 0.101972 kgf*m
  const ftLb = torqueNm * 0.737562;
  const inLb = torqueNm * 8.85074;
  const kgfM = torqueNm * 0.101972;

  const copyResult = () => {
    const text = `Torque: ${torqueNm.toFixed(2)} N·m (${ftLb.toFixed(2)} ft-lbs)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied torque result!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Torque Calculator (Force × Distance & Motor RPM)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate mechanical rotational torque from lever arm force or electrical motor power (kW & RPM).
          </p>
        </div>
        <button
          onClick={copyResult}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Torque</span>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setCalcMode('lever')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'lever' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Lever Arm (Force × Distance)
        </button>
        <button
          onClick={() => setCalcMode('motor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            calcMode === 'motor' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
          }`}
        >
          Electric Motor (Power & RPM)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-indigo-500" />
            <span>{calcMode === 'lever' ? 'Mechanical Lever Parameters' : 'Motor Specifications'}</span>
          </h3>

          {calcMode === 'lever' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Force */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Force Applied</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={force}
                    onChange={e => setForce(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  />
                  <select
                    value={forceUnit}
                    onChange={e => setForceUnit(e.target.value as any)}
                    className="px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
                  >
                    <option value="N">N</option>
                    <option value="lbf">lbf</option>
                    <option value="kgf">kgf</option>
                  </select>
                </div>
              </div>

              {/* Lever Arm Radius */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lever Arm Length</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={radius}
                    onChange={e => setRadius(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                  />
                  <select
                    value={radiusUnit}
                    onChange={e => setRadiusUnit(e.target.value as any)}
                    className="px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
                  >
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="ft">ft</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>

              {/* Angle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Angle (θ Degrees)</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={angleDegrees}
                  onChange={e => setAngleDegrees(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Motor Power (kW)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={powerKw}
                  onChange={e => setPowerKw(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Rotational Speed (RPM)</label>
                <input
                  type="number"
                  min="1"
                  step="50"
                  value={rpm}
                  onChange={e => setRpm(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Calculated Torque (τ)
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {torqueNm.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-500">N·m (Newton-meters)</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Pound-Feet (ft-lbs):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {ftLb.toFixed(2)} ft·lb
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Inch-Pounds (in-lbs):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {inLb.toFixed(2)} in·lb
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Kilogram-Force Meters:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {kgfM.toFixed(3)} kgf·m
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
