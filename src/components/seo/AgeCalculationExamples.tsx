import React from 'react';

/** Shared by the interactive page and its build-time HTML. Fixed dates never imply today's age. */
export const AGE_EXAMPLES = [
  { birth: '2000-01-01', target: '2025-01-01', age: '25 years, 0 months, 0 days', days: 9132 },
  { birth: '1995-05-15', target: '2024-10-20', age: '29 years, 5 months, 5 days', days: 10751 },
  { birth: '2004-02-29', target: '2024-03-01', age: '20 years, 0 months, 1 day', days: 7306 },
  { birth: '2000-01-31', target: '2026-03-01', age: '26 years, 1 month, 1 day', days: 9526 },
];

export function AgeCalculationExamples() {
  return (
    <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-indigo-200/60 dark:border-indigo-900/60">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Age on a Specific Date: Worked Examples</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">Enter both the date of birth and reference date shown below to reproduce each result. Dates use YYYY-MM-DD. These fixed examples are not ages as of today.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGE_EXAMPLES.map(example => (
          <div key={example.birth} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm space-y-2">
            <p><strong>Date of birth:</strong> <time dateTime={example.birth}>{example.birth}</time></p>
            <p><strong>Reference date:</strong> <time dateTime={example.target}>{example.target}</time></p>
            <p><strong>Age:</strong> {example.age}</p>
            <p><strong>Total elapsed days:</strong> {example.days}</p>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-bold">How month-end and leap-day ages are calculated</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">The calculator counts completed calendar months, then the days since that monthly anniversary. If the birth day does not exist in the destination month, it uses that month's last day. For example, January 31 to February 28 is one month in a non-leap year; January 31 to March 1 is one month and one day. February 29 birthdays use February 28 in non-leap years in this calculator.</p>
      <h3 className="text-lg font-bold">Age in days versus age in years</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Total elapsed days counts calendar days between the two dates, with the birth date itself at zero. Do not divide this number by 365 to obtain an exact calendar age: leap years and unequal month lengths change the result. For an application cutoff, choose the stated reference date and follow the organisation's own eligibility rules.</p>
    </section>
  );
}
