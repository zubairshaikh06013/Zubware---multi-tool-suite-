import React, { useState, useMemo } from 'react';
import { Link2, Copy, Check, Download, Filter, Trash2, Search, ExternalLink } from 'lucide-react';

interface UrlExtractorToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_TEXT = `Welcome to the Zubware documentation!
You can visit our main homepage at https://zubware.com or check out the repository at https://github.com/zubware/tools.
For design assets, see https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80.
Documentation: https://zubware.com/docs and support at https://zubware.com/help.
Also check our blog post on https://medium.com/@zubware/launching-200-tools-4394024.`;

export const UrlExtractorTool: React.FC<UrlExtractorToolProps> = ({ onShowToast }) => {
  const [rawText, setRawText] = useState<string>(SAMPLE_TEXT);
  const [deduplicate, setDeduplicate] = useState<boolean>(true);
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const extractedUrls = useMemo(() => {
    if (!rawText.trim()) return [];

    // Comprehensive URL regex
    const urlRegex = /(?:https?:\/\/|ftp:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;
    const matches = rawText.match(urlRegex) || [];

    // Normalize (add https:// to www.)
    let urls = matches.map(u => {
      // Clean trailing punctuation
      const cleaned = u.replace(/[.,;:!?)]+$/, '');
      if (cleaned.startsWith('www.')) return `https://${cleaned}`;
      return cleaned;
    });

    if (deduplicate) {
      urls = Array.from(new Set(urls));
    }

    if (filterDomain.trim()) {
      const term = filterDomain.toLowerCase().trim();
      urls = urls.filter(u => u.toLowerCase().includes(term));
    }

    return urls;
  }, [rawText, deduplicate, filterDomain]);

  const copyAll = () => {
    if (extractedUrls.length === 0) return;
    navigator.clipboard.writeText(extractedUrls.join('\n'));
    setCopied(true);
    onShowToast(`Copied ${extractedUrls.length} URLs!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySingle = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    onShowToast('Copied URL!');
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const downloadList = () => {
    if (extractedUrls.length === 0) return;
    const blob = new Blob([extractedUrls.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-urls.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded extracted-urls.txt');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔗</span> URL Extractor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Extract, filter, and export all web links, URLs, and domains from unformatted text or HTML blocks.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadList}
            disabled={extractedUrls.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export TXF</span>
          </button>
          <button
            onClick={copyAll}
            disabled={extractedUrls.length === 0}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy All ({extractedUrls.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Paste Text / Source Code
            </span>
            <button
              onClick={() => setRawText('')}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              Clear Text
            </button>
          </div>

          <textarea
            rows={14}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Paste raw text, articles, or logs containing URLs..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={deduplicate}
                onChange={e => setDeduplicate(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
              <span>Deduplicate (Unique URLs only)</span>
            </label>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Extracted Links ({extractedUrls.length})
            </span>

            {/* Filter Search */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={filterDomain}
                onChange={e => setFilterDomain(e.target.value)}
                placeholder="Filter by domain..."
                className="pl-7 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-44"
              />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl min-h-[350px] max-h-[440px] overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800">
            {extractedUrls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 space-y-2">
                <Link2 className="w-8 h-8 opacity-30" />
                <p className="text-xs">No URLs found in the provided text</p>
              </div>
            ) : (
              extractedUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs group"
                >
                  <span className="truncate max-w-[80%] font-mono text-indigo-600 dark:text-indigo-400">
                    {url}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copySingle(url, idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Open link in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
