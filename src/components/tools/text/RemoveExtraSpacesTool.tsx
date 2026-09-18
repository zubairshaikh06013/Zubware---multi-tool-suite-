import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Space, Sparkles } from 'lucide-react';

interface RemoveExtraSpacesToolProps {
  onShowToast: (message: string) => void;
}

export const RemoveExtraSpacesTool: React.FC<RemoveExtraSpacesToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `   This   text     contains  lots   of   extra    spaces.   \n\n\tTabs   and      trailing   whitespace   can   also  be   cleaned.   `
  );
  const [removeDuplicateSpaces, setRemoveDuplicateSpaces] = useState<boolean>(true);
  const [trimLeadingSpaces, setTrimLeadingSpaces] = useState<boolean>(true);
  const [trimTrailingSpaces, setTrimTrailingSpaces] = useState<boolean>(true);
  const [normalizeTabs, setNormalizeTabs] = useState<boolean>(true);
  const [preserveLineBreaks, setPreserveLineBreaks] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const getCleanedText = (): string => {
    if (!inputText) return '';
    let text = inputText;

    if (normalizeTabs) {
      text = text.replace(/\t/g, ' ');
    }

    if (preserveLineBreaks) {
      return text
        .split('\n')
        .map(line => {
          let l = line;
          if (removeDuplicateSpaces) {
            l = l.replace(/[ ]{2,}/g, ' ');
          }
          if (trimLeadingSpaces) {
            l = l.replace(/^[ ]+/, '');
          }
          if (trimTrailingSpaces) {
            l = l.replace(/[ ]+$/, '');
          }
          return l;
        })
        .join('\n');
    } else {
      let l = text.replace(/\r?\n|\r/g, ' ');
      if (removeDuplicateSpaces) {
        l = l.replace(/[ ]{2,}/g, ' ');
      }
      if (trimLeadingSpaces) {
        l = l.trimStart();
      }
      if (trimTrailingSpaces) {
        l = l.trimEnd();
      }
      return l;
    }
  };

  const outputText = getCleanedText();

  // Stats
  const originalSpaces = (inputText.match(/\s/g) || []).length;
  const newSpaces = (outputText.match(/\s/g) || []).length;
  const charsSaved = Math.max(0, inputText.length - outputText.length);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Cleaned text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'normalized_spaces.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Cleaning Options:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeDuplicateSpaces}
              onChange={(e) => setRemoveDuplicateSpaces(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Collapse Duplicate Spaces</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimLeadingSpaces}
              onChange={(e) => setTrimLeadingSpaces(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Trim Leading Spaces</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimTrailingSpaces}
              onChange={(e) => setTrimTrailingSpaces(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Trim Trailing Spaces</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={normalizeTabs}
              onChange={(e) => setNormalizeTabs(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Convert Tabs to Spaces</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={preserveLineBreaks}
              onChange={(e) => setPreserveLineBreaks(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Preserve Line Breaks</span>
          </label>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Original Spaces</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{originalSpaces}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Result Spaces</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{newSpaces}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spaces Removed</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{charsSaved}</p>
        </div>
      </div>

      {/* Side by side textareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Input Text</span>
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
            rows={10}
            placeholder="Paste text with excessive spaces..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Normalized Output</span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder="Cleaned text will appear here..."
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
          <span>{copied ? 'Copied!' : 'Copy Cleaned Text'}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!outputText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download .txt</span>
        </button>
      </div>
    </div>
  );
};
