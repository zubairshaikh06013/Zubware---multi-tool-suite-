import React, { useState } from 'react';
import { Droplet, Activity, Sun, ShieldAlert, Check, Clock, Plus, Minus, Coffee, Sparkles, Copy } from 'lucide-react';

interface WaterIntakeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const WaterIntakeCalculatorTool: React.FC<WaterIntakeCalculatorToolProps> = ({ onShowToast }) => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(45);
  const [climate, setClimate] = useState<'moderate' | 'hot' | 'very_hot'>('moderate');
  const [pregnantOrNursing, setPregnantOrNursing] = useState<'none' | 'pregnant' | 'nursing'>('none');
  const [caffeineCups, setCaffeineCups] = useState<number>(2);
  const [glassesDrunk, setGlassesDrunk] = useState<number>(3);
  const [copied, setCopied] = useState<boolean>(false);

  const effectiveWeightKg = unitSystem === 'metric' ? weightKg : weightLbs * 0.453592;

  // Baseline: 35ml per kg of body weight
  let totalMl = effectiveWeightKg * 35;

  // Exercise factor: ~350ml per 30 mins
  totalMl += (exerciseMinutes / 30) * 350;

  // Climate factor:
  if (climate === 'hot') totalMl += 400;
  if (climate === 'very_hot') totalMl += 800;

  // Pregnancy / Nursing:
  if (pregnantOrNursing === 'pregnant') totalMl += 300;
  if (pregnantOrNursing === 'nursing') totalMl += 700;

  // Caffeine diuretic compensation: ~150ml per cup of coffee/tea
  totalMl += caffeineCups * 150;

  const totalLiters = (totalMl / 1000).toFixed(2);
  const totalOz = Math.round(totalMl * 0.033814);
  const targetGlasses = Math.max(1, Math.round(totalMl / 250)); // 250ml per glass
  const progressPct = Math.min(100, Math.round((glassesDrunk / targetGlasses) * 100));

  const schedule = [
    { time: '07:30 AM', label: 'Morning Wakeup', ml: 400, desc: 'Rehydrate metabolism immediately upon waking' },
    { time: '10:00 AM', label: 'Mid-Morning Focus', ml: 350, desc: 'Sip steadily during deep work' },
    { time: '12:30 PM', label: 'Pre-Lunch Hydration', ml: 350, desc: 'Drink 30 mins before eating for digestion' },
    { time: '03:30 PM', label: 'Afternoon Energy Recharge', ml: 400, desc: 'Combats afternoon cognitive fatigue' },
    { time: '05:30 PM', label: 'Workout Session', ml: 500, desc: 'Pre- and post-exercise sweat replenishment' },
    { time: '07:30 PM', label: 'Evening Dinner', ml: 300, desc: 'Light hydration with dinner' },
    { time: '09:30 PM', label: 'Pre-Sleep Sip', ml: 200, desc: 'Light sip before bed to avoid night waking' }
  ];

  const handleCopyPlan = () => {
    const text = `💧 My Personalized Daily Hydration Plan
---------------------------------------
Daily Target: ${totalLiters} Liters (${totalOz} fl oz) • ~${targetGlasses} glasses (250ml)
Based on: ${effectiveWeightKg.toFixed(0)} kg weight • ${exerciseMinutes} mins workout • ${climate} climate

Daily Schedule:
${schedule.map(s => `• ${s.time} - ${s.label}: ${s.ml}ml (${s.desc})`).join('\n')}

Generated on Zubware Hydration Calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Hydration plan copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Droplet className="w-5 h-5" />
            </span>
            Daily Water Intake & Hydration Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Calculate your scientific water requirements and schedule hourly hydration reminders throughout the day.
          </p>
        </div>

        {/* Unit Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'metric' ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Metric (kg, L)
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              unitSystem === 'imperial' ? 'bg-white dark:bg-slate-900 text-cyan-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Imperial (lbs, oz)
          </button>
        </div>
      </div>

      {/* Main Hydration Target Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden border border-cyan-500/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[11px] tracking-wider uppercase">
              Target Daily Water Intake
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
              <span>{unitSystem === 'metric' ? `${totalLiters} L` : `${totalOz} fl oz`}</span>
              <span className="text-base text-cyan-300 font-bold">
                (~{targetGlasses} glasses)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-200/80">
              Personalized for {effectiveWeightKg.toFixed(0)}kg body mass + {exerciseMinutes}m daily workout sweat loss
            </p>
          </div>

          {/* Quick Copy Plan */}
          <button
            onClick={handleCopyPlan}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm shrink-0 self-start sm:self-center"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Plan!' : 'Copy Daily Plan'}</span>
          </button>
        </div>

        {/* Live Daily Tracker Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-200">
              Today's Water Log: {glassesDrunk} of {targetGlasses} glasses drunk ({progressPct}%)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGlassesDrunk(Math.max(0, glassesDrunk - 1))}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors"
                title="Remove 1 glass"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGlassesDrunk(glassesDrunk + 1)}
                className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold flex items-center gap-1 transition-colors shadow"
                title="Add 1 glass (250ml)"
              >
                <Plus className="w-3.5 h-3.5" /> Drink Glass
              </button>
            </div>
          </div>

          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inputs & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Inputs (6 cols) */}
        <div className="md:col-span-6 glass-card p-6 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            Body & Lifestyle Factors
          </h3>

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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white"
              />
            ) : (
              <input
                type="number"
                min="65"
                max="550"
                value={weightLbs}
                onChange={e => setWeightLbs(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white"
              />
            )}
          </div>

          {/* Exercise Minutes */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Daily Exercise / Workout</span>
              <span className="text-cyan-600 font-bold">{exerciseMinutes} mins/day</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="15"
              value={exerciseMinutes}
              onChange={e => setExerciseMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          {/* Climate */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Local Climate / Temperature</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'moderate', label: 'Moderate' },
                { id: 'hot', label: 'Warm (+400ml)' },
                { id: 'very_hot', label: 'Hot (+800ml)' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setClimate(c.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    climate === c.id ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Caffeine Intake */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-600" /> Daily Coffee / Tea Cups
              </span>
              <span className="text-amber-600 font-bold">{caffeineCups} Cups (+{caffeineCups * 150}ml)</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={caffeineCups}
              onChange={e => setCaffeineCups(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[10px] text-slate-400">Mild diuretic compensation to preserve cellular hydration</span>
          </div>
        </div>

        {/* Right Recommended Hourly Schedule (6 cols) */}
        <div className="md:col-span-6 glass-card p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-500" />
            Recommended Daily Drinking Schedule
          </h3>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{item.time}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.desc}</span>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold font-mono text-xs shrink-0">
                  {item.ml} ml
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
