import React, { useState, useEffect } from 'react';
import { Copy, Check, Link2, ExternalLink, RotateCcw, Trash2, History, Sparkles } from 'lucide-react';

interface UtmBuilderToolProps {
  onShowToast: (message: string) => void;
}

interface SavedLink {
  id: string;
  url: string;
  source: string;
  medium: string;
  name: string;
  timestamp: string;
}

export const UtmBuilderTool: React.FC<UtmBuilderToolProps> = ({ onShowToast }) => {
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://zubware.com/typing-speed-test.html');
  const [source, setSource] = useState<string>('google');
  const [medium, setMedium] = useState<string>('cpc');
  const [campaign, setCampaign] = useState<string>('spring_promo_2026');
  const [term, setTerm] = useState<string>('typing+test+speed');
  const [content, setContent] = useState<string>('hero_cta_button');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>(() => {
    try {
      const stored = localStorage.getItem('splitdrop_utm_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const applyPreset = (presetSource: string, presetMedium: string) => {
    setSource(presetSource);
    setMedium(presetMedium);
    onShowToast(`Applied ${presetSource} preset`);
  };

  const generateUtmUrl = (): string => {
    if (!websiteUrl.trim()) return '';

    try {
      let base = websiteUrl.trim();
      if (!/^https?:\/\//i.test(base)) {
        base = `https://${base}`;
      }

      const urlObj = new URL(base);

      if (source.trim()) urlObj.searchParams.set('utm_source', source.trim());
      if (medium.trim()) urlObj.searchParams.set('utm_medium', medium.trim());
      if (campaign.trim()) urlObj.searchParams.set('utm_campaign', campaign.trim());
      if (term.trim()) urlObj.searchParams.set('utm_term', term.trim());
      if (content.trim()) urlObj.searchParams.set('utm_content', content.trim());

      return urlObj.toString();
    } catch {
      // Fallback manual query string concatenation if URL parser fails
      const params: string[] = [];
      if (source.trim()) params.push(`utm_source=${encodeURIComponent(source.trim())}`);
      if (medium.trim()) params.push(`utm_medium=${encodeURIComponent(medium.trim())}`);
      if (campaign.trim()) params.push(`utm_campaign=${encodeURIComponent(campaign.trim())}`);
      if (term.trim()) params.push(`utm_term=${encodeURIComponent(term.trim())}`);
      if (content.trim()) params.push(`utm_content=${encodeURIComponent(content.trim())}`);

      const sep = websiteUrl.includes('?') ? '&' : '?';
      return params.length > 0 ? `${websiteUrl}${sep}${params.join('&')}` : websiteUrl;
    }
  };

  const finalUrl = generateUtmUrl();

  const handleCopy = () => {
    if (!finalUrl) return;
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    onShowToast('UTM campaign link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);

    // Save to history
    if (source || campaign) {
      const newEntry: SavedLink = {
        id: Date.now().toString(),
        url: finalUrl,
        source: source || 'direct',
        medium: medium || 'none',
        name: campaign || 'unnamed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setSavedLinks(prev => {
        const updated = [newEntry, ...prev.filter(l => l.url !== finalUrl)].slice(0, 10);
        try {
          localStorage.setItem('splitdrop_utm_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  };

  const handleClearHistory = () => {
    setSavedLinks([]);
    try {
      localStorage.removeItem('splitdrop_utm_history');
    } catch {}
    onShowToast('Cleared link history');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Channel Presets */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Popular Presets:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('google', 'cpc')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            Google Ads (CPC)
          </button>
          <button
            onClick={() => applyPreset('facebook', 'social_ad')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            Facebook / Meta Ads
          </button>
          <button
            onClick={() => applyPreset('newsletter', 'email')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            Email Newsletter
          </button>
          <button
            onClick={() => applyPreset('linkedin', 'sponsored_post')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            LinkedIn Sponsored
          </button>
          <button
            onClick={() => applyPreset('twitter', 'social')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all"
          >
            Twitter / X
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Base Website URL */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Website URL <span className="text-rose-500">*</span>
          </label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://example.com/landing-page"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Campaign Source & Medium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Source (<code className="text-indigo-500 font-mono">utm_source</code>) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. google, newsletter, facebook"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Medium (<code className="text-indigo-500 font-mono">utm_medium</code>) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. cpc, email, social, banner"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Campaign Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Campaign Name (<code className="text-indigo-500 font-mono">utm_campaign</code>)
          </label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            placeholder="e.g. spring_sale, black_friday_2026"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        {/* Campaign Term & Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Term (<code className="text-indigo-500 font-mono">utm_term</code>)
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. running+shoes, seo+tools"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Content (<code className="text-indigo-500 font-mono">utm_content</code>)
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. logolink, sidebar_button"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Generated Result Card */}
      <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-slate-850 border border-indigo-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-4 h-4" /> Generated Campaign URL
          </span>
          <span className="text-xs text-slate-500 font-mono">{finalUrl.length} chars</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white break-all select-all">
          {finalUrl || 'Please specify a website URL above...'}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            disabled={!finalUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied URL!' : 'Copy Campaign URL'}</span>
          </button>
        </div>
      </div>

      {/* Recent Link History */}
      {savedLinks.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span>Recent Generated Links ({savedLinks.length})</span>
            </div>
            <button
              onClick={handleClearHistory}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear History
            </button>
          </div>

          <div className="space-y-2">
            {savedLinks.map(link => (
              <div
                key={link.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/60 text-xs"
              >
                <div className="truncate mr-3 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{link.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({link.source} / {link.medium})</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">{link.url}</div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(link.url);
                    onShowToast('Copied from history!');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 text-xs shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
