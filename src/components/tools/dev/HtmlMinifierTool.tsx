import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Code, Zap } from 'lucide-react';

interface HtmlMinifierToolProps {
  onShowToast: (message: string) => void;
}

export const HtmlMinifierTool: React.FC<HtmlMinifierToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(`<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Zubware Primary Meta Tags -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zubware Tools</title>
  </head>
  <body>
    <header class="header-container">
      <h1>Free Online Developer Utilities</h1>
      <p>Instant client-side privacy-first web utilities.</p>
    </header>
  </body>
</html>
`);
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const minifyHtml = (html: string): string => {
    if (!html.trim()) return '';

    let res = html;

    // Preserve <pre>, <code>, <script>, <style> blocks
    const placeholders: string[] = [];
    res = res.replace(/<(pre|code|script|style)[\s\S]*?<\/\1>/gi, match => {
      placeholders.push(match);
      return `___PRESERVED_BLOCK_${placeholders.length - 1}___`;
    });

    if (removeComments) {
      // Remove comments (excluding conditional comments)
      res = res.replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, '');
    }

    if (collapseWhitespace) {
      // Remove spaces between tags
      res = res.replace(/>\s+</g, '><');
      // Collapse multiple whitespace
      res = res.replace(/\s{2,}/g, ' ');
      // Remove whitespace around attribute equals
      res = res.replace(/\s*=\s*/g, '=');
    }

    // Restore preserved blocks
    placeholders.forEach((block, idx) => {
      res = res.replace(`___PRESERVED_BLOCK_${idx}___`, block);
    });

    return res.trim();
  };

  const outputText = minifyHtml(inputText);

  const originalBytes = new TextEncoder().encode(inputText).length;
  const minifiedBytes = new TextEncoder().encode(outputText).length;
  const savedBytes = Math.max(0, originalBytes - minifiedBytes);
  const savedPercent = originalBytes > 0 ? Math.round((savedBytes / originalBytes) * 100) : 0;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Minified HTML copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.min.html';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded index.min.html!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={(e) => setRemoveComments(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Remove HTML Comments (&lt;!-- ... --&gt;)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={collapseWhitespace}
            onChange={(e) => setCollapseWhitespace(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Collapse Intra-Tag Whitespace</span>
        </label>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Original Size</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{originalBytes} B</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Minified Size</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{minifiedBytes} B</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bytes Saved</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{savedBytes} B</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Compression</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">{savedPercent}%</p>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Raw HTML Code</span>
            {inputText && (
              <button
                onClick={() => { setInputText(''); onShowToast('Cleared'); }}
                className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            placeholder="Paste your unminified HTML documents here..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Minified HTML Output
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={12}
            placeholder="Minified production HTML will appear here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          disabled={!outputText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Minified HTML'}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!outputText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download index.min.html</span>
        </button>
      </div>
    </div>
  );
};
