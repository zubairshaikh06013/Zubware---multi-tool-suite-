import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Plus, FileText, Sparkles, ShieldCheck } from 'lucide-react';

interface RobotsTxtGeneratorToolProps {
  onShowToast: (message: string) => void;
}

interface RuleItem {
  id: string;
  type: 'Disallow' | 'Allow';
  path: string;
}

export const RobotsTxtGeneratorTool: React.FC<RobotsTxtGeneratorToolProps> = ({ onShowToast }) => {
  const [userAgent, setUserAgent] = useState<string>('*');
  const [crawlDelay, setCrawlDelay] = useState<string>('');
  const [sitemapUrl, setSitemapUrl] = useState<string>('https://zubware.com/sitemap.xml');
  const [rules, setRules] = useState<RuleItem[]>([
    { id: '1', type: 'Disallow', path: '/admin/' },
    { id: '2', type: 'Disallow', path: '/api/' },
    { id: '3', type: 'Disallow', path: '/*.json$' },
    { id: '4', type: 'Allow', path: '/public/' }
  ]);
  const [newRuleType, setNewRuleType] = useState<'Disallow' | 'Allow'>('Disallow');
  const [newRulePath, setNewRulePath] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const applyPreset = (preset: 'allowAll' | 'disallowAll' | 'wordpress' | 'ecommerce') => {
    switch (preset) {
      case 'allowAll':
        setRules([{ id: '1', type: 'Disallow', path: '' }]);
        setCrawlDelay('');
        onShowToast('Applied "Allow All" preset');
        break;
      case 'disallowAll':
        setRules([{ id: '1', type: 'Disallow', path: '/' }]);
        onShowToast('Applied "Disallow All" preset');
        break;
      case 'wordpress':
        setRules([
          { id: '1', type: 'Disallow', path: '/wp-admin/' },
          { id: '2', type: 'Allow', path: '/wp-admin/admin-ajax.php' },
          { id: '3', type: 'Disallow', path: '/wp-includes/' }
        ]);
        onShowToast('Applied "WordPress" preset');
        break;
      case 'ecommerce':
        setRules([
          { id: '1', type: 'Disallow', path: '/cart/' },
          { id: '2', type: 'Disallow', path: '/checkout/' },
          { id: '3', type: 'Disallow', path: '/account/' },
          { id: '4', type: 'Disallow', path: '/*?*sort=' }
        ]);
        onShowToast('Applied "E-Commerce" preset');
        break;
    }
  };

  const handleAddRule = () => {
    if (!newRulePath.trim()) return;
    setRules(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: newRuleType,
        path: newRulePath.trim()
      }
    ]);
    setNewRulePath('');
  };

  const handleRemoveRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const generateRobotsTxt = (): string => {
    const lines: string[] = [
      '# Robots.txt generated via Zubware SEO Tools',
      `User-agent: ${userAgent.trim() || '*'}`
    ];

    if (crawlDelay.trim()) {
      lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
    }

    rules.forEach(rule => {
      lines.push(`${rule.type}: ${rule.path}`);
    });

    if (sitemapUrl.trim()) {
      lines.push('');
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    return lines.join('\n');
  };

  const outputCode = generateRobotsTxt();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    onShowToast('Copied robots.txt to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded robots.txt file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Presets Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('allowAll')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            Allow All Crawlers
          </button>
          <button
            onClick={() => applyPreset('disallowAll')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            Disallow All (Private / Staging)
          </button>
          <button
            onClick={() => applyPreset('wordpress')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            WordPress Standard
          </button>
          <button
            onClick={() => applyPreset('ecommerce')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            E-Commerce Safe
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Settings & Rules */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">User-Agent</label>
                <input
                  type="text"
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  placeholder="* or Googlebot"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Crawl-Delay (Seconds)</label>
                <input
                  type="number"
                  min={0}
                  value={crawlDelay}
                  onChange={(e) => setCrawlDelay(e.target.value)}
                  placeholder="Optional (e.g. 5)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sitemap URL</label>
              <input
                type="url"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Add Rule Form */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Add Directive Path:
            </h4>
            <div className="flex gap-2">
              <select
                value={newRuleType}
                onChange={(e) => setNewRuleType(e.target.value as 'Disallow' | 'Allow')}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Disallow">Disallow</option>
                <option value="Allow">Allow</option>
              </select>
              <input
                type="text"
                value={newRulePath}
                onChange={(e) => setNewRulePath(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddRule(); }}
                placeholder="/private-path/ or /*.pdf$"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddRule}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* List of active rules */}
            <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto">
              {rules.map(rule => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span className={rule.type === 'Disallow' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {rule.type}:
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 truncate">{rule.path || '/ (none)'}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveRule(rule.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Generated File */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Live robots.txt Output
            </span>
            <span>Root domain file</span>
          </div>
          <textarea
            value={outputCode}
            readOnly
            rows={15}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy robots.txt'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download robots.txt</span>
        </button>
      </div>
    </div>
  );
};
