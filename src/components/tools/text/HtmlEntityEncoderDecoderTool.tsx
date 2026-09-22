import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Code2, Sparkles, BookOpen } from 'lucide-react';

interface HtmlEntityEncoderDecoderToolProps {
  onShowToast: (message: string) => void;
}

const COMMON_ENTITIES = [
  { char: '<', name: '&lt;', num: '&#60;', desc: 'Less than' },
  { char: '>', name: '&gt;', num: '&#62;', desc: 'Greater than' },
  { char: '&', name: '&amp;', num: '&#38;', desc: 'Ampersand' },
  { char: '"', name: '&quot;', num: '&#34;', desc: 'Quotation mark' },
  { char: "'", name: '&apos;', num: '&#39;', desc: 'Apostrophe' },
  { char: '©', name: '&copy;', num: '&#169;', desc: 'Copyright' },
  { char: '®', name: '&reg;', num: '&#174;', desc: 'Registered' },
  { char: '™', name: '&trade;', num: '&#8482;', desc: 'Trademark' },
  { char: '€', name: '&euro;', num: '&#8364;', desc: 'Euro' },
  { char: '£', name: '&pound;', num: '&#163;', desc: 'Pound' },
  { char: '¥', name: '&yen;', num: '&#165;', desc: 'Yen' },
  { char: '§', name: '&sect;', num: '&#167;', desc: 'Section sign' },
  { char: '—', name: '&mdash;', num: '&#8212;', desc: 'Em dash' },
  { char: '–', name: '&ndash;', num: '&#8211;', desc: 'En dash' },
  { char: '•', name: '&bull;', num: '&#8226;', desc: 'Bullet' },
  { char: ' ', name: '&nbsp;', num: '&#160;', desc: 'Non-breaking space' }
];

const NAMED_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '£': '&pound;',
  '¥': '&yen;',
  '¢': '&cent;',
  '§': '&sect;',
  '°': '&deg;',
  '±': '&plusmn;',
  '×': '&times;',
  '÷': '&divide;',
  '—': '&mdash;',
  '–': '&ndash;',
  '…': '&hellip;',
  '•': '&bull;',
  '«': '&laquo;',
  '»': '&raquo;'
};

export const HtmlEntityEncoderDecoderTool: React.FC<HtmlEntityEncoderDecoderToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `<div class="card">\n  <h1>Zubware & Text Suite © 2026</h1>\n  <p>Price: €49.99 — "Save 20% today!"</p>\n</div>`
  );
  const [mode, setMode] = useState<'encodeNamed' | 'encodeDecimal' | 'encodeHex' | 'decode'>('encodeNamed');
  const [copied, setCopied] = useState<boolean>(false);

  const encodeNamed = (str: string) => {
    return str.replace(/[&<>"'©®™€£¥¢§°±×÷—–…•«»]/g, m => NAMED_MAP[m] || m);
  };

  const encodeDecimal = (str: string) => {
    return Array.from(str)
      .map(char => {
        const code = char.codePointAt(0);
        if (code !== undefined && (code < 32 || code > 126 || ['<', '>', '&', '"', "'"].includes(char))) {
          return `&#${code};`;
        }
        return char;
      })
      .join('');
  };

  const encodeHex = (str: string) => {
    return Array.from(str)
      .map(char => {
        const code = char.codePointAt(0);
        if (code !== undefined && (code < 32 || code > 126 || ['<', '>', '&', '"', "'"].includes(char))) {
          return `&#x${code.toString(16).toUpperCase()};`;
        }
        return char;
      })
      .join('');
  };

  const decodeEntities = (str: string) => {
    // Safe browser entity decoder using DOMParser
    try {
      const doc = new DOMParser().parseFromString(str, 'text/html');
      return doc.documentElement.textContent || '';
    } catch {
      return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
    }
  };

  const getResult = (): string => {
    if (!inputText) return '';
    switch (mode) {
      case 'encodeNamed':
        return encodeNamed(inputText);
      case 'encodeDecimal':
        return encodeDecimal(inputText);
      case 'encodeHex':
        return encodeHex(inputText);
      case 'decode':
        return decodeEntities(inputText);
      default:
        return inputText;
    }
  };

  const outputText = getResult();

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    onShowToast('Copied HTML entities to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html_entities_${mode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  const handleInsertEntity = (char: string) => {
    setInputText(prev => prev + char);
    onShowToast(`Inserted: ${char}`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Mode Controls */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
            Mode:
          </span>
          <button
            onClick={() => setMode('encodeNamed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'encodeNamed'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Encode (Named &amp;)
          </button>
          <button
            onClick={() => setMode('encodeDecimal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'encodeDecimal'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Encode Decimal (&amp;#169;)
          </button>
          <button
            onClick={() => setMode('encodeHex')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'encodeHex'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Encode Hex (&amp;#xA9;)
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'decode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Decode Entities → Raw Text
          </button>
        </div>
      </div>

      {/* Editors */}
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
            placeholder={mode === 'decode' ? 'Paste HTML with entities (e.g. &copy; &lt;div&gt;)...' : 'Type or paste text to convert to HTML entities...'}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              Converted Output
            </span>
            <span>{outputText.length} characters</span>
          </div>
          <textarea
            value={outputText}
            readOnly
            rows={10}
            placeholder="Result will appear here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Quick Insert Common Entities Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>Quick Reference & Insert:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ENTITIES.map(item => (
            <button
              key={item.char}
              onClick={() => handleInsertEntity(item.char)}
              title={`${item.desc}: ${item.name} (${item.num})`}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <span>{item.char}</span>
              <span className="text-[10px] text-slate-400 font-normal">{item.name}</span>
            </button>
          ))}
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
          <span>{copied ? 'Copied!' : 'Copy Converted Text'}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!outputText}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Output</span>
        </button>
      </div>
    </div>
  );
};
