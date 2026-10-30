import React from 'react';
import { calendarAge, calendarAnniversary, parseCalendarDate } from '../../../lib/calendarAge';

/** Explain the same birth-anchored calendar months used by the calculator. */
export function AgeCalculationBreakdown({ birthDate, referenceDate }: { birthDate: string; referenceDate: string }) {
  const birth = parseCalendarDate(birthDate);
  const reference = parseCalendarDate(referenceDate);
  const age = birth && reference ? calendarAge(birth, reference) : null;
  if (!birth || !reference || !age) return null;

  const completedMonths = age.years * 12 + age.months;
  const anniversary = calendarAnniversary(birth, birth.getFullYear(), birth.getMonth() + completedMonths);
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const anniversaryValue = `${String(anniversary.getFullYear()).padStart(4, '0')}-${String(anniversary.getMonth() + 1).padStart(2, '0')}-${String(anniversary.getDate()).padStart(2, '0')}`;
  const unit = (value: number, name: string) => `${value} ${name}${value === 1 ? '' : 's'}`;

  return (
    <section aria-labelledby="age-calculation-breakdown-heading" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-6 space-y-3">
      <h3 id="age-calculation-breakdown-heading" className="text-base font-bold text-slate-900 dark:text-white">
        How this age was calculated
      </h3>
      <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <li>
          Start with your date of birth: <time dateTime={birthDate} className="font-semibold">{formatDate(birth)}</time>.
        </li>
        <li>
          Count <strong>{unit(completedMonths, 'completed calendar month')}</strong> from your birth date to{' '}
          <time dateTime={anniversaryValue} className="font-semibold">{formatDate(anniversary)}</time>.
          {' '}That is {unit(age.years, 'year')} and {unit(age.months, 'month')}.
        </li>
        <li>
          Count the remaining <strong>{unit(age.days, 'day')}</strong> from{' '}
          <time dateTime={anniversaryValue}>{formatDate(anniversary)}</time> to your reference date,{' '}
          <time dateTime={referenceDate} className="font-semibold">{formatDate(reference)}</time>.
        </li>
      </ol>
      <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
        Age on {formatDate(reference)}: {unit(age.years, 'year')}, {unit(age.months, 'month')}, {unit(age.days, 'day')}.
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Each month is counted from the original birth date. If that day does not exist in the destination month, we use its last day. Months are not assumed to have 30 days, and years are not assumed to have 365 days.
      </p>
    </section>
  );
}
