import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Repeat, Sparkles } from 'lucide-react';

interface TextRepeaterToolProps {
  onShowToast: (message: string) => void;
}

export const TextRepeaterTool: React.FC<TextRepeaterToolProps> = ({ onShowToast }) => {
  const [text, setText] = useState<string>('Hello World! ');
  const [repeatCount, setRepeatCount] = useState<number>(10);
  const [separator, setSeparator] = useState<'newline' | 'space' | 'comma' | 'custom'>('newline');
  const [customSeparator, setCustomSeparator] = useState<string>(' - ');
  const [addLineNumbers, setAddLineNumbers] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const MAX_REPEATS = 10000;

  const getRepeatedText = (): string => {
    if (!text) return '';
    const safeCount = Math.min(Math.max(1, repeatCount), MAX_REPEATS);

    const sep = separator === 'newline'
      ? '\n'
      : separator === 'space'
      ? ' '
      : separator === 'comma'
      ? ', '
      : customSeparator;

    const items: string[] = [];
    for (let i = 1; i <= safeCount; i++) {
      if (addLineNumbers) {
        items.push(`${i}. ${text}`);
      } else {
        items.push(text);
      }
    }

    return items.join(sep);
  };

  const outputText = getRepeatedText();

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast(`Copied ${repeatCount} repetitions!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repeated_${repeatCount}x.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded repeated text file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Settings Grid */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Repetition count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Repeat Count (Max {MAX_REPEATS.toLocaleString()}):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={MAX_REPEATS}
                value={repeatCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setRepeatCount(isNaN(val) ? 1 : Math.min(val, MAX_REPEATS));
                }}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-1">
                {[5, 20, 100].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setRepeatCount(cnt)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {cnt}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Separator:
            </label>
            <div className="grid grid-cols-4 gap-1">
              {(['newline', 'space', 'comma', 'custom'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSeparator(s)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                    separator === s
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {s === 'newline' ? 'Line' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Custom separator input or line number toggle */}
          <div>
            {separator === 'custom' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Custom Separator String:
                </label>
                <input
                  type="text"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  placeholder="e.g.  |  or  --- "
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div className="flex items-center h-full pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={addLineNumbers}
                    onChange={(e) => setAddLineNumbers(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Add Line Numbers (1. , 2. ...)</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Text to Repeat</span>
            {text && (
              <button
                onClick={() => { setText(''); onShowToast('Cleared'); }}
                className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Enter word, phrase, emoji or message to repeat..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              Repeated Result ({outputText.length.toLocaleString()} chars)
            </span>
            <span>{repeatCount} times</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={8}
            placeholder="Repeated output appears here..."
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
          <span>{copied ? 'Copied!' : 'Copy Repeated Text'}</span>
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
