import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Binary, AlertCircle } from 'lucide-react';

interface BinaryToTextToolProps {
  onShowToast: (message: string) => void;
}

export const BinaryToTextTool: React.FC<BinaryToTextToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    '01010011 01110000 01101100 01101001 01110100 01000100 01110010 01101111 01110000'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const convertBinaryToText = (): { text: string; error: string | null } => {
    if (!inputText.trim()) return { text: '', error: null };

    // Strip out 0b prefix, commas, spaces, dashes
    const cleaned = inputText
      .replace(/0b/gi, '')
      .replace(/[^01]/g, '');

    if (!cleaned) {
      return { text: '', error: 'Please enter valid binary digits (0 and 1)' };
    }

    if (cleaned.length % 8 !== 0) {
      return {
        text: '',
        error: `Binary stream length (${cleaned.length}) is not a multiple of 8 bits. Incomplete byte detected.`
      };
    }

    try {
      const bytes: number[] = [];
      for (let i = 0; i < cleaned.length; i += 8) {
        const byteStr = cleaned.slice(i, i + 8);
        bytes.push(parseInt(byteStr, 2));
      }

      const decoded = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
      return { text: decoded, error: null };
    } catch {
      return { text: '', error: 'Failed to decode binary sequence as UTF-8.' };
    }
  };

  const { text: outputText, error } = convertBinaryToText();

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
    a.download = 'decoded_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded decoded text file!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Instructions / Help */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Accepts space-separated 8-bit bytes, comma-separated, or continuous bit streams.</span>
        <button
          onClick={() => setInputText('01001000 01100101 01101100 01101100 01101111 00100001')}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
        >
          Load "Hello!" Sample
        </button>
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Binary Input (0s and 1s)</span>
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
            placeholder="e.g. 01001000 01101001..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5" /> Decoded Plain Text
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder={error ? error : "Decoded text appears here..."}
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
