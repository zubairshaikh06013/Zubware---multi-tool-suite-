import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, Globe, Search, Share2, Sparkles } from 'lucide-react';

interface MetaTagGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const MetaTagGeneratorTool: React.FC<MetaTagGeneratorToolProps> = ({ onShowToast }) => {
  const [title, setTitle] = useState<string>('Zubware - Free Online Tools & Multi-Tool Suite');
  const [description, setDescription] = useState<string>(
    'Zubware provides 300+ free, fast, and privacy-focused online web tools for file conversion, image editing, developer utilities, and productivity right in your browser.'
  );
  const [canonicalUrl, setCanonicalUrl] = useState<string>('https://zubware.com');
  const [author, setAuthor] = useState<string>('Zubware Team');
  const [robotsIndex, setRobotsIndex] = useState<boolean>(true);
  const [robotsFollow, setRobotsFollow] = useState<boolean>(true);
  const [themeColor, setThemeColor] = useState<string>('#4f46e5');
  const [ogType, setOgType] = useState<string>('website');
  const [ogImage, setOgImage] = useState<string>('https://zubware.com/og-banner.png');
  const [twitterCard, setTwitterCard] = useState<string>('summary_large_image');
  const [twitterSite, setTwitterSite] = useState<string>('@zubware');
  const [copied, setCopied] = useState<boolean>(false);

  const generateMetaHtml = (): string => {
    const robotsContent = `${robotsIndex ? 'index' : 'noindex'}, ${robotsFollow ? 'follow' : 'nofollow'}`;
    const tags: string[] = [
      '<!-- Primary Meta Tags -->',
      `<title>${title}</title>`,
      `<meta name="title" content="${title}" />`,
      `<meta name="description" content="${description}" />`,
      author ? `<meta name="author" content="${author}" />` : '',
      `<meta name="robots" content="${robotsContent}" />`,
      canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : '',
      themeColor ? `<meta name="theme-color" content="${themeColor}" />` : '',
      '',
      '<!-- Open Graph / Facebook -->',
      `<meta property="og:type" content="${ogType}" />`,
      canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}" />` : '',
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      ogImage ? `<meta property="og:image" content="${ogImage}" />` : '',
      '',
      '<!-- Twitter -->',
      `<meta name="twitter:card" content="${twitterCard}" />`,
      canonicalUrl ? `<meta name="twitter:url" content="${canonicalUrl}" />` : '',
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : '',
      twitterSite ? `<meta name="twitter:site" content="${twitterSite}" />` : ''
    ].filter(Boolean);

    return tags.join('\n');
  };

  const outputCode = generateMetaHtml();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    onShowToast('Meta tags copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded meta-tags.html!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
      {/* 2-Column Form & Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls - 7 Cols */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Standard Meta Tags
            </h3>

            {/* Page Title */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Page Title</label>
                <span className={`font-mono ${title.length > 60 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {title.length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Meta Description</label>
                <span className={`font-mono ${description.length > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                  {description.length} / 160 chars
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>

            {/* Canonical URL & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Canonical URL</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Robots Directives & Theme Color */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={robotsFollow}
                    onChange={(e) => setRobotsFollow(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Follow</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">Theme Color:</label>
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{themeColor}</span>
              </div>
            </div>
          </div>

          {/* Social Open Graph / Twitter */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Social Sharing & Open Graph
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">OG Type</label>
                <select
                  value={ogType}
                  onChange={(e) => setOgType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="product">product</option>
                  <option value="profile">profile</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Twitter Card</label>
                <select
                  value={twitterCard}
                  onChange={(e) => setTwitterCard(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">OG Image URL</label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Twitter @Handle</label>
                <input
                  type="text"
                  value={twitterSite}
                  onChange={(e) => setTwitterSite(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Previews - 5 Cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Google SERP Preview */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>Google Search Result Preview</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-500 truncate">{canonicalUrl || 'https://example.com'}</div>
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate line-clamp-1">
                {title || 'Page Title Appears Here'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {description || 'Page meta description snippet will appear in search results like this.'}
              </div>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              <Share2 className="w-3.5 h-3.5" />
              <span>Social Media Card Preview</span>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-850">
              <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400 relative overflow-hidden">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                ) : (
                  <span>1200 × 630 OG Image Preview</span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate block">
                  {canonicalUrl ? new URL(canonicalUrl).hostname : 'example.com'}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {title || 'OG Title'}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                  {description || 'OG Description snippet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Code Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Generated HTML Meta Tags
          </span>
          <span>Paste directly inside your &lt;head&gt; tag</span>
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
          <span>{copied ? 'Copied HTML!' : 'Copy Meta Tags'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download meta-tags.html</span>
        </button>
      </div>
    </div>
  );
};
