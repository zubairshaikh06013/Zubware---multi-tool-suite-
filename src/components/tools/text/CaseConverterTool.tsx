import React, { useState } from 'react';
import { Copy, Check, Download, Type, Upload, Trash2, ArrowLeftRight, Sparkles, RefreshCw } from 'lucide-react';

export const CaseConverterTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [text, setText] = useState('welcome to splitdrop case converter! convert any text instantly.');
  const [copied, setCopied] = useState(false);

  const getWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_.]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const toUppercase = () => {
    setText(text.toUpperCase());
    onShowToast('Converted to UPPERCASE');
  };

  const toLowercase = () => {
    setText(text.toLowerCase());
    onShowToast('Converted to lowercase');
  };

  const toTitleCase = () => {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v\.?|vs\.?|via)$/i;
    const result = text.toLowerCase().replace(/[A-Za-z0-9#']+/g, (match, index) => {
      if (index === 0 || !smallWords.test(match)) {
        return match.charAt(0).toUpperCase() + match.slice(1);
      }
      return match;
    });
    setText(result);
    onShowToast('Converted to Title Case');
  };

  const toSentenceCase = () => {
    const result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    setText(result);
    onShowToast('Converted to Sentence case');
  };

  const toCapitalizeWords = () => {
    const result = text.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());
    setText(result);
    onShowToast('Capitalized Each Word');
  };

  const toCamelCase = () => {
    const words = getWords(text);
    if (!words.length) return;
    const result = words
      .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join('');
    setText(result);
    onShowToast('Converted to camelCase');
  };

  const toPascalCase = () => {
    const words = getWords(text);
    if (!words.length) return;
    const result = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
    setText(result);
    onShowToast('Converted to PascalCase');
  };

  const toSnakeCase = () => {
    const words = getWords(text);
    if (!words.length) return;
    const result = words.map((w) => w.toLowerCase()).join('_');
    setText(result);
    onShowToast('Converted to snake_case');
  };

  const toKebabCase = () => {
    const words = getWords(text);
    if (!words.length) return;
    const result = words.map((w) => w.toLowerCase()).join('-');
    setText(result);
    onShowToast('Converted to kebab-case');
  };

  const toConstantCase = () => {
    const words = getWords(text);
    if (!words.length) return;
    const result = words.map((w) => w.toUpperCase()).join('_');
    setText(result);
    onShowToast('Converted to CONSTANT_CASE');
  };

  const toDotCase = () => {
    const words = getWords(text);
    if (!words.length) return;
    const result = words.map((w) => w.toLowerCase()).join('.');
    setText(result);
    onShowToast('Converted to dot.case');
  };

  const toAlternatingCase = () => {
    let flag = true;
    const result = text
      .split('')
      .map((char) => {
        if (/[a-zA-Z]/.test(char)) {
          const transformed = flag ? char.toLowerCase() : char.toUpperCase();
          flag = !flag;
          return transformed;
        }
        return char;
      })
      .join('');
    setText(result);
    onShowToast('Converted to aLtErNaTiNg cAsE');
  };

  const toToggleCase = () => {
    const result = text
      .split('')
      .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
      .join('');
    setText(result);
    onShowToast('Toggled Case');
  };

  const toReverseText = () => {
    setText(text.split('').reverse().join(''));
    onShowToast('Reversed Text');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
        onShowToast(`Loaded file: ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Copied text!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'case_converted_text.txt';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded text file!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Case Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more.
          </p>
        </div>
      </div>

      {/* Conversion Action Buttons */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Standard Text Styles</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toSentenceCase}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Sentence case
          </button>
          <button
            onClick={toTitleCase}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Title Case
          </button>
          <button
            onClick={toCapitalizeWords}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Capitalize Words
          </button>
          <button
            onClick={toUppercase}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            UPPERCASE
          </button>
          <button
            onClick={toLowercase}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            lowercase
          </button>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pt-2">Developer & Code Formats</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toCamelCase}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-mono"
          >
            camelCase
          </button>
          <button
            onClick={toPascalCase}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-mono"
          >
            PascalCase
          </button>
          <button
            onClick={toSnakeCase}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-mono"
          >
            snake_case
          </button>
          <button
            onClick={toKebabCase}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-mono"
          >
            kebab-case
          </button>
          <button
            onClick={toConstantCase}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-mono"
          >
            CONSTANT_CASE
          </button>
          <button
            onClick={toDotCase}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs font-mono"
          >
            dot.case
          </button>
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block pt-2">Stylized & Inversion</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={toAlternatingCase}
            className="px-3.5 py-2 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 font-mono"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> aLtErNaTiNg
          </button>
          <button
            onClick={toToggleCase}
            className="px-3.5 py-2 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" /> Toggle Invert
          </button>
          <button
            onClick={toReverseText}
            className="px-3.5 py-2 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-teal-500" /> Reverse Text
          </button>
        </div>
      </div>

      {/* Text Area Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Text Editor ({text.length} characters &bull; {text.trim() ? text.trim().split(/\s+/).length : 0} words)
          </label>
          <div className="flex items-center gap-2">
            <label className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.json,.xml,.html"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => { setText(''); onShowToast('Cleared text'); }}
              className="px-3 py-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>

        <textarea
          rows={11}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here..."
          className="w-full p-4 text-sm rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans"
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={!text}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download TXT
          </button>
          <button
            onClick={handleCopy}
            disabled={!text}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

