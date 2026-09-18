import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Award, Copy, Check, Info } from 'lucide-react';

interface SemesterRecord {
  id: string;
  name: string;
  gpa: number;
  credits: number;
}

interface CgpaCalculatorToolProps {
  onShowToast: (message: string) => void;
}

export const CgpaCalculatorTool: React.FC<CgpaCalculatorToolProps> = ({ onShowToast }) => {
  const [scale, setScale] = useState<'4.0' | '10.0'>('10.0');
  const [semesters, setSemesters] = useState<SemesterRecord[]>([
    { id: '1', name: 'Semester 1', gpa: 8.5, credits: 22 },
    { id: '2', name: 'Semester 2', gpa: 8.8, credits: 24 },
    { id: '3', name: 'Semester 3', gpa: 9.1, credits: 20 },
    { id: '4', name: 'Semester 4', gpa: 8.4, credits: 22 }
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const addSemester = () => {
    const nextNum = semesters.length + 1;
    setSemesters([
      ...semesters,
      {
        id: String(Date.now()),
        name: `Semester ${nextNum}`,
        gpa: scale === '10.0' ? 8.0 : 3.5,
        credits: 20
      }
    ]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter(s => s.id !== id));
  };

  const updateSemester = (id: string, field: keyof SemesterRecord, value: any) => {
    setSemesters(
      semesters.map(s => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  // Cumulative GPA = sum(gpa * credits) / sum(credits)
  const totalCredits = semesters.reduce((acc, s) => acc + (s.credits || 0), 0);
  const totalWeightedPoints = semesters.reduce((acc, s) => acc + (s.gpa || 0) * (s.credits || 0), 0);
  const cgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;

  // Percentage conversion:
  // For 10.0 scale: CBSE / standard university formula is CGPA * 9.5
  // For 4.0 scale: (CGPA / 4.0) * 100
  const percentage = scale === '10.0' ? cgpa * 9.5 : (cgpa / 4.0) * 100;

  // Honors
  let honors = 'Pass';
  if (scale === '10.0') {
    if (cgpa >= 9.0) honors = 'First Class with Distinction (Honours)';
    else if (cgpa >= 7.5) honors = 'First Class (Distinction)';
    else if (cgpa >= 6.5) honors = 'Second Class (Upper Division)';
    else if (cgpa >= 5.0) honors = 'Second Class (Lower Division)';
  } else {
    if (cgpa >= 3.8) honors = 'Summa Cum Laude (Highest Honors)';
    else if (cgpa >= 3.6) honors = 'Magna Cum Laude (High Honors)';
    else if (cgpa >= 3.4) honors = 'Cum Laude (Honors)';
    else if (cgpa >= 3.0) honors = 'Dean’s List Standing';
  }

  const copyResult = () => {
    const text = `Cumulative CGPA: ${cgpa.toFixed(2)} / ${scale} (${percentage.toFixed(1)}% - ${honors})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied CGPA calculation!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎓</span> CGPA Calculator (Cumulative Grade Point Average)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculate your cumulative CGPA, overall percentage conversion, and degree honors across college semesters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setScale('10.0')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scale === '10.0' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              10.0 Scale
            </button>
            <button
              onClick={() => setScale('4.0')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scale === '4.0' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              4.0 Scale
            </button>
          </div>
          <button
            onClick={copyResult}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy CGPA</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Semester Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Semesters / Academic Terms
            </span>
            <button
              onClick={addSemester}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Semester</span>
            </button>
          </div>

          <div className="space-y-2">
            {semesters.map(sem => (
              <div
                key={sem.id}
                className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800"
              >
                <div className="col-span-5 sm:col-span-5">
                  <input
                    type="text"
                    value={sem.name}
                    onChange={e => updateSemester(sem.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  />
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">GPA:</span>
                    <input
                      type="number"
                      min="0"
                      max={scale === '10.0' ? 10 : 4}
                      step="0.01"
                      value={sem.gpa}
                      onChange={e => updateSemester(sem.id, 'gpa', Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono text-center"
                    />
                  </div>
                </div>
                <div className="col-span-3 sm:col-span-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">Credits:</span>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={sem.credits}
                      onChange={e => updateSemester(sem.id, 'credits', Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono text-center"
                    />
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => removeSemester(sem.id)}
                    disabled={semesters.length <= 1}
                    className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-500/5 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
              Cumulative CGPA
            </span>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
                {cgpa.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-400">/ {scale}</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {honors}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Equivalent Percentage:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Credits Completed:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {totalCredits} credits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
