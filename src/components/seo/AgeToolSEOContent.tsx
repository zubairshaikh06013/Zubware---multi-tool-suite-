import React from 'react';
import { AgeCalculationExamples } from './AgeCalculationExamples';
import { useToolSeoData } from '../../hooks/useToolSeoData';

/** Age-only guide: avoid loading every unrelated tool's editorial module. */
export function AgeToolSEOContent() {
  const seo = useToolSeoData('age-calculator');
  return <div className="mt-8 space-y-6">
    <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
      <h2 className="text-xl font-bold">How to calculate age from date of birth</h2>
      <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
        {(seo.howTo || []).map(step => <li key={step.title}><strong>{step.title}.</strong> {step.desc}</li>)}
      </ol>
      <p className="text-sm text-slate-600 dark:text-slate-300">Your main result appears before optional comparisons. Date of birth and reference dates are used in your browser for these calculations. They are not added to the page URL. Copy Age Card includes the dates you enter, so check it before sharing.</p>
    </section>
    <AgeCalculationExamples />
    <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
      <h2 className="text-xl font-bold">Age calculator questions</h2>
      {(seo.faq || []).map(faq => <details key={faq.question} className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <summary className="min-h-11 cursor-pointer font-semibold text-sm text-slate-900 dark:text-white">{faq.question}</summary>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{faq.answer}</p>
      </details>)}
    </section>
    <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3 text-sm">
      <h2 className="text-xl font-bold">Calculation method and worked examples</h2>
      <p>We document this calculator’s month-end and leap-day conventions so you can reproduce the results. Calculation examples checked on <time dateTime="2026-11-06">6 November 2026</time>.</p>
      <ul className="list-disc pl-5 space-y-3">
        <li><a className="underline text-indigo-600 dark:text-indigo-400" href="/blog/age-calculator-leap-year-month-end-test-cases">Leap-year and month-end test cases, with reusable test data</a></li>
        <li><a className="underline text-indigo-600 dark:text-indigo-400" href="/blog/calculate-age-on-cutoff-date">Age on a cutoff date: completed years and comparison examples</a></li>
      </ul>
      <p className="text-slate-600 dark:text-slate-300">Age is a calendar calculation here. Official forms may apply different birthday conventions or eligibility rules; use the instructions of the organisation receiving your application.</p>
    </section>
  </div>;
}
