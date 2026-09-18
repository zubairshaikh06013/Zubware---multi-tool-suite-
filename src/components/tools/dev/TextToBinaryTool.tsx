import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Binary, Sparkles } from 'lucide-react';

interface TextToBinaryToolProps {
  onShowToast: (message: string) => void;
}

export const TextToBinaryTool: React.FC<TextToBinaryToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('Zubware Tools');
  const [delimiter, setDelimiter] = useState<'space' | 'none' | 'comma' | 'dash'>('space');
  const [includePrefix, setIncludePrefix] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const convertToBinary = (): string => {
    if (!inputText) return '';
    try {
      const encoder = new TextEncoder();
      const uint8 = encoder.encode(inputText);
      const sep = delimiter === 'space' ? ' ' : delimiter === 'comma' ? ', ' : delimiter === 'dash' ? '-' : '';

      return Array.from(uint8)
        .map(byte => {
          const bin = byte.toString(2).padStart(8, '0');
          return includePrefix ? `0b${bin}` : bin;
        })
        .join(sep);
    } catch {
      return '';
    }
  };

  const outputText = convertToBinary();
  const byteCount = new TextEncoder().encode(inputText).length;
  const bitCount = byteCount * 8;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Binary code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'binary_output.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded binary file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Byte Separator:
          </span>
          {(['space', 'none', 'comma', 'dash'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDelimiter(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                delimiter === d
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {d === 'space' ? 'Space (0100 0110)' : d === 'none' ? 'None (Continuous)' : d}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
          <input
            type="checkbox"
            checked={includePrefix}
            onChange={(e) => setIncludePrefix(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Include 0b prefix</span>
        </label>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Characters</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{inputText.length}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">UTF-8 Bytes</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{byteCount}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Bits</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{bitCount}</p>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Plain Text Input</span>
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
            placeholder="Type or paste any text to encode as binary..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5" /> Binary Output (8-bit bytes)
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder="Binary 0s and 1s will appear here..."
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
          <span>{copied ? 'Copied!' : 'Copy Binary'}</span>
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
