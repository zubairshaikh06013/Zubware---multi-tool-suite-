import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';

import { convertGrade, weightedCgpa } from '../../../lib/cgpaMath';

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
  const [sgpaSubjects, setSgpaSubjects] = useState([{ id: 1, name: 'Subject 1', credits: '4', grade: '9' }, { id: 2, name: 'Subject 2', credits: '3', grade: '8' }, { id: 3, name: 'Subject 3', credits: '3', grade: '10' }]);
  const sgpaValid = sgpaSubjects.length > 0 && sgpaSubjects.every(subject => subject.credits.trim() !== '' && subject.grade.trim() !== '' && Number.isFinite(Number(subject.credits)) && Number(subject.credits) > 0 && Number.isFinite(Number(subject.grade)) && Number(subject.grade) >= 0 && Number(subject.grade) <= 10);
  const sgpaCredits = sgpaSubjects.reduce((sum, subject) => sum + Number(subject.credits || 0), 0);
  const sgpa = sgpaValid && sgpaCredits > 0 ? sgpaSubjects.reduce((sum, subject) => sum + Number(subject.credits) * Number(subject.grade), 0) / sgpaCredits : null;
  const updateSgpaSubject = (id: number, field: 'name' | 'credits' | 'grade', value: string) => setSgpaSubjects(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  const [scale, setScale] = useState<'4.0' | '10.0'>('10.0');
  const [semesters, setSemesters] = useState<SemesterRecord[]>([
    { id: '1', name: 'Semester 1', gpa: 8.5, credits: 22 },
    { id: '2', name: 'Semester 2', gpa: 8.8, credits: 24 },
    { id: '3', name: 'Semester 3', gpa: 9.1, credits: 20 },
    { id: '4', name: 'Semester 4', gpa: 8.4, credits: 22 }
  ]);
  const [direction, setDirection] = useState<'to-percent' | 'to-cgpa'>('to-percent');
  const [directValue, setDirectValue] = useState('8.5');
  const [rule, setRule] = useState('indicative');
  const [customMultiplier, setCustomMultiplier] = useState('9.5');
  const [customOffset, setCustomOffset] = useState('0');
  const multiplier = rule === 'custom' ? Number(customMultiplier) : rule === 'proportion' ? 100 / Number(scale) : 9.5;
  const offset = rule === 'custom' ? Number(customOffset) : 0;
  const validRule = (rule !== 'custom' || (customMultiplier.trim() !== '' && customOffset.trim() !== ''));
  const directResult = directValue.trim() && validRule ? convertGrade(Number(directValue), direction, Number(scale), multiplier, offset) : null;
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

  const totalCredits = semesters.reduce((sum, row) => sum + row.credits, 0);
  const cgpa = weightedCgpa(semesters, Number(scale));
  const percentage = cgpa !== null && validRule ? convertGrade(cgpa, 'to-percent', Number(scale), multiplier, offset) : null;
  const changeScale = (next: '4.0' | '10.0') => {
    // Preserve the relative grade when changing scales; never show GPA > maximum.
    setSemesters(rows => rows.map(row => ({ ...row, gpa: Number((row.gpa * Number(next) / Number(scale)).toFixed(2)) })));
    setScale(next);
    setRule(next === '4.0' ? 'proportion' : 'indicative');
    setDirectValue('');
  };
  const copyResult = async () => {
    if (cgpa === null || percentage === null) return onShowToast('Pehle valid GPA, credits aur formula enter karo.');
    try {
      await navigator.clipboard.writeText(`CGPA: ${cgpa === null ? '—' : cgpa.toFixed(2)} / ${scale}; indicative percentage: ${percentage.toFixed(2)}%; formula: CGPA × ${multiplier} + (${offset}); total credits: ${totalCredits}. Verify with your institution.`);
      setCopied(true);
      onShowToast('CGPA summary copy ho gayi.');
      setTimeout(() => setCopied(false), 2000);
    } catch { onShowToast('Copy nahi hua. Result manually select karke copy karo.'); }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            CGPA Calculator (Cumulative Grade Point Average)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Semester GPA aur credits se CGPA nikalo, ya CGPA aur percentage convert karo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => changeScale('10.0')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scale === '10.0' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              10.0 Scale
            </button>
            <button
              onClick={() => changeScale('4.0')}
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

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div><h3 className="text-lg font-bold">SGPA Calculator — Subject-wise (10-point scale)</h3><p className="text-sm text-slate-600 dark:text-slate-300">Enter each subject's grade point and credit value from your marksheet. SGPA = sum of (grade point × credits) / total credits. Your university's grading rules take priority.</p></div>
        <div className="space-y-3">
          {sgpaSubjects.map(subject => <div key={subject.id} className="grid grid-cols-12 gap-2 items-end rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <label className="col-span-12 sm:col-span-5 text-xs font-semibold">Subject<input aria-label={subject.name + ' name'} value={subject.name} onChange={e => updateSgpaSubject(subject.id, 'name', e.target.value)} className="mt-1 w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700" /></label>
            <label className="col-span-5 sm:col-span-3 text-xs font-semibold">Credits<input aria-label={subject.name + ' credits'} type="number" min="0.5" step="any" inputMode="decimal" value={subject.credits} onChange={e => updateSgpaSubject(subject.id, 'credits', e.target.value)} className="mt-1 w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700" /></label>
            <label className="col-span-5 sm:col-span-3 text-xs font-semibold">Grade point (0–10)<input aria-label={subject.name + ' grade point'} type="number" min="0" max="10" step="any" inputMode="decimal" value={subject.grade} onChange={e => updateSgpaSubject(subject.id, 'grade', e.target.value)} className="mt-1 w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700" /></label>
            <button type="button" aria-label={'Remove ' + subject.name} onClick={() => setSgpaSubjects(rows => rows.length > 1 ? rows.filter(row => row.id !== subject.id) : rows)} className="col-span-2 sm:col-span-1 rounded-lg border p-2 flex justify-center" disabled={sgpaSubjects.length === 1}><Trash2 size={16}/></button>
          </div>)}
        </div>
        <button type="button" onClick={() => setSgpaSubjects(rows => [...rows, { id: Math.max(0, ...rows.map(row => row.id)) + 1, name: 'Subject ' + (rows.length + 1), credits: '3', grade: '8' }])} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16}/>Add Subject</button>
        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/40"><p className="text-sm">Total subject credits: {sgpaCredits.toLocaleString('en-IN')}</p><output aria-live="polite" className="text-2xl font-bold">SGPA: {sgpa === null ? 'Enter valid credits and grade points' : sgpa.toFixed(2) + ' / 10'}</output></div>
        <p className="text-xs text-slate-600 dark:text-slate-300">Example: 4 credits × 9 points and 3 credits × 8 points gives 8.57 SGPA. For cumulative CGPA, enter each semester's SGPA and total credits in the section below.</p>
      </section>
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <h3 className="font-bold">CGPA to Percentage / Percentage to CGPA</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">Har university ka formula alag ho sakta hai. Apne course aur batch ka official rule check karo. 9.5 wala rule sab universities par apply nahi hota.</p>
        <label className="block text-sm">Conversion formula
          <select aria-label="Conversion formula" value={rule} onChange={e => setRule(e.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            {scale === '10.0' && <option value="indicative">9.5 × CGPA — legacy CBSE indicative rule</option>}
            <option value="proportion">CGPA ÷ scale × 100 — proportional estimate</option>
            <option value="custom">Custom formula — apne institution ka rule</option>
          </select>
        </label>
        {rule === 'custom' && <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Multiplier <input aria-label="Formula multiplier" type="number" step="any" value={customMultiplier} onChange={e => setCustomMultiplier(e.target.value)} className="block w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800" /></label>
          <label className="text-sm">Offset (+ / −) <input aria-label="Formula offset" type="number" step="any" value={customOffset} onChange={e => setCustomOffset(e.target.value)} className="block w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800" /></label>
        </div>}
        <p className="text-xs">Percentage = CGPA × {multiplier} + ({offset}). Proportional estimate official equivalence nahi hai. Custom mode sirf linear formula ke liye hai.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">Convert
            <select aria-label="Conversion direction" value={direction} onChange={e => { setDirection(e.target.value as typeof direction); setDirectValue(''); }} className="block w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <option value="to-percent">CGPA to Percentage</option><option value="to-cgpa">Percentage to CGPA</option>
            </select>
          </label>
          <label className="text-sm">{direction === 'to-percent' ? `CGPA (0–${scale})` : 'Percentage (0–100)'}
            <input aria-label="Grade to convert" type="number" step="any" min="0" max={direction === 'to-percent' ? Number(scale) : 100} value={directValue} onChange={e => setDirectValue(e.target.value)} className="block w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </label>
        </div>
        <output aria-live="polite" className="block text-lg font-bold">{directResult === null ? (directValue ? 'Input ya formula check karo — result valid range mein nahi hai.' : 'Apni value enter karo.') : `${directResult.toFixed(2)}${direction === 'to-percent' ? '%' : ` / ${scale} CGPA`}`}</output>
        <p className="text-xs">Mumbai University ya kisi aur university ke liye latest marksheet / conversion certificate ka rule use karo. Yeh result official certificate nahi hai. <a className="underline" href="https://www.cbse.gov.in/cbsenew/Examination_Circular/2012/9_CIRCULAR.pdf" target="_blank" rel="noopener noreferrer">CBSE ka 2012 indicative conversion reference</a>.</p>
      </section>

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
                    aria-label="Semester name"
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
                      aria-label={`${sem.name} GPA`}
                      value={Number.isFinite(sem.gpa) ? sem.gpa : ''}
                      onChange={e => updateSemester(sem.id, 'gpa', e.target.value === '' ? NaN : Number(e.target.value))}
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
                      aria-label={`${sem.name} credits`}
                      value={Number.isFinite(sem.credits) ? sem.credits : ''}
                      onChange={e => updateSemester(sem.id, 'credits', e.target.value === '' ? NaN : Number(e.target.value))}
                      className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono text-center"
                    />
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    aria-label={`Remove ${sem.name}`}
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
                {cgpa === null ? '—' : cgpa.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-slate-400">/ {scale}</span>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Indicative result — institution se verify karo
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Indicative Percentage:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {percentage === null ? '—' : `${percentage.toFixed(2)}%`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Credits Completed:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {Number.isFinite(totalCredits) ? totalCredits : '—'} credits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
