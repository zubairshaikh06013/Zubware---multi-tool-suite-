import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Hash, Sparkles } from 'lucide-react';

interface TextToHexToolProps {
  onShowToast: (message: string) => void;
}

export const TextToHexTool: React.FC<TextToHexToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('Zubware Developer Tools');
  const [delimiter, setDelimiter] = useState<'space' | 'none' | 'colon' | 'comma'>('space');
  const [prefix, setPrefix] = useState<'none' | '0x' | 'backslash'>('none');
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const convertToHex = (): string => {
    if (!inputText) return '';
    try {
      const bytes = new TextEncoder().encode(inputText);
      const sep = delimiter === 'space' ? ' ' : delimiter === 'colon' ? ':' : delimiter === 'comma' ? ', ' : '';
      const pfx = prefix === '0x' ? '0x' : prefix === 'backslash' ? '\\x' : '';

      return Array.from(bytes)
        .map(b => {
          let hex = b.toString(16).padStart(2, '0');
          if (uppercase) hex = hex.toUpperCase();
          return `${pfx}${hex}`;
        })
        .join(sep);
    } catch {
      return '';
    }
  };

  const outputText = convertToHex();
  const byteLength = new TextEncoder().encode(inputText).length;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Hexadecimal code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hex_output.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded hex file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Delimiter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Delimiter:
            </span>
            {(['space', 'none', 'colon', 'comma'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDelimiter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  delimiter === d
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {d === 'space' ? 'Space' : d === 'colon' ? 'Colon (:)' : d}
              </button>
            ))}
          </div>

          {/* Prefix */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Prefix:</span>
            {(['none', '0x', 'backslash'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPrefix(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                  prefix === p
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {p === 'none' ? 'None' : p === '0x' ? '0x' : '\\x'}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Uppercase Hex (48 45 58 vs 48 45 58)</span>
          </label>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Characters</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">{inputText.length}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">UTF-8 Bytes</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{byteLength}</p>
        </div>
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hex Length</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{outputText.length}</p>
        </div>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Plain Text</span>
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
            placeholder="Type or paste plain text here to convert to hexadecimal..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Hexadecimal Output
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder="Hex representation will appear here..."
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
          <span>{copied ? 'Copied!' : 'Copy Hex'}</span>
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
