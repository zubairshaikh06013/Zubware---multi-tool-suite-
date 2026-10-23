import React from 'react';
import { getLinkUrl } from '../../lib/paths';

/** Shared by the interactive page and its crawlable HTML. */
export function GstInvoiceIntro() {
  return <div className="mt-4 space-y-3 text-sm">
    <ul aria-label="GST bill maker benefits" className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-indigo-800 dark:text-indigo-200">
      {['Free to use', 'No account needed', 'A4 PDF download', 'UPI payment QR'].map(label =>
        <li key={label} className="rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-2">{label}</li>)}
    </ul>
    <a href={getLinkUrl('/downloads/gst-invoice-sample.pdf')} download className="inline-block font-semibold text-indigo-600 dark:text-indigo-400 underline underline-offset-4">Download sample invoice PDF</a>
    <p lang="hi" className="text-slate-600 dark:text-slate-400">GST बिल बनाएं, बाकी payment का QR जोड़ें और PDF डाउनलोड करें।</p>
  </div>;
}
