import React from 'react';
import { parseCalendarDate } from '../../../lib/calendarAge';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
type Props = { id: string; label: string; value: string; onChange: (value: string) => void; invalid?: boolean };

/** Explicit parts avoid locale ambiguity and scrolling a calendar back decades. */
export function AgeDateInput({ id, label, value, onChange, invalid }: Props) {
  const [year = '', month = '', day = ''] = value.split('-');
  const update = (part: 'year' | 'month' | 'day', next: string) => {
    const parts = { year, month, day, [part]: next };
    onChange(Object.values(parts).every(v => !v) ? '' : `${parts.year}-${parts.month}-${parts.day}`);
  };
  const controlClass = 'w-full min-h-12 px-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base font-semibold text-slate-900 dark:text-white';
  return <div role="group" aria-label={label} className="space-y-2">
    <div className="grid grid-cols-[0.8fr_1.5fr_1fr] gap-2">
      <label className="text-xs text-slate-600 dark:text-slate-300">Day
        <select id={`${id}-day`} aria-label={`${label} day`} aria-describedby="age-date-help" aria-invalid={invalid} value={day} onChange={e => update('day', e.currentTarget.value)} className={controlClass}>
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map(d => <option key={d} value={d}>{Number(d)}</option>)}
        </select>
      </label>
      <label className="text-xs text-slate-600 dark:text-slate-300">Month
        <select id={`${id}-month`} aria-label={`${label} month`} aria-describedby="age-date-help" aria-invalid={invalid} value={month} onChange={e => update('month', e.currentTarget.value)} className={controlClass}>
          <option value="">Month</option>
          {MONTHS.map((name, i) => <option key={name} value={String(i + 1).padStart(2, '0')}>{name}</option>)}
        </select>
      </label>
      <label className="text-xs text-slate-600 dark:text-slate-300">Year
        <input id={`${id}-year`} aria-label={`${label} year`} aria-describedby="age-date-help" aria-invalid={invalid} type="text" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="YYYY" value={year} onChange={e => update('year', e.currentTarget.value.replace(/\D/g, '').slice(0, 4))} className={controlClass} />
      </label>
    </div>
    <details className="text-xs text-slate-600 dark:text-slate-300">
      <summary className="cursor-pointer min-h-11 flex items-center underline">Use calendar picker</summary>
      <input id={id} aria-label={`${label} calendar picker`} type="date" min="0001-01-01" max="9999-12-31" value={parseCalendarDate(value) ? value : ''} onChange={e => onChange(e.currentTarget.value)} className={controlClass} />
    </details>
  </div>;
}
