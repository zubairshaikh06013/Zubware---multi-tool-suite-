import React from 'react';
import { SEARCH_QUESTION_GUIDES } from '../../data/searchQuestionGuides';

export function SearchQuestionGuide({ toolId }: { toolId: string }) {
  const guide = SEARCH_QUESTION_GUIDES[toolId];
  if (!guide) return null;
  return <section className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4">
    <h2 className="text-xl sm:text-2xl font-bold">{guide.heading}</h2>
    <p>{guide.answer}</p>
    <h3 className="text-lg font-bold">Steps to follow</h3>
    <ol className="list-decimal pl-5 space-y-2">
      {guide.steps.map(step => <li key={step}>{step}</li>)}
    </ol>
    <h3 className="text-lg font-bold">Worked example</h3>
    <p>{guide.example}</p>
    <p>{guide.note}</p>
    <ul className="list-disc pl-5 space-y-2">
      {guide.links.map(link => <li key={link.href}><a className="text-indigo-600 dark:text-indigo-400 underline" href={link.href}>{link.label}</a></li>)}
    </ul>
  </section>;
}
