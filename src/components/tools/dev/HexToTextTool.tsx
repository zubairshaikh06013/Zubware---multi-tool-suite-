import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Hash, AlertCircle } from 'lucide-react';

interface HexToTextToolProps {
  onShowToast: (message: string) => void;
}

export const HexToTextTool: React.FC<HexToTextToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    '53 70 6C 69 74 44 72 6F 70'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const convertHexToText = (): { text: string; error: string | null } => {
    if (!inputText.trim()) return { text: '', error: null };

    // Strip 0x, \x, colons, spaces, commas
    const cleaned = inputText
      .replace(/0x|\\x|:|,|\s/gi, '')
      .trim();

    if (!cleaned) {
      return { text: '', error: 'Please enter valid hexadecimal digits.' };
    }

    if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
      return { text: '', error: 'Invalid characters detected. Only 0-9 and A-F are allowed.' };
    }

    if (cleaned.length % 2 !== 0) {
      return {
        text: '',
        error: `Hex string length (${cleaned.length}) is odd. Each byte requires exactly 2 hex characters.`
      };
    }

    try {
      const bytes: number[] = [];
      for (let i = 0; i < cleaned.length; i += 2) {
        bytes.push(parseInt(cleaned.slice(i, i + 2), 16));
      }

      const decoded = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
      return { text: decoded, error: null };
    } catch {
      return { text: '', error: 'Failed to decode hex sequence as UTF-8 string.' };
    }
  };

  const { text: outputText, error } = convertHexToText();

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Decoded text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'decoded_hex.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded decoded text file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Help Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Supports space-separated, colon-separated, 0x-prefixed, or continuous hex streams.</span>
        <button
          onClick={() => setInputText('48 65 6C 6C 6F 20 57 6F 72 6C 64 21')}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          Load "Hello World!" Sample
        </button>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Hex Input</span>
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
            placeholder="e.g. 48 65 6C 6C 6F or 0x480x65..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Decoded Plain Text
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder={error ? error : "Decoded text will appear here..."}
            className={`w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border ${
              error ? 'border-rose-300 dark:border-rose-800 text-rose-600' : 'border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white'
            } font-mono text-sm leading-relaxed focus:outline-none resize-y`}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          disabled={!outputText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Decoded Text'}</span>
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
