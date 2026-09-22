import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Mail, Filter, Sparkles } from 'lucide-react';

interface EmailExtractorToolProps {
  onShowToast: (message: string) => void;
}

export const EmailExtractorTool: React.FC<EmailExtractorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `Contact our customer support at support@example.com or reach out directly to hello@zubware.com.\nFor press inquiries: press@example.org and media@zubware.com.\nDuplicate email test: support@example.com`
  );
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [sortAlphabetically, setSortAlphabetically] = useState<boolean>(false);
  const [domainFilter, setDomainFilter] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const extractEmails = (): string[] => {
    if (!inputText) return [];
    // RFC-compliant email regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    const matches = inputText.match(emailRegex) || [];

    let cleaned = matches.map(e => e.trim().toLowerCase());

    if (removeDuplicates) {
      cleaned = Array.from(new Set(cleaned));
    }

    if (domainFilter.trim()) {
      const d = domainFilter.trim().toLowerCase();
      cleaned = cleaned.filter(e => e.endsWith(d));
    }

    if (sortAlphabetically) {
      cleaned.sort((a, b) => a.localeCompare(b));
    }

    return cleaned;
  };

  const emails = extractEmails();

  const handleCopy = () => {
    if (!emails.length) return;
    navigator.clipboard.writeText(emails.join('\n'));
    setCopied(true);
    onShowToast(`Copied ${emails.length} email addresses!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!emails.length) return;
    const blob = new Blob([emails.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_emails_${emails.length}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded TXT file!');
  };

  const handleDownloadCsv = () => {
    if (!emails.length) return;
    const csvContent = 'Email,Domain\n' + emails.map(e => `${e},${e.split('@')[1] || ''}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_emails_${emails.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded CSV file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => setRemoveDuplicates(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Remove Duplicates</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={sortAlphabetically}
              onChange={(e) => setSortAlphabetically(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Sort Alphabetically (A-Z)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Domain:</span>
          <input
            type="text"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            placeholder="e.g. gmail.com"
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white w-32"
          />
        </div>
      </div>

      {/* Editor & Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Raw Text Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Paste Unstructured Text / HTML / Logs</span>
            {inputText && (
              <button
                onClick={() => { setInputText(''); onShowToast('Cleared input'); }}
                className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={11}
            placeholder="Paste emails, chat transcripts, articles, or source code here..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Extracted List Output */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
              <Mail className="w-3.5 h-3.5" /> Extracted Emails ({emails.length})
            </span>
            <span className="text-slate-400">{removeDuplicates ? 'Unique list' : 'All occurrences'}</span>
          </div>

          <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 h-64 overflow-y-auto space-y-1.5">
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                <Mail className="w-6 h-6 mb-1 opacity-40" />
                <span>No emails detected in the input yet</span>
              </div>
            ) : (
              emails.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-mono text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate mr-2">{email}</span>
                  <span className="text-[10px] text-slate-400">#{idx + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          disabled={!emails.length}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : `Copy All (${emails.length})`}</span>
        </button>

        <button
          onClick={handleDownloadTxt}
          disabled={!emails.length}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download TXT</span>
        </button>

        <button
          onClick={handleDownloadCsv}
          disabled={!emails.length}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download CSV</span>
        </button>
      </div>
    </div>
  );
};
