import React, { useState, useMemo } from 'react';
import {
  Dumbbell,
  Scale,
  Flame,
  Zap,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  Apple,
  ShieldCheck,
  User,
  Activity
} from 'lucide-react';

interface WeightGainCalculatorToolProps {
  onShowToast?: (message: string) => void;
  onNavigate?: (path: string) => void;
}

type Gender = 'male' | 'female';
type ActivityMultiplier = 33 | 35 | 37 | 39;

interface ActivityOption {
  value: ActivityMultiplier;
  label: string;
  sublabel: string;
  description: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    value: 33,
    label: 'Sedentary',
    sublabel: 'Multiplier: 33',
    description: 'Desk job, little to no structured physical exercise'
  },
  {
    value: 35,
    label: 'Lightly Active',
    sublabel: 'Multiplier: 35',
    description: 'Light exercise or sports 1–3 days per week'
  },
  {
    value: 37,
    label: 'Moderately Active',
    sublabel: 'Multiplier: 37',
    description: 'Moderate training or gym workouts 3–5 days per week'
  },
  {
    value: 39,
    label: 'Very Active',
    sublabel: 'Multiplier: 39',
    description: 'Hard training 6–7 days/week or intense physical job'
  }
];

export const WeightGainCalculatorTool: React.FC<WeightGainCalculatorToolProps> = ({
  onShowToast,
  onNavigate
}) => {
  const [weight, setWeight] = useState<string>('65');
  const [gender, setGender] = useState<Gender>('male');
  const [activityMultiplier, setActivityMultiplier] = useState<ActivityMultiplier>(37);
  const [copied, setCopied] = useState<boolean>(false);

  // Validation logic
  const weightNum = parseFloat(weight);
  const isWeightEmpty = weight.trim() === '';
  const isWeightNaN = isNaN(weightNum);
  const isWeightTooLow = !isWeightNaN && weightNum < 30;
  const isWeightTooHigh = !isWeightNaN && weightNum > 200;

  const validationError = useMemo(() => {
    if (isWeightEmpty) {
      return 'Please enter your weight.';
    }
    if (isWeightNaN) {
      return 'Please enter a valid numeric weight.';
    }
    if (isWeightTooLow) {
      return 'Weight must be at least 30 kg.';
    }
    if (isWeightTooHigh) {
      return 'Weight must not exceed 200 kg.';
    }
    return null;
  }, [isWeightEmpty, isWeightNaN, isWeightTooLow, isWeightTooHigh]);

  const isValid = validationError === null;

  // Calculation logic
  const calculation = useMemo(() => {
    if (!isValid || isWeightNaN) {
      return null;
    }

    // Exact formulas
    const calories = Math.round(weightNum * activityMultiplier);
    const protein_g = Math.round(weightNum * 1.9);
    const fat_g = Math.round(weightNum * 0.7);
    const protein_kcal = protein_g * 4;
    const fat_kcal = fat_g * 9;
    
    let raw_carbs_kcal = calories - protein_kcal - fat_kcal;
    let hasNegativeCarbs = false;
    let carbs_kcal = raw_carbs_kcal;
    let carbs_g = Math.round(carbs_kcal / 4);

    if (raw_carbs_kcal < 0) {
      hasNegativeCarbs = true;
      carbs_kcal = 0;
      carbs_g = 0;
    }

    // Percentage breakdown with zero-division safeguard
    const divisor = calories > 0 ? calories : (protein_kcal + fat_kcal + carbs_kcal > 0 ? protein_kcal + fat_kcal + carbs_kcal : 1);
    const protein_pct = Math.round((protein_kcal / divisor) * 100);
    const fat_pct = Math.round((fat_kcal / divisor) * 100);
    const carbs_pct = hasNegativeCarbs ? 0 : Math.max(0, 100 - protein_pct - fat_pct);

    return {
      calories,
      protein_g,
      fat_g,
      carbs_g,
      protein_kcal,
      fat_kcal,
      carbs_kcal,
      protein_pct,
      fat_pct,
      carbs_pct,
      hasNegativeCarbs
    };
  }, [isValid, isWeightNaN, weightNum, activityMultiplier]);

  // Copy to clipboard handler
  const handleCopyResults = async () => {
    if (!calculation) return;

    const copyText = `Daily Target: ${calculation.calories} kcal\nProtein: ${calculation.protein_g}g | Fat: ${calculation.fat_g}g | Carbs: ${calculation.carbs_g}g`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = copyText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      if (onShowToast) {
        onShowToast('Macro targets copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (onShowToast) {
        onShowToast('Could not copy automatically. Please select text manually.');
      }
    }
  };

  // Reset to default
  const handleReset = () => {
    setWeight('65');
    setGender('male');
    setActivityMultiplier(37);
    setCopied(false);
    if (onShowToast) {
      onShowToast('Calculator reset to default settings.');
    }
  };

  return (
    <div id="weight-gain-calculator-app" className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Health & Fitness Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>💪</span> Weight Gain Calorie & Macro Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl">
            Calculate your personalized daily caloric surplus and optimal protein, fat, and carb targets for steady lean muscle & weight gain.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="reset-calculator-btn"
            onClick={handleReset}
            type="button"
            className="px-3.5 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset all inputs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Controls (5 Cols on large) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-6 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3">
              <Scale className="w-4 h-4 text-indigo-500" />
              <span>Your Body Metrics</span>
            </h3>

            {/* Weight Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="weight-input" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Weight (kg) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Range: 30 – 200 kg
                </span>
              </div>
              <div className="relative">
                <input
                  id="weight-input"
                  type="number"
                  min="30"
                  max="200"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 65"
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                    validationError
                      ? 'border-rose-300 dark:border-rose-800 focus:ring-rose-500/30'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-indigo-500/30 focus:border-indigo-500'
                  }`}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-bold text-slate-400">
                  kg
                </div>
              </div>

              {/* Quick Weight Steppers */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {[50, 55, 60, 65, 70, 75, 80, 85].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWeight(preset.toString())}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      weight === preset.toString()
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset} kg
                  </button>
                ))}
              </div>

              {validationError && (
                <p className="text-xs font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1.5 mt-1.5 animate-fadeIn">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>

            {/* Gender Toggle */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Gender Profile</span>
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60">
                <button
                  id="gender-male-btn"
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    gender === 'male'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>👨 Male</span>
                </button>
                <button
                  id="gender-female-btn"
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    gender === 'female'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>👩 Female</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Used for profile context. Bulking macros follow standardized sports nutrition science.
              </p>
            </div>

            {/* Activity Level Selector */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Activity & Workout Level</span>
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Multiplier: {activityMultiplier}
                </span>
              </label>

              <div className="space-y-2">
                {ACTIVITY_OPTIONS.map((opt) => {
                  const isSelected = activityMultiplier === opt.value;
                  return (
                    <button
                      key={opt.value}
                      id={`activity-${opt.value}-btn`}
                      type="button"
                      onClick={() => setActivityMultiplier(opt.value)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500/80 text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-500/30'
                          : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {opt.label}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            ×{opt.value}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Results (7 Cols on large) */}
        <div className="lg:col-span-7 space-y-6">
          {calculation ? (
            <div className="space-y-6">
              {/* Highlight Target Calories Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-500/30 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5" />
                      Daily Caloric Target
                    </span>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span
                        id="target-calories-value"
                        className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
                      >
                        {calculation.calories.toLocaleString()}
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        kcal / day
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                      Calculated as {weightNum} kg × {activityMultiplier} activity multiplier for steady weight surplus.
                    </p>
                  </div>

                  <button
                    id="copy-results-btn"
                    type="button"
                    onClick={handleCopyResults}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-md cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Results</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Macro Stacked Progress Bar */}
                <div className="mt-6 pt-6 border-t border-indigo-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Macro Calorie Split</span>
                    <span className="text-[11px] text-slate-500">
                      Protein {calculation.protein_pct}% • Fat {calculation.fat_pct}% • Carbs {calculation.carbs_pct}%
                    </span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
                    <div
                      style={{ width: `${calculation.protein_pct}%` }}
                      className="h-full bg-indigo-500 rounded-l-full transition-all duration-500"
                      title={`Protein: ${calculation.protein_pct}%`}
                    />
                    <div
                      style={{ width: `${calculation.fat_pct}%` }}
                      className="h-full bg-amber-500 transition-all duration-500"
                      title={`Fat: ${calculation.fat_pct}%`}
                    />
                    <div
                      style={{ width: `${calculation.carbs_pct}%` }}
                      className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                      title={`Carbs: ${calculation.carbs_pct}%`}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Macro Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Protein Card */}
                <div
                  id="protein-result-card"
                  className="glass-card p-5 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5" />
                      Protein
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                      1.9g / kg
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {calculation.protein_g}
                    </span>
                    <span className="text-sm font-bold text-slate-500">grams</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-indigo-500/20">
                    <span>{calculation.protein_kcal} kcal</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {calculation.protein_pct}% of total
                    </span>
                  </div>
                </div>

                {/* Fat Card */}
                <div
                  id="fat-result-card"
                  className="glass-card p-5 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Fats
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      0.7g / kg
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {calculation.fat_g}
                    </span>
                    <span className="text-sm font-bold text-slate-500">grams</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-amber-500/20">
                    <span>{calculation.fat_kcal} kcal</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {calculation.fat_pct}% of total
                    </span>
                  </div>
                </div>

                {/* Carbs Card */}
                <div
                  id="carbs-result-card"
                  className="glass-card p-5 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Apple className="w-3.5 h-3.5" />
                      Carbohydrates
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      Remaining
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {calculation.carbs_g}
                    </span>
                    <span className="text-sm font-bold text-slate-500">grams</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-emerald-500/20">
                    <span>{calculation.carbs_kcal} kcal</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {calculation.carbs_pct}% of total
                    </span>
                  </div>
                </div>
              </div>

              {/* Negative Carbs Warning if any */}
              {calculation.hasNegativeCarbs && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <strong className="font-bold block">Unusual Input Warning</strong>
                    Protein and fat energy requirements exceed the total calculated calorie target for this weight. Carbohydrates have been defaulted to 0g. Please double-check your entered body weight and activity level.
                  </div>
                </div>
              )}

              {/* Quick Bulking Nutrition Advice & Actionable Tips */}
              <div className="glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>How to Hit Your Bulking Targets</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <strong className="font-bold text-slate-900 dark:text-white block mb-1">
                      🥩 Protein Timing
                    </strong>
                    Distribute your {calculation.protein_g}g across 4–5 balanced meals (~25–35g per meal) to maximize muscle protein synthesis throughout the day.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <strong className="font-bold text-slate-900 dark:text-white block mb-1">
                      🍚 Complex Carbs
                    </strong>
                    Focus on clean, energy-dense carbs like oats, brown/white rice, potatoes, pasta, and bananas to power intense progressive overload training.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <strong className="font-bold text-slate-900 dark:text-white block mb-1">
                      🥑 Healthy Fats
                    </strong>
                    Incorporate {calculation.fat_g}g of fats from eggs, nuts, olive oil, avocados, and seeds to support optimal hormone production during your bulk.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                    <strong className="font-bold text-slate-900 dark:text-white block mb-1">
                      ⚖️ Progress Tracking
                    </strong>
                    Weigh yourself weekly under consistent conditions. Aim for 0.25 to 0.5 kg gain per week to keep muscle gain high and fat accumulation minimal.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Enter Your Weight to View Bulking Macros
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Provide a valid weight between 30 kg and 200 kg on the left panel to calculate your personalized daily calorie and macronutrient breakdown.
              </p>
            </div>
          )}

          {/* Mandatory Disclaimer Note */}
          <div
            id="medical-disclaimer"
            className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-xs flex items-start gap-2.5"
          >
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">Disclaimer: </strong>
              This is a general guideline based on standard bulking formulas, not medical advice. Consult a nutritionist for personalized plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
