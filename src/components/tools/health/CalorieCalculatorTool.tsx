import React, { useState } from 'react';
import { Flame, Activity, Scale, ShieldAlert, Sparkles, User, Info, ArrowRight } from 'lucide-react';

interface CalorieCalculatorToolProps {
  onShowToast: (message: string) => void;
  onNavigate?: (path: string) => void;
}

export const CalorieCalculatorTool: React.FC<CalorieCalculatorToolProps> = ({ onShowToast }) => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [activity, setActivity] = useState<number>(1.375); // Light exercise
  const [goal, setGoal] = useState<'maintain' | 'mild_loss' | 'loss' | 'extreme_loss' | 'mild_gain' | 'gain'>('maintain');

  // Unified metric values
  const effectiveWeightKg = unitSystem === 'metric' ? weightKg : weightLbs * 0.453592;
  const effectiveHeightCm = unitSystem === 'metric' ? heightCm : (heightFeet * 12 + heightInches) * 2.54;

  // Mifflin-St Jeor Equation for Basal Metabolic Rate (BMR)
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const bmr = Math.round(
    gender === 'male'
      ? 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age + 5
      : 10 * effectiveWeightKg + 6.25 * effectiveHeightCm - 5 * age - 161
  );

  // Total Daily Energy Expenditure (TDEE)
  const tdee = Math.round(bmr * activity);

  // Goal adjustment
  const goalOffsets = {
    maintain: 0,
    mild_loss: -250,
    loss: -500,
    extreme_loss: -1000,
    mild_gain: 250,
    gain: 500
  };

  const targetCalories = Math.max(1200, tdee + goalOffsets[goal]);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔥</span> Calorie Calculator (TDEE & BMR)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor formula.
          </p>
        </div>
        {/* Metric / Imperial toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'metric' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Metric (kg, cm)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'imperial' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Imperial (lbs, ft)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <span>Body & Activity Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sex / Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    gender === 'male'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    gender === 'female'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Age (years)</label>
              <input
                type="number"
                min="12"
                max="100"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            {/* Weight */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              {unitSystem === 'metric' ? (
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              ) : (
                <input
                  type="number"
                  min="60"
                  max="500"
                  value={weightLbs}
                  onChange={e => setWeightLbs(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                />
              )}
            </div>

            {/* Height */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Height</label>
              {unitSystem === 'metric' ? (
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={e => setHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                  placeholder="Height in cm"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="3"
                    max="7"
                    value={heightFeet}
                    onChange={e => setHeightFeet(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
                    placeholder="Feet"
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={heightInches}
                    onChange={e => setHeightInches(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm"
                    placeholder="Inches"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daily Activity Level</label>
            <select
              value={activity}
              onChange={e => setActivity(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200"
            >
              <option value={1.2}>Sedentary (Little or no exercise, desk job)</option>
              <option value={1.375}>Lightly Active (Light exercise 1–3 days/week)</option>
              <option value={1.55}>Moderately Active (Moderate exercise 3–5 days/week)</option>
              <option value={1.725}>Very Active (Hard exercise 6–7 days/week)</option>
              <option value={1.9}>Extra Active (Very hard exercise, physical job or training 2x/day)</option>
            </select>
          </div>

          {/* Goal Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Primary Goal</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'maintain', label: 'Maintain Weight' },
                { id: 'mild_loss', label: 'Mild Loss (-0.25 kg/wk)' },
                { id: 'loss', label: 'Standard Loss (-0.5 kg/wk)' },
                { id: 'extreme_loss', label: 'Fast Loss (-1 kg/wk)' },
                { id: 'mild_gain', label: 'Mild Gain (+0.25 kg/wk)' },
                { id: 'gain', label: 'Muscle Bulking (+0.5 kg/wk)' }
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                    goal === g.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Hero Card */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-rose-500/10 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Estimated Daily Calorie Target
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {targetCalories.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-500">kcal / day</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Based on your goal, this daily energy intake will support your current fitness objective.
            </p>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Basal Metabolic Rate (BMR)</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {bmr.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Maintenance (TDEE)</span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {tdee.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Macro Breakdown Estimates */}
          <div className="glass-card p-5 rounded-3xl space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Recommended Macronutrient Split (40/30/30)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Protein</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  {Math.round((targetCalories * 0.3) / 4)}g
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">Fats</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  {Math.round((targetCalories * 0.3) / 9)}g
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">Carbs</span>
                <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                  {Math.round((targetCalories * 0.4) / 4)}g
                </span>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start text-xs text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
            <div>
              <span className="font-bold block">Medical & Dietary Disclaimer:</span>
              Calculations are scientific estimates based on the Mifflin-St Jeor equation and do not constitute medical or nutritional advice. Consult a doctor or registered dietitian before beginning any calorie-restricted diet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
