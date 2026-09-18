import React, { useState } from 'react';
import { Droplet, Activity, Sun, ShieldAlert, Check, Clock } from 'lucide-react';

interface WaterIntakeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const WaterIntakeCalculatorTool: React.FC<WaterIntakeCalculatorToolProps> = ({ onShowToast }) => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(30);
  const [climate, setClimate] = useState<'moderate' | 'hot' | 'very_hot'>('moderate');
  const [pregnantOrNursing, setPregnantOrNursing] = useState<'none' | 'pregnant' | 'nursing'>('none');

  const effectiveWeightKg = unitSystem === 'metric' ? weightKg : weightLbs * 0.453592;

  // Baseline: 35ml per kg of body weight
  let totalMl = effectiveWeightKg * 35;

  // Exercise factor: ~350ml per 30 mins of sweat/exercise
  totalMl += (exerciseMinutes / 30) * 350;

  // Climate factor:
  if (climate === 'hot') totalMl += 400;
  if (climate === 'very_hot') totalMl += 800;

  // Pregnancy / Nursing:
  if (pregnantOrNursing === 'pregnant') totalMl += 300;
  if (pregnantOrNursing === 'nursing') totalMl += 700;

  const totalLiters = (totalMl / 1000).toFixed(2);
  const totalOz = Math.round(totalMl * 0.033814);
  const glasses = Math.round(totalMl / 250); // 250ml per glass

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>💧</span> Daily Water Intake Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate your personalized daily hydration requirement based on body weight, workout intensity, and climate conditions.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'metric' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Metric (kg, ml)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'imperial' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Imperial (lbs, oz)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Droplet className="w-4 h-4 text-cyan-500" />
            <span>Hydration Factors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weight */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Body Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              {unitSystem === 'metric' ? (
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              ) : (
                <input
                  type="number"
                  min="60"
                  max="550"
                  value={weightLbs}
                  onChange={e => setWeightLbs(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              )}
            </div>

            {/* Exercise Minutes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Daily Workout / Exercise (Minutes)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                step="15"
                value={exerciseMinutes}
                onChange={e => setExerciseMinutes(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Climate */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Climate Environment</label>
              <select
                value={climate}
                onChange={e => setClimate(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
              >
                <option value="moderate">Moderate / Temperate Climate</option>
                <option value="hot">Hot Weather / Summer</option>
                <option value="very_hot">Very Hot / Arid or Tropical Humid</option>
              </select>
            </div>

            {/* Pregnancy / Nursing */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Special Conditions</label>
              <select
                value={pregnantOrNursing}
                onChange={e => setPregnantOrNursing(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-xs"
              >
                <option value="none">Standard Adult</option>
                <option value="pregnant">Pregnant (+300 ml)</option>
                <option value="nursing">Breastfeeding / Nursing (+700 ml)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Hydration Target Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 block">
              Recommended Daily Water Intake
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {totalLiters}
              </span>
              <span className="text-sm font-bold text-slate-500">Liters / day</span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Ounces (fl oz)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-lg">
                  ~{totalOz} oz
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Standard Glasses (250ml)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-lg">
                  ~{glasses} glasses
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Guidance */}
          <div className="glass-card p-5 rounded-3xl space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Paced Hydration Tip:</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Drinking 1 glass of water (~250ml) every 90 minutes while awake comfortably satisfies your daily quota without overwhelming your kidneys.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-2.5 items-start text-xs text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-500 mt-0.5" />
            <p>
              Calculations are estimates. Individuals with kidney disease, heart conditions, or fluid restrictions must follow their physician&apos;s recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
