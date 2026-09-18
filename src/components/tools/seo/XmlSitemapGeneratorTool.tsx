import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Plus, FileCode, Sparkles } from 'lucide-react';

interface XmlSitemapGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface SitemapUrlEntry {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const XmlSitemapGeneratorTool: React.FC<XmlSitemapGeneratorToolProps> = ({ onShowToast }) => {
  const today = new Date().toISOString().split('T')[0];
  const [entries, setEntries] = useState<SitemapUrlEntry[]>([
    { id: '1', loc: 'https://zubware.com/', lastmod: today, changefreq: 'daily', priority: '1.0' },
    { id: '2', loc: 'https://zubware.com/typing-speed-test.html', lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { id: '3', loc: 'https://zubware.com/scientific-calculator.html', lastmod: today, changefreq: 'weekly', priority: '0.9' },
    { id: '4', loc: 'https://zubware.com/about.html', lastmod: today, changefreq: 'monthly', priority: '0.6' }
  ]);
  const [bulkInput, setBulkInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'bulk'>('table');
  const [copied, setCopied] = useState<boolean>(false);

  const handleAddRow = () => {
    setEntries(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        loc: 'https://zubware.com/new-page.html',
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8'
      }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateEntry = (id: string, field: keyof SitemapUrlEntry, val: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleProcessBulk = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean);
    const newItems: SitemapUrlEntry[] = lines.map((url, idx) => {
      let formattedUrl = url;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      return {
        id: `${Date.now()}_${idx}`,
        loc: formattedUrl,
        lastmod: today,
        changefreq: 'weekly',
        priority: idx === 0 ? '1.0' : '0.8'
      };
    });
    setEntries(newItems);
    setActiveTab('table');
    onShowToast(`Imported ${newItems.length} URLs!`);
  };

  const generateSitemapXml = (): string => {
    const urlsXml = entries
      .filter(e => e.loc.trim().length > 0)
      .map(e => {
        return `  <url>
    <loc>${e.loc.trim()}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  };

  const outputCode = generateSitemapXml();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    onShowToast('Copied sitemap XML to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded sitemap.xml!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* Tabs / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Visual URL Builder ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bulk'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Bulk Paste URLs
          </button>
        </div>

        {activeTab === 'table' && (
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add URL
          </button>
        )}
      </div>

      {/* Mode 1: Table editor */}
      {activeTab === 'table' ? (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-x-auto shadow-xs">
          <table className="w-full text-xs text-left min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-2 px-2">Page URL (&lt;loc&gt;)</th>
                <th className="py-2 px-2 w-32">Last Mod</th>
                <th className="py-2 px-2 w-28">Frequency</th>
                <th className="py-2 px-2 w-20">Priority</th>
                <th className="py-2 px-2 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {entries.map(entry => (
                <tr key={entry.id}>
                  <td className="py-2 px-2">
                    <input
                      type="url"
                      value={entry.loc}
                      onChange={(e) => handleUpdateEntry(entry.id, 'loc', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="date"
                      value={entry.lastmod}
                      onChange={(e) => handleUpdateEntry(entry.id, 'lastmod', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={entry.changefreq}
                      onChange={(e) => handleUpdateEntry(entry.id, 'changefreq', e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                      <option value="hourly">hourly</option>
                      <option value="always">always</option>
                      <option value="never">never</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={entry.priority}
                      onChange={(e) => handleUpdateEntry(entry.id, 'priority', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    >
                      {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => handleRemoveRow(entry.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Mode 2: Bulk paste */
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Paste URLs (One URL per line):
          </label>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            rows={8}
            placeholder={`https://zubware.com/\nhttps://zubware.com/typing-speed-test.html\nhttps://zubware.com/about.html`}
            className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
          <div className="flex justify-end">
            <button
              onClick={handleProcessBulk}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
            >
              Parse and Import URLs
            </button>
          </div>
        </div>
      )}

      {/* Live XML Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5" /> Generated sitemap.xml
          </span>
          <span>Google Search Console ready</span>
        </div>
        <textarea
          value={outputCode}
          readOnly
          rows={10}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none resize-y"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download sitemap.xml</span>
        </button>
      </div>
    </div>
  );
};
