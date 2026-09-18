import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, WrapText, ArrowDown } from 'lucide-react';

interface RemoveLineBreaksToolProps {
  onShowToast: (message: string) => void;
}

export const RemoveLineBreaksTool: React.FC<RemoveLineBreaksToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `SplitDrop makes it easy\nto format and clean\nline breaks from any text.\n\nParagraphs can be preserved\nwith an intelligent double break option.`
  );
  const [replaceMode, setReplaceMode] = useState<'space' | 'none' | 'custom'>('space');
  const [customSeparator, setCustomSeparator] = useState<string>(', ');
  const [preserveParagraphs, setPreserveParagraphs] = useState<boolean>(true);
  const [trimExtraSpaces, setTrimExtraSpaces] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const getCleanedText = (): string => {
    if (!inputText) return '';

    const sep = replaceMode === 'space' ? ' ' : replaceMode === 'none' ? '' : customSeparator;

    if (preserveParagraphs) {
      // Split by double line breaks (paragraphs)
      const paragraphs = inputText.split(/\n\s*\n/);
      return paragraphs
        .map(p => {
          let line = p.replace(/\r?\n|\r/g, sep);
          if (trimExtraSpaces) {
            line = line.replace(/[ \t]+/g, ' ').trim();
          }
          return line;
        })
        .join('\n\n');
    } else {
      let result = inputText.replace(/\r?\n|\r/g, sep);
      if (trimExtraSpaces) {
        result = result.replace(/[ \t]+/g, ' ').trim();
      }
      return result;
    }
  };

  const outputText = getCleanedText();

  // Statistics
  const originalLineCount = inputText ? inputText.split('\n').length : 0;
  const newLineCount = outputText ? outputText.split('\n').length : 0;
  const removedBreaks = Math.max(0, originalLineCount - newLineCount);

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
    a.download = 'no_line_breaks.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Replace Breaks With:
            </span>
            <button
              onClick={() => setReplaceMode('space')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                replaceMode === 'space'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Single Space
            </button>
            <button
              onClick={() => setReplaceMode('none')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                replaceMode === 'none'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              No Space (Join Directly)
            </button>
            <button
              onClick={() => setReplaceMode('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                replaceMode === 'custom'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Custom Separator
            </button>
          </div>

          {replaceMode === 'custom' && (
            <input
              type="text"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder="e.g. , or |"
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white w-28"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={preserveParagraphs}
              onChange={(e) => setPreserveParagraphs(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Preserve Paragraphs (Double Line Breaks)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimExtraSpaces}
              onChange={(e) => setTrimExtraSpaces(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Collapse Multiple Spaces into Single Space</span>
          </label>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Original Lines</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{originalLineCount}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Result Lines</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{newLineCount}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Line Breaks Removed</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{removedBreaks}</p>
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
            placeholder="Paste text with unwanted line breaks..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Cleaned Output</span>
            <span>{outputText.length} characters</span>
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

      {/* Buttons */}
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
