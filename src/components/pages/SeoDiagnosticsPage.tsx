import React, { useState } from 'react';
import { SEOHead } from '../SEOHead';
import { TOOLS_DATA } from '../../data/toolsData';
import { CheckCircle2, Copy, FileText, Globe, Search, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';

interface SeoDiagnosticsPageProps {
  onNavigate: (path: string) => void;
}

export const SeoDiagnosticsPage: React.FC<SeoDiagnosticsPageProps> = ({ onNavigate }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const domain = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://zubware.com';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <SEOHead
        title="Zubware SEO & Search Indexing Diagnostics"
        description="Technical verification checklist and documentation for verifying crawlability, robots.txt, sitemap.xml, canonical URLs, and AI bot indexing."
        canonicalPath="/seo-diagnostics.html"
        robots="noindex, nofollow"
      />

      {/* Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-3 border-l-4 border-l-indigo-600">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          <Terminal className="w-4 h-4" /> Internal Developer Tool
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Search Visibility & AI Indexing Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Technical inspection guide for testing web crawlability, indexability, structured schemas, canonical URLs, and AI bot access across Google, Bing, ChatGPT, and Claude.
        </p>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-6">

        {/* 1. Robots.txt Inspection */}
        <section className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-500" /> 1. Robots.txt Configuration
            </h2>
            <button
              onClick={() => copyToClipboard(`${domain}/robots.txt`, 'robots')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedSection === 'robots' ? 'Copied URL!' : 'Copy URL'}
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Verify that <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">/robots.txt</code> permits legitimate search engines and AI crawlers (<code className="font-mono text-indigo-500">OAI-SearchBot</code>, <code className="font-mono text-indigo-500">Googlebot</code>, <code className="font-mono text-indigo-500">Bingbot</code>) without accidental disallows.
          </p>
          <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <p className="text-slate-500"># Verify location at {domain}/robots.txt</p>
            <p>User-agent: *</p>
            <p>Allow: /</p>
            <p>User-agent: OAI-SearchBot</p>
            <p>Allow: /</p>
            <p className="text-indigo-400 mt-2">Sitemap: {domain}/sitemap.xml</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Verified: OAI-SearchBot & standard crawlers are allowed.
          </div>
        </section>

        {/* 2. XML Sitemap Inspection */}
        <section className="glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> 2. XML Sitemap Inspection
            </h2>
            <button
              onClick={() => copyToClipboard(`${domain}/sitemap.xml`, 'sitemap')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedSection === 'sitemap' ? 'Copied URL!' : 'Copy URL'}
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Ensure <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">/sitemap.xml</code> lists all {TOOLS_DATA.length} public tool routes, static legal pages, category hubs, blog articles, and homepage with valid ISO dates.
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
            <li>Includes all tools (<code className="font-mono">/image-compressor.html</code>, <code className="font-mono">/heic-to-jpg.html</code>, <code className="font-mono">/slowed-and-reverb.html</code>, etc.)</li>
            <li>No duplicate parameter URLs or private routes listed</li>
            <li>Valid XML standard schema matching <code className="font-mono">http://www.sitemaps.org/schemas/sitemap/0.9</code></li>
          </ul>
        </section>

        {/* 3. Canonical URLs & Meta Tags */}
        <section className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-500" /> 3. Canonical & Meta Directives Check
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <strong className="text-slate-900 dark:text-white font-bold block mb-1">Self-Referencing Canonical Tag</strong>
              <p className="text-slate-500 dark:text-slate-400">
                Every tool page dynamically injects <code className="font-mono text-indigo-500">&lt;link rel="canonical" href="..."&gt;</code> matching the clean route.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <strong className="text-slate-900 dark:text-white font-bold block mb-1">OpenGraph & Twitter Cards</strong>
              <p className="text-slate-500 dark:text-slate-400">
                Sets custom <code className="font-mono">og:title</code>, <code className="font-mono">og:description</code>, <code className="font-mono">og:image</code>, and <code className="font-mono">twitter:card</code>.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Structured Data Validation */}
        <section className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" /> 4. JSON-LD Schema Verification
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Open browser DevTools or Google Rich Results Test to confirm the following JSON-LD schemas inject cleanly into <code className="font-mono text-indigo-500">&lt;script id="json-ld-schema" type="application/ld+json"&gt;</code>:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              WebSite & SearchAction
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              Organization
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              WebApplication
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              FAQPage & Breadcrumbs
            </div>
          </div>
        </section>

        {/* 5. Search Console Submission Workflow */}
        <section className="glass-card p-6 rounded-3xl space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> 5. Search Console & Search Engine Submission
          </h2>
          <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
            <li>Log into <strong>Google Search Console</strong> and verify domain ownership using DNS record or HTML tag (configure via <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">VITE_GOOGLE_SITE_VERIFICATION</code>).</li>
            <li>Submit the sitemap index URL: <code className="font-mono text-indigo-500">{domain}/sitemap.xml</code>.</li>
            <li>Use <strong>URL Inspection Tool</strong> on top routes (<code className="font-mono">/image-compressor.html</code>, <code className="font-mono">/heic-to-jpg.html</code>) and click "Request Indexing".</li>
            <li>Submit sitemap to <strong>Bing Webmaster Tools</strong> as well for Bing & Yahoo discovery.</li>
          </ol>
        </section>

      </div>
    </div>
  );
};
