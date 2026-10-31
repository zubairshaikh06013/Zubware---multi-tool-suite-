import React, { useState } from 'react';
import { Plus, Trash2, Copy, RotateCcw } from 'lucide-react';

type Subject = { id: number; name: string; attended: string; total: string };
const INITIAL: Subject[] = [{ id: 1, name: 'Mathematics', attended: '32', total: '40' }, { id: 2, name: 'Physics', attended: '27', total: '36' }];
const validCount = (value: string) => value.trim() !== '' && /^\d+$/.test(value) && Number.isSafeInteger(Number(value));
const getStatus = (attended: number, total: number, target: number) => {
  if (total === 0) return { percentage: null as number | null, need: 0, bunk: 0 };
  const percentage = 100 * attended / total;
  const ratio = target / 100;
  const need = percentage < target ? Math.max(0, Math.ceil((ratio * total - attended) / (1 - ratio) - 1e-10)) : 0;
  const bunk = percentage >= target ? Math.max(0, Math.floor(attended / ratio - total + 1e-10)) : 0;
  return { percentage, need, bunk };
};

export const AttendanceCalculatorTool: React.FC<{ onShowToast: (message: string) => void }> = ({ onShowToast }) => {
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL);
  const [target, setTarget] = useState('75');
  const [nextId, setNextId] = useState(3);
  const targetNumber = Number(target);
  const validTarget = target.trim() !== '' && Number.isFinite(targetNumber) && targetNumber > 0 && targetNumber < 100;
  const validSubjects = subjects.every(s => validCount(s.attended) && validCount(s.total) && Number(s.attended) <= Number(s.total));
  const valid = validTarget && validSubjects;
  const attended = subjects.reduce((n, s) => n + (Number(s.attended) || 0), 0);
  const total = subjects.reduce((n, s) => n + (Number(s.total) || 0), 0);
  const result = valid ? getStatus(attended, total, targetNumber) : null;
  const update = (id: number, field: keyof Subject, value: string) => setSubjects(rows => rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  const copy = async () => {
    if (!result || result.percentage === null) return onShowToast('Enter valid attendance first.');
    const summary = ['Zubware Attendance Calculator', ...subjects.map(s => s.name + ': ' + s.attended + '/' + s.total), 'Overall attendance: ' + result.percentage.toFixed(2) + '%', 'Target: ' + target + '%', 'Classes needed consecutively: ' + result.need, 'Classes you can miss now: ' + result.bunk].join('\n');
    try { await navigator.clipboard.writeText(summary); onShowToast('Attendance summary copied.'); } catch { onShowToast('Copy failed. Please try again.'); }
  };
  return <div className="p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
    <div><h2 className="text-2xl font-extrabold">Attendance Calculator</h2><p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Check attendance percentage, classes needed to reach your target, and how many classes you can safely miss. All calculations stay in your browser.</p></div>
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
      <label className="block text-sm font-semibold mb-2" htmlFor="attendance-target">Target attendance (%)</label>
      <div className="flex flex-wrap gap-2 mb-3">{[75, 80, 90].map(n => <button key={n} type="button" onClick={() => setTarget(String(n))} className={`rounded-lg px-4 py-2 text-sm border ${target === String(n) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>{n}%</button>)}</div>
      <input id="attendance-target" type="number" min="0.01" max="99.99" step="any" inputMode="decimal" value={target} onChange={e => setTarget(e.target.value)} className="w-full sm:w-40 rounded-lg border p-3 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700" />
      {!validTarget && <p role="alert" className="text-sm text-rose-600 mt-2">Target must be greater than 0% and less than 100%.</p>}
    </div>
    <div className="space-y-3"><div className="flex flex-wrap justify-between items-center gap-2"><h3 className="font-bold text-lg">Subject-wise Attendance</h3><button type="button" onClick={() => { setSubjects(rows => [...rows, { id: nextId, name: 'Subject ' + nextId, attended: '0', total: '0' }]); setNextId(id => id + 1); }} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm font-semibold"><Plus size={16}/> Add Subject</button></div>
      {subjects.map(s => { const subjectValid = validCount(s.attended) && validCount(s.total) && Number(s.attended) <= Number(s.total); const stat = subjectValid && validTarget ? getStatus(Number(s.attended), Number(s.total), targetNumber) : null; return <div key={s.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
        <div className="flex gap-2 items-center"><label className="flex-1 text-xs font-semibold">Subject name<input value={s.name} aria-label={'Subject ' + s.id + ' name'} onChange={e => update(s.id, 'name', e.target.value)} className="mt-1 block w-full rounded-lg border p-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700"/></label><button type="button" disabled={subjects.length === 1} aria-label={'Remove ' + s.name} onClick={() => setSubjects(rows => rows.filter(row => row.id !== s.id))} className="p-3 rounded-lg border disabled:opacity-40"><Trash2 size={18}/></button></div>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold">Classes attended<input type="number" min="0" step="1" inputMode="numeric" value={s.attended} onChange={e => update(s.id, 'attended', e.target.value)} className="mt-1 block w-full rounded-lg border p-3 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700" /></label><label className="text-sm font-semibold">Total classes<input type="number" min="0" step="1" inputMode="numeric" value={s.total} onChange={e => update(s.id, 'total', e.target.value)} className="mt-1 block w-full rounded-lg border p-3 bg-white text-slate-900 dark:bg-slate-900 dark:text-white dark:border-slate-700" /></label></div>
        {!subjectValid ? <p role="alert" className="text-rose-600 text-sm">Use non-negative whole numbers; attended cannot exceed total.</p> : <p className="text-sm text-slate-600 dark:text-slate-300">{stat?.percentage === null || !stat ? 'Enter total classes to calculate.' : `${stat.percentage.toFixed(2)}% attendance · ${stat.need > 0 ? stat.need + ' consecutive classes needed' : stat.bunk + ' classes can be missed'}`}</p>}
      </div>; })}
    </div>
    <section aria-live="polite" className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-5 space-y-3"><h3 className="font-bold">Your Attendance Summary</h3>{!valid ? <p className="text-rose-600">Correct the highlighted inputs to see accurate results.</p> : result?.percentage === null ? <p>Enter at least one scheduled class to calculate attendance.</p> : result && <><div className="text-4xl font-black">{result.percentage?.toFixed(2)}%</div><p>{attended} attended out of {total} classes · Target {target}%</p><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-white dark:bg-slate-900 p-3"><p className="text-xs text-slate-500">Attend consecutively</p><p className="text-2xl font-bold">{result.need}</p></div><div className="rounded-xl bg-white dark:bg-slate-900 p-3"><p className="text-xs text-slate-500">Can miss now</p><p className="text-2xl font-bold">{result.bunk}</p></div></div><p className="text-xs text-slate-600 dark:text-slate-300">Assumes each upcoming class counts equally. Subject-wise minimum requirements may differ; check your college rules.</p></>}</section>
    <div className="flex flex-wrap gap-3"><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold"><Copy size={17}/> Copy Summary</button><button type="button" onClick={() => { setSubjects(INITIAL); setTarget('75'); setNextId(3); }} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold"><RotateCcw size={17}/> Reset</button></div>
    <section className="space-y-2 text-sm text-slate-600 dark:text-slate-300"><h3 className="font-bold text-slate-900 dark:text-white">How is attendance calculated?</h3><p>Attendance percentage = (classes attended ÷ total classes) × 100. To reach a target, we calculate the minimum number of consecutive attended classes needed. The bunk calculator estimates how many future classes you can miss while staying at or above the target.</p></section>
  </div>;
};
