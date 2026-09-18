import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, ArrowLeftRight, Sparkles } from 'lucide-react';

interface TextReverserToolProps {
  onShowToast: (message: string) => void;
}

export const TextReverserTool: React.FC<TextReverserToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    'SplitDrop Online Tools\nTransform and reverse your text easily!'
  );
  const [mode, setMode] = useState<'char' | 'word' | 'line'>('char');
  const [preserveLineBreaks, setPreserveLineBreaks] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const getReversedText = (): string => {
    if (!inputText) return '';

    if (mode === 'char') {
      if (preserveLineBreaks) {
        return inputText
          .split('\n')
          .map(line => Array.from(line).reverse().join(''))
          .join('\n');
      }
      return Array.from(inputText).reverse().join('');
    }

    if (mode === 'word') {
      if (preserveLineBreaks) {
        return inputText
          .split('\n')
          .map(line => line.split(/(\s+)/).reverse().join(''))
          .join('\n');
      }
      return inputText.split(/(\s+)/).reverse().join('');
    }

    if (mode === 'line') {
      return inputText.split('\n').reverse().join('\n');
    }

    return inputText;
  };

  const outputText = getReversedText();

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Reversed text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reversed_${mode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  const handleClear = () => {
    setInputText('');
    onShowToast('Cleared text');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Controls & Options */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Reverse Mode:
          </span>
          {(['char', 'word', 'line'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                mode === m
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {m === 'char' ? 'Reverse Characters' : m === 'word' ? 'Reverse Words' : 'Reverse Line Order'}
            </button>
          ))}
        </div>

        {mode !== 'line' && (
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={preserveLineBreaks}
              onChange={(e) => setPreserveLineBreaks(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Preserve Line Breaks</span>
          </label>
        )}
      </div>

      {/* Editor Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Original Input</span>
            <div className="flex items-center gap-2">
              <span>{inputText.length} chars</span>
              {inputText && (
                <button
                  onClick={handleClear}
                  className="text-rose-500 hover:text-rose-600 flex items-center gap-1 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text here to reverse..."
            rows={10}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" /> Reversed Output
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            placeholder="Reversed result will appear here..."
            rows={10}
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
          <span>{copied ? 'Copied!' : 'Copy Reversed Text'}</span>
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
