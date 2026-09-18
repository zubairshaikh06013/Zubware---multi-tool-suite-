import React, { useState } from 'react';
import { Minimize2, Copy, Check, Download, Trash2, Upload, Sparkles, AlertCircle, FileCode } from 'lucide-react';

export function JsonMinifierTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const sampleJson = `{
  "app": "Zubware",
  "version": "2.4.0",
  "author": {
    "name": "Zubware Engineering",
    "contact": "work95812@gmail.com",
    "verified": true
  },
  "features": [
    "100% Client-Side Processing",
    "No Cloud Uploads",
    "Instant Format Conversion",
    "Zero Telemetry"
  ],
  "metrics": {
    "speed": "instant",
    "activeUsers": 150000,
    "uptime": 99.99
  }
}`;

  const [inputJson, setInputJson] = useState<string>(sampleJson);
  const [outputJson, setOutputJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const minify = () => {
    if (!inputJson.trim()) {
      setOutputJson('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setError(null);
      onShowToast('JSON successfully minified!');
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      onShowToast('Error: Invalid JSON syntax');
    }
  };

  const formatJson = (spaces: number = 2) => {
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutputJson(formatted);
      setError(null);
      onShowToast(`Formatted JSON (${spaces} spaces)`);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      onShowToast('Error: Invalid JSON syntax');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputJson(content);
        onShowToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputJson) return;
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    onShowToast('Minified JSON copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minified.json';
    a.click;
    URL.revokeObjectURL(url);
    onShowToast('Downloaded minified.json!');
  };

  const inputBytes = new TextEncoder().encode(inputJson).length;
  const outputBytes = outputJson ? new TextEncoder().encode(outputJson).length : 0;
  const savingsPercent = inputBytes > 0 && outputBytes > 0 ? Math.round(((inputBytes - outputBytes) / inputBytes) * 100) : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Minimize2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JSON Minifier & Compressor
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compress and minify JSON data by stripping whitespace and newlines for APIs and production payloads.
          </p>
        </div>
        <button
          onClick={() => { setInputJson(sampleJson); setOutputJson(''); setError(null); onShowToast('Sample JSON loaded'); }}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Load Sample JSON
        </button>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={minify}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Minify JSON
          </button>
          <button
            onClick={() => formatJson(2)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Format (2 Spaces)
          </button>
          <button
            onClick={() => formatJson(4)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Format (4 Spaces)
          </button>
        </div>

        {/* Compression Statistics */}
        {outputBytes > 0 && (
          <div className="flex items-center gap-3 text-xs font-mono font-bold">
            <span className="text-slate-500">Original: {inputBytes} B</span>
            <span className="text-indigo-600 dark:text-indigo-400">Minified: {outputBytes} B</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {savingsPercent > 0 ? `-${savingsPercent}%` : '0%'}
            </span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">JSON Syntax Error</span>
            <p className="font-mono mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Editor Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Input JSON
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload JSON
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputJson(''); setOutputJson(''); setError(null); onShowToast('Cleared'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-all"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your JSON here..."
            rows={14}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Minified Output
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputJson}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputJson}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <textarea
            value={outputJson}
            readOnly
            placeholder="Minified JSON output will appear here..."
            rows={14}
            className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-indigo-900 dark:text-indigo-300 focus:outline-none resize-y select-all"
          />
        </div>
      </div>
    </div>
  );
}
