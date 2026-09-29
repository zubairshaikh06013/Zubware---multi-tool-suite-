import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Trash2, 
  Binary, 
  AlertCircle, 
  ArrowLeftRight, 
  Sparkles, 
  Layers 
} from 'lucide-react';

interface BinaryToTextToolProps {
  onShowToast: (message: string) => void;
}

export const BinaryToTextTool: React.FC<BinaryToTextToolProps> = ({ onShowToast }) => {
  const [direction, setDirection] = useState<'binToText' | 'textToBin'>('binToText');
  const [inputText, setInputText] = useState<string>(
    '01011010 01110101 01100010 01110111 01100001 01110010 01100101' // "Zubware"
  );
  const [delimiter, setDelimiter] = useState<'space' | 'comma' | 'none' | 'prefix'>('space');
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion: Binary to Text
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

  // Conversion: Text to Binary
  const convertTextToBinary = (): string => {
    if (!inputText) return '';
    const encoder = new TextEncoder();
    const bytes = encoder.encode(inputText);

    const binaryArray = Array.from(bytes).map(byte => byte.toString(2).padStart(8, '0'));

    switch (delimiter) {
      case 'comma':
        return binaryArray.join(', ');
      case 'prefix':
        return binaryArray.map(b => '0b' + b).join(' ');
      case 'none':
        return binaryArray.join('');
      case 'space':
      default:
        return binaryArray.join(' ');
    }
  };

  const isBinToText = direction === 'binToText';
  const binResult = isBinToText ? convertBinaryToText() : { text: convertTextToBinary(), error: null };
  const outputText = binResult.text;
  const error = binResult.error;

  // Bit statistics
  const cleanedBits = (isBinToText ? inputText : outputText).replace(/[^01]/g, '');
  const onesCount = (cleanedBits.match(/1/g) || []).length;
  const zerosCount = (cleanedBits.match(/0/g) || []).length;
  const byteCount = Math.floor(cleanedBits.length / 8);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Copied output to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isBinToText ? 'decoded_text.txt' : 'binary_encoded.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded output file!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        onShowToast(`Uploaded ${file.name}!`);
      }
    };
    reader.readAsText(file);
  };

  const handleSwapDirection = () => {
    if (direction === 'binToText') {
      setDirection('textToBin');
      setInputText(outputText || 'Zubware Tools');
    } else {
      setDirection('binToText');
      setInputText(outputText || '01011010 01110101 01100010');
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Binary className="w-5 h-5 text-indigo-600" /> Binary to Text & ASCII Bit Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Encode and decode ASCII/UTF-8 text to 8-bit binary bytes with custom separators and bit statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwapDirection}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:bg-indigo-100"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{isBinToText ? 'Mode: Binary → Text' : 'Mode: Text → Binary'}</span>
          </button>
        </div>
      </div>

      {/* Formatting Options */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!isBinToText && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Byte Delimiter:</span>
            {(['space', 'comma', 'prefix', 'none'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDelimiter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  delimiter === d
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {d === 'prefix' ? '0b Prefix' : d}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <label className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
            <input type="file" accept=".txt,.bin" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setInputText('')}
            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl"
            title="Clear Input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>{isBinToText ? 'Binary Input (0s and 1s)' : 'Plain Text Input'}</span>
            <span>{inputText.length} chars</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            placeholder={isBinToText ? '01001000 01100101 01101100 01101100 01101111...' : 'Enter text to encode into binary...'}
            className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5" />
              {isBinToText ? 'Decoded Plain Text' : 'Binary Byte Representation'}
            </span>
            <span>{outputText.length} chars</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder={error || 'Result appears here...'}
            className={`w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-950 border ${
              error ? 'border-rose-500 text-rose-500' : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            } font-mono text-xs leading-relaxed focus:outline-none`}
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bottom Action Bar & Statistics */}
      <div className="glass-card p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Total Bits</span>
            <span className="font-bold text-slate-900 dark:text-white">{cleanedBits.length}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Byte Count</span>
            <span className="font-bold text-slate-900 dark:text-white">{byteCount} bytes</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Bit Ratio (1s / 0s)</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{onesCount} / {zerosCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!outputText}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Result'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!outputText}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-50 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
