import React, { useMemo, useState } from 'react';
import { Copy, Printer, RotateCcw, Download } from 'lucide-react';

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1] as const;
const formatINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const wordsUnderThousand = (n: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (n < 20) return ones[n];
  if (n < 100) return [tens[Math.floor(n / 10)], ones[n % 10]].filter(Boolean).join(' ');
  return [ones[Math.floor(n / 100)] + ' Hundred', wordsUnderThousand(n % 100)].filter(Boolean).join(' ');
};
const amountInWords = (n: number): string => {
  if (n === 0) return 'Zero Rupees Only';
  const groups = [{ size: 10000000, name: 'Crore' }, { size: 100000, name: 'Lakh' }, { size: 1000, name: 'Thousand' }, { size: 1, name: '' }];
  let remaining = n;
  const parts: string[] = [];
  for (const group of groups) {
    const value = Math.floor(remaining / group.size);
    if (value) parts.push([wordsUnderThousand(value), group.name].filter(Boolean).join(' '));
    remaining %= group.size;
  }
  return parts.join(' ') + ' Rupees Only';
};
export const CashDenominationCalculatorTool: React.FC<{ onShowToast: (message: string) => void }> = ({ onShowToast }) => {
  const [counts, setCounts] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const rows = useMemo(() => DENOMINATIONS.map(value => ({ value, count: Number(counts[value] || 0), amount: value * Number(counts[value] || 0) })), [counts]);
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const pieces = rows.reduce((sum, row) => sum + row.count, 0);
  const valid = rows.every(row => Number.isSafeInteger(row.count) && row.count >= 0 && Number.isSafeInteger(row.amount)) && Number.isSafeInteger(total) && total <= 999999999;
  const summary = ['Cash Denomination Summary', ...rows.filter(row => row.count).map(row => '₹' + row.value + ' × ' + row.count + ' = ' + formatINR(row.amount)), 'Total pieces: ' + pieces, 'Total amount: ' + formatINR(total), amountInWords(total), 'Calculated with Zubware'].join('\n');
  const copy = async () => {
    if (!valid) return;
    try { await navigator.clipboard.writeText(summary); setCopied(true); onShowToast('Cash summary copied'); window.setTimeout(() => setCopied(false), 2000); }
    catch { onShowToast('Copy failed. Please select and copy the summary.'); }
  };
  const download = () => {
    if (!valid) return;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'zubware-cash-denomination.txt'; document.body.appendChild(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const printSummary = () => {
    if (!valid) return;
    const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tableRows = rows.filter(row => row.count > 0).map(row =>
      '<tr><td>₹' + row.value + '</td><td>' + row.count.toLocaleString('en-IN') + '</td><td>' + escapeHtml(formatINR(row.amount)) + '</td></tr>'
    ).join('');
    const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cash Denomination Summary - Zubware</title><style>body{font:16px Arial,sans-serif;max-width:720px;margin:30px auto;padding:0 16px;color:#111}h1{font-size:24px}table{width:100%;border-collapse:collapse}th,td{padding:12px;border:1px solid #ccc;text-align:left}th:last-child,td:last-child{text-align:right}.total{font-size:22px;font-weight:bold;margin-top:20px}.actions{margin-bottom:24px}button{padding:12px 18px;font-size:16px;cursor:pointer}@media print{.actions{display:none}body{margin:0}}</style></head><body><div class="actions"><button type="button" onclick="window.print()">Print / Save as PDF</button><p>If the print dialog does not appear, use your browser menu → Share → Print.</p></div><h1>Cash Denomination Summary</h1><p>Prepared with Zubware</p><table><thead><tr><th>Note / Coin</th><th>Quantity</th><th>Amount</th></tr></thead><tbody>' + tableRows + '</tbody></table><p>Total notes & coins: ' + pieces.toLocaleString('en-IN') + '</p><p class="total">Total cash: ' + escapeHtml(formatINR(total)) + '</p><p>' + escapeHtml(amountInWords(total)) + '</p></body></html>';
    const popup = window.open('', '_blank');
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
      popup.focus();
      onShowToast('Printable summary opened. Tap Print / Save as PDF.');
    } else {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'zubware-cash-print.html';
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      onShowToast('Browser blocked the print tab. Open the downloaded HTML file and print from Chrome.');
    }
  };
  return <div className="space-y-6 p-4 sm:p-8">
    <header><h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cash Denomination Calculator (India)</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Count Indian currency notes and coins instantly. All calculations stay in your browser.</p></header>
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:bg-indigo-950/40"><p className="text-sm text-slate-600 dark:text-slate-300">Total cash</p><output aria-live="polite" className="block break-all text-3xl font-bold text-indigo-700 dark:text-indigo-300">{valid ? formatINR(total) : 'Invalid amount'}</output></div>
      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-sm">Total notes & coins</p><output className="text-3xl font-bold">{valid ? pieces.toLocaleString('en-IN') : '—'}</output></div>
      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-sm">Denominations used</p><output className="text-3xl font-bold">{rows.filter(row => row.count > 0).length}</output></div>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700"><table className="w-full text-left text-sm"><thead className="bg-slate-100 dark:bg-slate-800"><tr><th className="p-3">Note / Coin</th><th className="p-3">Quantity</th><th className="p-3 text-right">Amount</th></tr></thead><tbody>{rows.map(row => <tr key={row.value} className="border-t border-slate-200 dark:border-slate-700"><th className="p-3 font-semibold">₹{row.value}</th><td className="p-2"><input aria-label={'Quantity of ₹' + row.value} inputMode="numeric" type="number" min="0" step="1" value={counts[row.value] ?? ''} placeholder="0" onChange={e => setCounts(prev => ({ ...prev, [row.value]: e.target.value }))} className="w-28 max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white" /></td><td className="p-3 text-right font-medium">{Number.isSafeInteger(row.amount) && row.amount >= 0 ? formatINR(row.amount) : '—'}</td></tr>)}</tbody></table></div>
    {!valid && <p role="alert" className="text-red-600">Enter whole, non-negative quantities. Maximum total supported is ₹99,99,99,999.</p>}
    <section className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><h3 className="font-bold">Amount in words</h3><output aria-live="polite" className="mt-2 block break-words">{valid ? amountInWords(total) : 'Please correct the quantities'}</output></section>
    <div className="flex flex-wrap gap-3"><button type="button" onClick={copy} disabled={!valid} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50"><Copy size={16}/>{copied ? 'Copied' : 'Copy summary'}</button><button type="button" onClick={download} disabled={!valid} className="flex items-center gap-2 rounded-xl border px-4 py-3 disabled:opacity-50"><Download size={16}/>Download TXT</button><button type="button" onClick={printSummary} disabled={!valid} className="flex items-center gap-2 rounded-xl border px-4 py-3 disabled:opacity-50"><Printer size={16}/>Print</button><button type="button" onClick={() => setCounts({})} className="flex items-center gap-2 rounded-xl border px-4 py-3"><RotateCcw size={16}/>Reset</button></div>
    <section className="space-y-3 text-sm text-slate-600 dark:text-slate-300"><h3 className="text-lg font-bold text-slate-900 dark:text-white">How to use the cash denomination calculator</h3><p>Enter how many notes or coins you have for each denomination. The calculator multiplies each count by its rupee value and adds the results automatically. Copy, download or print your total for cash reconciliation.</p><h3 className="font-bold">Frequently asked questions</h3><p><strong>Is this calculator free?</strong> Yes. It works in your browser without an account.</p><p><strong>Does it support ₹2000 notes?</strong> This table covers common denominations ₹500 to ₹1; ₹2000 notes are not included in this version.</p><p><strong>Can I use it for a cash register?</strong> Yes, for counting and checking cash totals. Verify physical cash before closing your register.</p></section>
  </div>;
};
