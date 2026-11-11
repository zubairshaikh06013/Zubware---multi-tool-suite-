import React from 'react';

/** A small, shared directory rendered in both the initial HTML and the live homepage. */
const TASKS = [
  { title: 'Prepare an application', description: 'Get your photo and signature ready for an upload.', links: [
    ['signature-resizer', 'Resize a signature to 10–20 KB'],
    ['image-resizer', 'Resize a photo to 20 KB or 50 KB'],
    ['photo-signature-joiner', 'Combine a photo and signature'],
  ] },
  { title: 'Work with documents', description: 'Convert, combine or reduce files before sharing.', links: [
    ['pdf-compressor', 'Compress a PDF to an upload limit'],
    ['image-to-pdf', 'Convert photos to a PDF'],
    ['pdf-merge', 'Merge PDF documents'],
  ] },
  { title: 'Create and check images', description: 'Make codes or prepare a clean product photo.', links: [
    ['qr-generator', 'Create a QR code with a logo'],
    ['barcode-generator', 'Generate a barcode'],
    ['background-remover', 'Remove a photo background'],
  ] },
  { title: 'Check dates and percentages', description: 'Calculate a cutoff age or plan your attendance.', links: [
    ['age-calculator', 'Calculate age on a specific date'],
    ['attendance-calculator', 'Check classes needed for 75% attendance'],
    ['percentage-calculator', 'Calculate a percentage'],
  ] },
] as const;

export function TaskToolLinks() {
  return <section aria-labelledby="task-tools-heading" className="my-10 space-y-4">
    <h2 id="task-tools-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">Start with your task</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {TASKS.map(task => <section key={task.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white">{task.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
        <ul className="mt-3 space-y-1">
          {task.links.map(([slug, label]) => <li key={slug}>
            <a href={`https://www.zubware.com/${slug}`} className="flex min-h-11 items-center py-2 text-sm font-semibold text-indigo-700 dark:text-indigo-300 underline underline-offset-4">{label}</a>
          </li>)}
        </ul>
      </section>)}
    </div>
  </section>;
}
