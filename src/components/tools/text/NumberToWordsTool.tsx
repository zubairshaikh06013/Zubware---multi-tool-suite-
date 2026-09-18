import React, { useState } from 'react';
import { Copy, Check, Volume2, RefreshCw, Sparkles, Layers, DollarSign } from 'lucide-react';

export function NumberToWordsTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const [numberInput, setNumberInput] = useState<string>('1234567.89');
  const [system, setSystem] = useState<'international' | 'indian'>('international');
  const [currency, setCurrency] = useState<'none' | 'usd' | 'inr' | 'eur' | 'gbp'>('usd');
  const [letterCase, setLetterCase] = useState<'title' | 'upper' | 'lower' | 'sentence'>('title');
  const [copied, setCopied] = useState(false);

  // International units
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) {
      const t = tens[Math.floor(n / 10)];
      const rem = n % 10;
      return rem ? `${t}-${ones[rem]}` : t;
    }
    const h = ones[Math.floor(n / 100)];
    const rem = n % 100;
    return rem ? `${h} hundred ${convertLessThanThousand(rem)}` : `${h} hundred`;
  };

  const numberToWordsInt = (numStr: string): { integerWords: string; decimalWords: string } => {
    const cleanStr = numStr.trim().replace(/,/g, '');
    if (!cleanStr || isNaN(Number(cleanStr))) {
      return { integerWords: 'Invalid Number', decimalWords: '' };
    }

    const isNegative = cleanStr.startsWith('-');
    const absStr = isNegative ? cleanStr.slice(1) : cleanStr;
    const parts = absStr.split('.');
    let intNum = BigInt(parts[0] || '0');
    const decStr = parts[1] ? parts[1].slice(0, 2) : '';

    if (intNum === 0n && (!decStr || decStr === '00')) {
      return { integerWords: 'zero', decimalWords: '' };
    }

    const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];
    let wordsArr: string[] = [];
    let scaleIndex = 0;

    let tempInt = intNum;
    if (tempInt === 0n) {
      wordsArr.push('zero');
    } else {
      while (tempInt > 0n && scaleIndex < scales.length) {
        const chunk = Number(tempInt % 1000n);
        if (chunk > 0) {
          const chunkWord = convertLessThanThousand(chunk);
          const scaleName = scales[scaleIndex];
          wordsArr.unshift(scaleName ? `${chunkWord} ${scaleName}` : chunkWord);
        }
        tempInt = tempInt / 1000n;
        scaleIndex++;
      }
    }

    let resultInt = wordsArr.join(' ').trim();
    if (isNegative) resultInt = `minus ${resultInt}`;

    let resultDec = '';
    if (decStr && Number(decStr) > 0) {
      const decVal = Number(decStr.padEnd(2, '0'));
      resultDec = convertLessThanThousand(decVal);
    }

    return { integerWords: resultInt, decimalWords: resultDec };
  };

  const numberToWordsIndian = (numStr: string): { integerWords: string; decimalWords: string } => {
    const cleanStr = numStr.trim().replace(/,/g, '');
    if (!cleanStr || isNaN(Number(cleanStr))) {
      return { integerWords: 'Invalid Number', decimalWords: '' };
    }

    const isNegative = cleanStr.startsWith('-');
    const absStr = isNegative ? cleanStr.slice(1) : cleanStr;
    const parts = absStr.split('.');
    let intStr = parts[0] || '0';
    const decStr = parts[1] ? parts[1].slice(0, 2) : '';

    if (BigInt(intStr) === 0n && (!decStr || decStr === '00')) {
      return { integerWords: 'zero', decimalWords: '' };
    }

    let num = BigInt(intStr);
    if (num === 0n) {
      let resultDec = '';
      if (decStr && Number(decStr) > 0) {
        const decVal = Number(decStr.padEnd(2, '0'));
        resultDec = convertLessThanThousand(decVal);
      }
      return { integerWords: 'zero', decimalWords: resultDec };
    }

    // Indian numbering: Hundreds, Thousands, Lakhs, Crores
    const convertIndianChunk = (n: number): string => convertLessThanThousand(n);

    let partsArr: string[] = [];

    // Last 3 digits
    const hundredPart = Number(num % 1000n);
    if (hundredPart > 0) {
      partsArr.unshift(convertIndianChunk(hundredPart));
    }
    num = num / 1000n;

    // Thousands (2 digits)
    if (num > 0n) {
      const thousandPart = Number(num % 100n);
      if (thousandPart > 0) {
        partsArr.unshift(`${convertIndianChunk(thousandPart)} thousand`);
      }
      num = num / 100n;
    }

    // Lakhs (2 digits)
    if (num > 0n) {
      const lakhPart = Number(num % 100n);
      if (lakhPart > 0) {
        partsArr.unshift(`${convertIndianChunk(lakhPart)} lakh`);
      }
      num = num / 100n;
    }

    // Crores
    if (num > 0n) {
      const crorePart = Number(num);
      if (crorePart > 0) {
        partsArr.unshift(`${convertIndianChunk(crorePart)} crore`);
      }
    }

    let resultInt = partsArr.join(' ').trim();
    if (isNegative) resultInt = `minus ${resultInt}`;

    let resultDec = '';
    if (decStr && Number(decStr) > 0) {
      const decVal = Number(decStr.padEnd(2, '0'));
      resultDec = convertLessThanThousand(decVal);
    }

    return { integerWords: resultInt, decimalWords: resultDec };
  };

  const getFormattedResult = (): string => {
    const { integerWords, decimalWords } = system === 'indian'
      ? numberToWordsIndian(numberInput)
      : numberToWordsInt(numberInput);

    if (integerWords === 'Invalid Number') return 'Please enter a valid numeric value.';

    let rawText = '';

    if (currency === 'usd') {
      rawText = `${integerWords} dollar${integerWords !== 'one' ? 's' : ''}`;
      if (decimalWords) {
        rawText += ` and ${decimalWords} cent${decimalWords !== 'one' ? 's' : ''}`;
      } else {
        rawText += ' only';
      }
    } else if (currency === 'inr') {
      rawText = `${integerWords} rupee${integerWords !== 'one' ? 's' : ''}`;
      if (decimalWords) {
        rawText += ` and ${decimalWords} paise`;
      } else {
        rawText += ' only';
      }
    } else if (currency === 'eur') {
      rawText = `${integerWords} euro${integerWords !== 'one' ? 's' : ''}`;
      if (decimalWords) {
        rawText += ` and ${decimalWords} cent${decimalWords !== 'one' ? 's' : ''}`;
      } else {
        rawText += ' only';
      }
    } else if (currency === 'gbp') {
      rawText = `${integerWords} pound${integerWords !== 'one' ? 's' : ''}`;
      if (decimalWords) {
        rawText += ` and ${decimalWords} pence`;
      } else {
        rawText += ' only';
      }
    } else {
      rawText = integerWords;
      if (decimalWords) {
        rawText += ` point ${decimalWords}`;
      }
    }

    // Apply Case
    if (letterCase === 'upper') {
      return rawText.toUpperCase();
    } else if (letterCase === 'lower') {
      return rawText.toLowerCase();
    } else if (letterCase === 'sentence') {
      return rawText.charAt(0).toUpperCase() + rawText.slice(1).toLowerCase();
    } else {
      // Title Case
      return rawText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  };

  const resultText = getFormattedResult();

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    onShowToast('Copied words to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(resultText);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      onShowToast('Playing audio pronunciation 🔊');
    } else {
      onShowToast('Text-to-speech is not supported in your browser.');
    }
  };

  const handlePreset = (val: string) => {
    setNumberInput(val);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Input section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Enter Number or Amount
          </label>
          <div className="relative">
            <input
              type="text"
              value={numberInput}
              onChange={(e) => setNumberInput(e.target.value)}
              placeholder="e.g. 1234567.89"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {numberInput && (
              <button
                onClick={() => setNumberInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Presets:</span>
            {[
              { label: '$1,250', val: '1250' },
              { label: '$50,000.50', val: '50000.50' },
              { label: '1 Million', val: '1000000' },
              { label: '10 Lakhs', val: '1000000' },
              { label: '1 Crore', val: '10000000' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePreset(p.val)}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-medium hover:bg-indigo-100 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Number System
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSystem('international')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  system === 'international'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>International</span>
                <span className="text-[10px] opacity-75">(Millions)</span>
              </button>
              <button
                onClick={() => setSystem('indian')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                  system === 'indian'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Indian System</span>
                <span className="text-[10px] opacity-75">(Lakhs/Crores)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Currency Format
            </label>
            <select
              value={currency}
              onChange={(e: any) => setCurrency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="none">Plain Words (No Currency)</option>
              <option value="usd">USD ($ Dollars & Cents)</option>
              <option value="inr">INR (₹ Rupees & Paise)</option>
              <option value="eur">EUR (€ Euros & Cents)</option>
              <option value="gbp">GBP (£ Pounds & Pence)</option>
            </select>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-3 mb-2">
              Letter Case
            </label>
            <select
              value={letterCase}
              onChange={(e: any) => setLetterCase(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="title">Title Case (One Two Three)</option>
              <option value="upper">UPPERCASE (ONE TWO THREE)</option>
              <option value="lower">lowercase (one two three)</option>
              <option value="sentence">Sentence case (One two three)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="glass-card p-6 rounded-2xl space-y-4 border border-indigo-500/20 bg-indigo-50/30 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Converted Words Output
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              title="Listen Pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Words'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-base sm:text-lg leading-relaxed select-all">
          {resultText}
        </div>
      </div>
    </div>
  );
}
