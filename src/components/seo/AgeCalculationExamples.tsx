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
      <h2 className="text-lg font-bold">How to Calculate Age on a Specific Date</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">Use this free age calculator with DOB to find out your age today, or calculate your age till a date you choose. Enter your full date of birth, then set Age at Date to today, a past milestone or a future cutoff. The result separates completed years, months and days from total elapsed days and weeks.</p>
      <h3 className="text-lg font-bold">Entering your date of birth in India</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">If your document shows DD/MM/YYYY, 13/05/1997 means 13 May 1997. The date picker follows your browser or device format, so check its day, month and year labels before entering a date. For an age as on a particular date, enter that date in Age at Date; Set to Today uses your device's current date. The examples below use YYYY-MM-DD to avoid confusing the day and month.</p>
      <h3 className="text-lg font-bold">Age calculator formula: completed years, not just year subtraction</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">For completed years, subtract your birth year from the reference year, then subtract one if your birthday has not yet occurred by the reference date. For example, someone born on May 13, 1997 is 28 on May 12, 2026 and turns 29 on May 13, 2026. For months and days, use calendar anniversaries rather than assuming every month has 30 days. The month-end and February 29 conventions used here are explained below.</p>
      <h3 className="text-lg font-bold">Age completed in years as on 31st December</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Choose December 31 of the required year in Age at Date, then read the completed years in the result. For a birth date of May 13, 1997 and a reference date of December 31, 2026, the result is 29 years, 7 months and 18 days: enter 29 if a form asks for completed years only. A reference date is not always today; use the date stated on the form.</p>
      <h3 className="text-lg font-bold">Age calculator by year: born in 1992 or 2002?</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Someone born in 1992 turns 34 during 2026, but is still 33 before their birthday. Someone born in 2002 turns 24 during 2026 and is 23 before their birthday. A birth year alone cannot give an exact age in months and days. Enter the full date of birth and reference date for that breakdown.</p>
      <h3 className="text-lg font-bold">How old will I be on my next birthday?</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Enter your date of birth, then select Next birthday from today. This sets Age at Date to your birthday on or after today and shows the age you reach on that date. If today is your birthday, the shortcut uses today. For example, someone born on 15 May 1995 turns 31 on 15 May 2026. February 29 birthdays use February 28 in non-leap years in this calculator. Select Today to return to your current age.</p>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Days and Weeks Old Calculator by Date of Birth</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">To find how many days old you are, enter your date of birth and select Set to Today in the calculator. For your age on a past or future date, change the reference date. The result shows total elapsed calendar days alongside your age in years, months, and days.</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">Your birth date counts as day zero and the following date as day one. Leap days count automatically. For example, February 28 to March 1 is 2 days in 2024, but 1 day in 2025. This is a date-only count, not an exact elapsed-time measurement from your birth hour.</p>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Age on a Specific Date: Worked Examples</h3>
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
      <h3 className="text-lg font-bold">How old will I be on an exam or job application cutoff date?</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Use the date of birth printed on your official documents and enter the cutoff date specified in the exam, recruitment, or application notice as the reference date. For example, someone born on January 1, 2000 is 25 years old on January 1, 2025. The result is a calendar-age calculation, not a decision about eligibility: an authority may use different age limits, inclusive dates, or category-based relaxations.</p>
      <h3 className="text-lg font-bold">What if my birthday is February 29?</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">This tool treats February 28 as the anniversary of a February 29 birth date in non-leap years. Other systems may use March 1, particularly for legal or administrative purposes. Check the applicable official rule before relying on a result for an application.</p>
            <h3 className="text-lg font-bold">Age in days versus age in years</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Total elapsed days counts calendar days between the two dates, with the birth date itself at zero. Do not divide this number by 365 to obtain an exact calendar age: leap years and unequal month lengths change the result. For an application cutoff, choose the stated reference date and follow the organisation's own eligibility rules.</p>
    </section>
  );
}
