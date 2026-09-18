import React, { useState } from 'react';
import { Heart, Sparkles, Award, ShieldAlert, Calendar, Check, Info } from 'lucide-react';

interface CatAgeCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const CatAgeCalculatorTool: React.FC<CatAgeCalculatorToolProps> = ({ onShowToast }) => {
  const [catYears, setCatYears] = useState<number>(4);
  const [catMonths, setCatMonths] = useState<number>(0);

  // Standard American Association of Feline Practitioners (AAFP) guideline:
  // Month 1: ~1 human year
  // Month 3: ~4 human years
  // Month 6: ~10 human years
  // Year 1: 15 human years
  // Year 2: 24 human years (adds 9)
  // Year 3+: adds 4 human years per calendar year
  const totalCatYears = catYears + catMonths / 12;

  let humanAge = 0;
  if (totalCatYears <= 1) {
    humanAge = Math.round(totalCatYears * 15);
  } else if (totalCatYears <= 2) {
    humanAge = Math.round(15 + (totalCatYears - 1) * 9);
  } else {
    humanAge = Math.round(24 + (totalCatYears - 2) * 4);
  }

  // Life stage
  let stage = 'Prime Adult';
  let stageDescription = 'Cat is in the prime of life, fully mature physically and socially.';
  let checkupFreq = 'Annual wellness examination';

  if (totalCatYears < 0.5) {
    stage = 'Kitten (0–6 months)';
    stageDescription = 'Rapid physical and behavioral growth. High energy and curiosity.';
    checkupFreq = 'Monthly booster vaccines & deworming';
  } else if (totalCatYears <= 2) {
    stage = 'Junior (7 months – 2 years)';
    stageDescription = 'Cat reaches full adult size, sexual maturity, and explores social hierarchy.';
    checkupFreq = 'Annual wellness check & core vaccine boosters';
  } else if (totalCatYears <= 6) {
    stage = 'Prime Adult (3–6 years)';
    stageDescription = 'Peak health, active and stable temperament.';
    checkupFreq = 'Annual wellness exam & routine dental hygiene';
  } else if (totalCatYears <= 10) {
    stage = 'Mature Adult (7–10 years)';
    stageDescription = 'Equivalent to humans in their 40s and 50s. Slight slowdown in activity.';
    checkupFreq = 'Annual wellness exam with early screening for kidney & metabolic health';
  } else if (totalCatYears <= 14) {
    stage = 'Senior (11–14 years)';
    stageDescription = 'Equivalent to human retirement age. Needs comfortable, low-stress environments.';
    checkupFreq = 'Bi-annual (twice yearly) senior veterinary checkups & bloodwork';
  } else {
    stage = 'Geriatric (15+ years)';
    stageDescription = 'Super-senior cat. Needs tailored mobility support, joint care, and quiet comfort.';
    checkupFreq = 'Bi-annual senior care visits and routine kidney monitoring';
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🐱</span> Cat Age in Human Years Calculator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert feline calendar years into human age equivalents using the American Association of Feline Practitioners (AAFP) guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input */}
        <div className="lg:col-span-6 glass-card p-6 sm:p-7 rounded-3xl space-y-6">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Feline Calendar Age</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Years ({catYears} yrs)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={catYears}
                onChange={e => setCatYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Months ({catMonths} mos)
              </label>
              <input
                type="number"
                min="0"
                max="11"
                value={catMonths}
                onChange={e => setCatMonths(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Age Presets</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '3 Months Kitten', y: 0, m: 3 },
                { label: '1 Year Old', y: 1, m: 0 },
                { label: '2 Years Old', y: 2, m: 0 },
                { label: '5 Years (Adult)', y: 5, m: 0 },
                { label: '10 Years (Mature)', y: 10, m: 0 },
                { label: '15 Years (Senior)', y: 15, m: 0 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCatYears(p.y);
                    setCatMonths(p.m);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 block">
              Equivalent Human Age
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {humanAge}
              </span>
              <span className="text-sm font-bold text-slate-500">human years</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
              {stage}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Developmental Stage</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">{stageDescription}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">Veterinary Recommendation</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{checkupFreq}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
