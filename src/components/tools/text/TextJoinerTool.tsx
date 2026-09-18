import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Merge, Sparkles } from 'lucide-react';

interface TextJoinerToolProps {
  onShowToast: (message: string) => void;
}

export const TextJoinerTool: React.FC<TextJoinerToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `Apple\nBanana\nOrange\nMango\nPineapple`
  );
  const [separator, setSeparator] = useState<'comma' | 'space' | 'newline' | 'semicolon' | 'pipe' | 'custom'>('comma');
  const [customSeparator, setCustomSeparator] = useState<string>(' | ');
  const [trimItems, setTrimItems] = useState<boolean>(true);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [quoteWrap, setQuoteWrap] = useState<'none' | 'single' | 'double'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  const getJoinedText = (): string => {
    if (!inputText) return '';
    let items = inputText.split('\n');

    if (trimItems) {
      items = items.map(i => i.trim());
    }

    if (removeEmpty) {
      items = items.filter(Boolean);
    }

    if (quoteWrap === 'single') {
      items = items.map(i => `'${i}'`);
    } else if (quoteWrap === 'double') {
      items = items.map(i => `"${i}"`);
    }

    const sep = separator === 'comma'
      ? ', '
      : separator === 'space'
      ? ' '
      : separator === 'newline'
      ? '\n'
      : separator === 'semicolon'
      ? '; '
      : separator === 'pipe'
      ? ' | '
      : customSeparator;

    return items.join(sep);
  };

  const outputText = getJoinedText();
  const rawItemCount = inputText.split('\n').length;
  const joinedItemCount = inputText.split('\n').filter(l => trimItems ? l.trim() : l).length;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Joined text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'joined_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Join With:
            </span>
            {(['comma', 'space', 'newline', 'semicolon', 'pipe', 'custom'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSeparator(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  separator === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {s === 'comma' ? 'Comma (, )' : s === 'newline' ? 'New Line' : s}
              </button>
            ))}
          </div>

          {separator === 'custom' && (
            <input
              type="text"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder="e.g.  ::  or  - "
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white w-28"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Omit Empty Lines</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={trimItems}
              onChange={(e) => setTrimItems(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Trim Whitespace</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Wrap Items:</span>
            {(['none', 'single', 'double'] as const).map(q => (
              <button
                key={q}
                onClick={() => setQuoteWrap(q)}
                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                  quoteWrap === q
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {q === 'none' ? 'None' : q === 'single' ? "'item'" : '"item"'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Input Lines ({rawItemCount} rows)</span>
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
            rows={10}
            placeholder="Enter one item per line to join together..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              Joined Output ({joinedItemCount} items)
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder="Combined string will appear here..."
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
          <span>{copied ? 'Copied!' : 'Copy Joined Text'}</span>
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
