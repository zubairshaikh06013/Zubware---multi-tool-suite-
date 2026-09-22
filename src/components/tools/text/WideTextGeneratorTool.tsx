import React, { useState } from 'react';
import { Type, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

interface WideTextGeneratorToolProps {
  onShowToast: (message: string) => void;
}

export const WideTextGeneratorTool: React.FC<WideTextGeneratorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>('VAPORWAVE AESTHETICS');
  const [style, setStyle] = useState<'fullwidth' | 'spaced' | 'double_spaced' | 'squared'>('fullwidth');
  const [copied, setCopied] = useState<boolean>(false);

  // Convert to Vaporwave fullwidth / wide text
  const convertText = (text: string, currentStyle: string) => {
    if (!text) return '';

    if (currentStyle === 'fullwidth') {
      // Fullwidth unicode: 0xFF01 to 0xFF5E
      return text
        .split('')
        .map(char => {
          const code = char.charCodeAt(0);
          if (code === 32) return '　'; // ideographic fullwidth space
          if (code >= 33 && code <= 126) {
            return String.fromCharCode(code + 0xfee0);
          }
          return char;
        })
        .join('');
    }

    if (currentStyle === 'spaced') {
      return text.split('').join(' ');
    }

    if (currentStyle === 'double_spaced') {
      return text.split('').join('  ');
    }

    if (currentStyle === 'squared') {
      // Squared capital letters 0x1F130
      return text
        .toUpperCase()
        .split('')
        .map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCodePoint(0x1f130 + (code - 65));
          }
          return char;
        })
        .join(' ');
    }

    return text;
  };

  const outputText = convertText(inputText, style);

  const copyResult = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Copied wide text!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔤</span> Wide Text Generator (Vaporwave & Fullwidth Font)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert standard text into fullwidth Unicode aesthetic text (ｗｉｄｅ　ｔｅｘｔ) and spaced typography.
          </p>
        </div>
        <button
          onClick={copyResult}
          disabled={!outputText}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>Copy Wide Text</span>
        </button>
      </div>

      {/* Style selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'fullwidth', label: 'Fullwidth (ｆｕｌｌｗｉｄｔｈ)' },
          { id: 'spaced', label: 'Spaced (S p a c e d)' },
          { id: 'double_spaced', label: 'Double Spaced (W  i  d  e)' },
          { id: 'squared', label: 'Squared [ 🄰 🄴 🅂 ]' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setStyle(item.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              style === item.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-500" />
              <span>Standard Text</span>
            </span>
            <button
              onClick={() => setInputText('')}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Presets:</span>
            {['VAPORWAVE AESTHETIC', 'RETRO LO-FI DREAMS', 'ZUBWARE TOOLS'].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="glass-card p-6 rounded-3xl space-y-3 border border-indigo-500/20">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Wide Text Output</span>
            </span>
          </div>

          <textarea
            readOnly
            rows={8}
            value={outputText}
            placeholder="Converted wide text appears here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm sm:text-base leading-relaxed outline-none text-slate-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
