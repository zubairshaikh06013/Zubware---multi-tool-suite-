import React, { useState } from 'react';
import { Copy, Check, Sparkles, RefreshCw, ArrowLeftRight, Hash } from 'lucide-react';

export function WordsToNumberTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [mode, setMode] = useState<'wordsToNum' | 'numToWords'>('wordsToNum');
  const [inputText, setInputText] = useState<string>('Two Million Five Hundred Thirty Four Thousand Seven Hundred Eighty Nine');
  const [numInput, setNumInput] = useState<string>('2534789');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Advanced Words to Number parser
  const parseWordsToNumber = (text: string): { value: number; error: string | null } => {
    if (!text || !text.trim()) return { value: 0, error: null };

    let clean = text.toLowerCase()
      .replace(/,/g, ' ')
      .replace(/\band\b/g, ' ')
      .replace(/-/g, ' ')
      .trim();

    const isNegative = clean.startsWith('minus') || clean.startsWith('negative');
    if (isNegative) {
      clean = clean.replace(/^(minus|negative)\s+/, '');
    }

    const smallUnits: Record<string, number> = {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
      ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
      seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
      sixty: 60, seventy: 70, eighty: 80, ninety: 90,
      first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9,
      tenth: 10, twentieth: 20, thirtieth: 30, fortieth: 40, fiftieth: 50, sixtieth: 60,
      seventieth: 70, eightieth: 80, ninetieth: 90, hundredth: 100, thousandth: 1000, millionth: 1000000
    };

    const scales: Record<string, number> = {
      hundred: 100,
      thousand: 1000,
      lakh: 100000,
      lakhs: 100000,
      million: 1000000,
      millions: 1000000,
      crore: 10000000,
      crores: 10000000,
      billion: 1000000000,
      billions: 1000000000,
      trillion: 1000000000000,
      trillions: 1000000000000
    };

    // Check for decimal split
    const parts = clean.split(/\s+point\s+|\s+decimal\s+/);
    const intWords = parts[0].trim().split(/\s+/).filter(Boolean);

    let total = 0;
    let current = 0;

    for (const word of intWords) {
      if (smallUnits[word] !== undefined) {
        current += smallUnits[word];
      } else if (word === 'hundred') {
        current = current === 0 ? 100 : current * 100;
      } else if (scales[word] !== undefined) {
        const mult = scales[word];
        current = current === 0 ? 1 : current;
        total += current * mult;
        current = 0;
      }
    }

    let result = total + current;

    // Handle decimal digits if present
    if (parts.length > 1) {
      const decWords = parts[1].trim().split(/\s+/).filter(Boolean);
      let decStr = '';
      for (const dw of decWords) {
        if (smallUnits[dw] !== undefined && smallUnits[dw] < 10) {
          decStr += smallUnits[dw].toString();
        }
      }
      if (decStr) {
        result = parseFloat(`${result}.${decStr}`);
      }
    }

    return { value: isNegative ? -result : result, error: null };
  };

  // Convert number to words
  const convertNumberToWords = (n: number): string => {
    if (n === 0) return 'zero';
    if (isNaN(n)) return 'invalid number';

    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const numToWordsChunk = (num: number): string => {
      let str = '';
      if (num >= 100) {
        str += a[Math.floor(num / 100)] + ' hundred ';
        num %= 100;
      }
      if (num >= 20) {
        str += b[Math.floor(num / 10)] + ' ';
        num %= 10;
      }
      if (num > 0) {
        str += a[num] + ' ';
      }
      return str.trim();
    };

    let absVal = Math.abs(n);
    const isNeg = n < 0;
    const intPart = Math.floor(absVal);
    const fracPart = absVal - intPart;

    let res = '';
    const trillions = Math.floor(intPart / 1000000000000);
    const billions = Math.floor((intPart % 1000000000000) / 1000000000);
    const millions = Math.floor((intPart % 1000000000) / 1000000);
    const thousands = Math.floor((intPart % 1000000) / 1000);
    const remainder = intPart % 1000;

    if (trillions) res += numToWordsChunk(trillions) + ' trillion ';
    if (billions) res += numToWordsChunk(billions) + ' billion ';
    if (millions) res += numToWordsChunk(millions) + ' million ';
    if (thousands) res += numToWordsChunk(thousands) + ' thousand ';
    if (remainder) res += numToWordsChunk(remainder) + ' ';

    res = res.trim();
    if (fracPart > 0) {
      const decStr = fracPart.toFixed(4).substring(2).replace(/0+$/, '');
      const digits = decStr.split('').map(d => a[parseInt(d, 10)]).join(' ');
      res += ` point ${digits}`;
    }

    return (isNeg ? 'negative ' : '') + res;
  };

  const parsed = parseWordsToNumber(inputText);
  const numValue = parsed.value;

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Indian numbering formatter (e.g. 12,34,567)
  const formatIndianNumber = (num: number): string => {
    const parts = num.toString().split('.');
    let intStr = parts[0];
    const isNeg = intStr.startsWith('-');
    if (isNeg) intStr = intStr.substring(1);

    if (intStr.length <= 3) {
      return (isNeg ? '-' : '') + intStr + (parts[1] ? '.' + parts[1] : '');
    }

    const lastThree = intStr.slice(-3);
    const otherDigits = intStr.slice(0, -3);
    const formattedOther = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return (isNeg ? '-' : '') + formattedOther + ',' + lastThree + (parts[1] ? '.' + parts[1] : '');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Words to Numbers Converter & Math Translator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert spelled-out English & Indian number phrases into digits, currency, decimals, and hex notation with bi-directional conversion.
          </p>
        </div>

        <button
          onClick={() => setMode(mode === 'wordsToNum' ? 'numToWords' : 'wordsToNum')}
          className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:bg-indigo-100"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{mode === 'wordsToNum' ? 'Switch: Numbers to Words' : 'Switch: Words to Numbers'}</span>
        </button>
      </div>

      {mode === 'wordsToNum' ? (
        <div className="space-y-6">
          {/* Words Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Enter Words, Quantities, or Spelled-Out Phrases
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Two million five hundred thousand three hundred..."
              className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Quick Sample Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Samples:</span>
              {[
                'Three Million Two Hundred Fifty Thousand',
                'Forty Five Lakhs Twenty Thousand',
                'Seven Hundred Fifty Four Point Nine',
                'Negative One Hundred Twenty Five',
                'Five Crore Sixty Lakhs'
              ].map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(ex)}
                  className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium hover:bg-indigo-100 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Formatted Number Results Matrix */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/20 bg-gradient-to-br from-indigo-50/20 to-purple-50/10 dark:from-slate-900/60 dark:to-indigo-950/20">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Parsed Numeric Representations</span>
              <span className="text-indigo-600 font-mono text-xs font-bold">Base 10 Decimal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Standard International Format */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Standard Format</span>
                  <button onClick={() => copyToClipboard(numValue.toLocaleString(), 'std', 'Standard Number')} className="hover:text-indigo-600">
                    {copiedKey === 'std' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono truncate select-all">
                  {numValue.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400">Thousands comma grouping</span>
              </div>

              {/* Indian Number Format */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Indian (Lakhs & Crores)</span>
                  <button onClick={() => copyToClipboard(formatIndianNumber(numValue), 'ind', 'Indian Format')} className="hover:text-indigo-600">
                    {copiedKey === 'ind' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono truncate select-all">
                  {formatIndianNumber(numValue)}
                </div>
                <span className="text-[10px] text-slate-400">Lakh / Crore separators</span>
              </div>

              {/* Raw Digits */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Raw Digits</span>
                  <button onClick={() => copyToClipboard(numValue.toString(), 'raw', 'Raw Digits')} className="hover:text-indigo-600">
                    {copiedKey === 'raw' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono truncate select-all">
                  {numValue.toString()}
                </div>
                <span className="text-[10px] text-slate-400">Clean unformatted numbers</span>
              </div>

              {/* US Dollars ($) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>US Dollars ($)</span>
                  <button onClick={() => copyToClipboard(`$${numValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'usd', 'USD')} className="hover:text-indigo-600">
                    {copiedKey === 'usd' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono truncate select-all">
                  ${numValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Indian Rupees (₹) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Indian Rupee (₹)</span>
                  <button onClick={() => copyToClipboard(`₹${formatIndianNumber(numValue)}`, 'inr', 'INR')} className="hover:text-indigo-600">
                    {copiedKey === 'inr' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono truncate select-all">
                  ₹{formatIndianNumber(numValue)}
                </div>
              </div>

              {/* Hexadecimal representation */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Hex Notation</span>
                  <button onClick={() => copyToClipboard(`0x${Math.floor(Math.abs(numValue)).toString(16).toUpperCase()}`, 'hex', 'Hex')} className="hover:text-indigo-600">
                    {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono truncate select-all">
                  0x{Math.floor(Math.abs(numValue)).toString(16).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Numbers Input */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Enter Numeric Value
            </label>
            <input
              type="number"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="e.g. 1500000"
              className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xl font-bold font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Words Output */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-indigo-500/20 bg-indigo-50/20 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Spelled-Out English Words
              </span>
              <button
                onClick={() => copyToClipboard(convertNumberToWords(parseFloat(numInput) || 0), 'words', 'Words')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {copiedKey === 'words' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Words</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-lg font-bold text-indigo-600 dark:text-indigo-400 capitalize leading-relaxed select-all">
              {convertNumberToWords(parseFloat(numInput) || 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
