import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, FileCode2, Sparkles, Zap } from 'lucide-react';

interface JavascriptMinifierToolProps {
  onShowToast: (message: string) => void;
}

export const JavascriptMinifierTool: React.FC<JavascriptMinifierToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(`// Calculate Fibonacci sequence numbers
function getFibonacci(n) {
  /* Guard against negative input */
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    let temp = a + b;
    a = b;
    b = temp;
  }

  return b;
}

console.log("Result:", getFibonacci(10));
`);
  const [copied, setCopied] = useState<boolean>(false);

  const minifyJs = (code: string): string => {
    if (!code.trim()) return '';

    try {
      // 1. Remove single-line comments (ignoring URLs http://)
      let cleaned = code.replace(/(^|[^\:])\/\/.*$/gm, '$1');

      // 2. Remove multi-line block comments
      cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');

      // 3. Remove whitespace around operators, braces, parens, brackets, commas, colons, semicolons
      cleaned = cleaned
        .replace(/\s*([\(\)\{\}\[\]\,\;\:\?\=])\s*/g, '$1')
        .replace(/\s*([\+\-\*\/\%\|\&\^])\s*/g, '$1')
        // Preserve needed space after keywords (return, let, const, var, function, if, for, while, in, of, typeof, instanceof, new)
        .replace(/\b(return|var|let|const|function|typeof|instanceof|new|throw|delete|in|of|case|yield|await|default|void)\s+/g, '$1 ')
        // Normalize multiple line breaks/spaces
        .replace(/[\r\n]+/g, ';')
        .replace(/;{2,}/g, ';')
        .replace(/\s+/g, ' ')
        .trim();

      return cleaned;
    } catch {
      return code;
    }
  };

  const outputText = minifyJs(inputText);

  const originalBytes = new TextEncoder().encode(inputText).length;
  const minifiedBytes = new TextEncoder().encode(outputText).length;
  const savedBytes = Math.max(0, originalBytes - minifiedBytes);
  const savedPercent = originalBytes > 0 ? Math.round((savedBytes / originalBytes) * 100) : 0;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Minified JS copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.min.js';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded script.min.js!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
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
            <span>Raw JavaScript Code</span>
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
            placeholder="Paste your unminified JavaScript / TypeScript code here..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Minified JS Output
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={12}
            placeholder="Minified production script will appear here..."
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
          <span>{copied ? 'Copied!' : 'Copy Minified JS'}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!outputText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download script.min.js</span>
        </button>
      </div>
    </div>
  );
};
