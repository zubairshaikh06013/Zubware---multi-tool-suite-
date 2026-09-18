import React, { useState } from 'react';
import { Code, Copy, Check, Download, Trash2, Upload, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export function JsonToXmlTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const sampleJson = `{
  "company": "Zubware Labs",
  "founded": 2026,
  "headquarters": "San Francisco, CA",
  "departments": [
    {
      "name": "Engineering",
      "lead": "Alex Chen",
      "headcount": 28
    },
    {
      "name": "Design",
      "lead": "Sarah Jenkins",
      "headcount": 14
    }
  ],
  "verified": true
}`;

  const [inputJson, setInputJson] = useState<string>(sampleJson);
  const [outputXml, setOutputXml] = useState<string>('');
  const [rootTag, setRootTag] = useState<string>('root');
  const [itemTag, setItemTag] = useState<string>('item');
  const [includeDeclaration, setIncludeDeclaration] = useState<boolean>(true);
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const escapeXml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const sanitizeTagName = (name: string): string => {
    const cleaned = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    return /^[a-zA-Z_]/.test(cleaned) ? cleaned : '_' + cleaned;
  };

  const convertJsonToXml = () => {
    if (!inputJson.trim()) {
      setOutputXml('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      setError(null);

      const indentStr = indentSpaces > 0 ? ' '.repeat(indentSpaces) : '';

      const serializeNode = (obj: any, tagName: string, depth: number): string => {
        const indent = indentSpaces > 0 ? indentStr.repeat(depth) : '';
        const newline = indentSpaces > 0 ? '\n' : '';

        if (obj === null || obj === undefined) {
          return `${indent}<${tagName}/>${newline}`;
        }

        if (typeof obj !== 'object') {
          return `${indent}<${tagName}>${escapeXml(String(obj))}</${tagName}>${newline}`;
        }

        if (Array.isArray(obj)) {
          let xml = '';
          obj.forEach((item) => {
            xml += serializeNode(item, tagName, depth);
          });
          return xml;
        }

        // Plain object
        let childrenXml = '';
        Object.entries(obj).forEach(([key, val]) => {
          const safeKey = sanitizeTagName(key);
          if (Array.isArray(val)) {
            val.forEach((item) => {
              childrenXml += serializeNode(item, safeKey, depth + 1);
            });
          } else {
            childrenXml += serializeNode(val, safeKey, depth + 1);
          }
        });

        if (!childrenXml) {
          return `${indent}<${tagName}/>${newline}`;
        }

        return `${indent}<${tagName}>${newline}${childrenXml}${indent}</${tagName}>${newline}`;
      };

      const safeRoot = sanitizeTagName(rootTag) || 'root';
      let xmlOutput = '';
      if (includeDeclaration) {
        xmlOutput += `<?xml version="1.0" encoding="UTF-8"?>${indentSpaces > 0 ? '\n' : ''}`;
      }

      xmlOutput += serializeNode(parsed, safeRoot, 0).trim();
      setOutputXml(xmlOutput);
      onShowToast('Converted JSON to XML!');
    } catch (err: any) {
      setError(err.message || 'Invalid JSON input');
      onShowToast('Failed to parse JSON');
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
    if (!outputXml) return;
    navigator.clipboard.writeText(outputXml);
    setCopied(true);
    onShowToast('XML copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputXml) return;
    const blob = new Blob([outputXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.xml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded output.xml!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            JSON to XML Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transform JSON objects and arrays into structured, standard XML with custom tags and formatting.
          </p>
        </div>
        <button
          onClick={() => { setInputJson(sampleJson); setOutputXml(''); setError(null); onShowToast('Sample JSON loaded'); }}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Load Sample JSON
        </button>
      </div>

      {/* Settings bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Root Tag:</span>
            <input
              type="text"
              value={rootTag}
              onChange={(e) => setRootTag(e.target.value)}
              className="w-24 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Indent:</span>
            <select
              value={indentSpaces}
              onChange={(e) => setIndentSpaces(parseInt(e.target.value))}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="0">Minified (0 Spaces)</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDeclaration}
              onChange={(e) => setIncludeDeclaration(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
            />
            Include &lt;?xml?&gt;
          </label>
        </div>

        <button
          onClick={convertJsonToXml}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Convert to XML
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">JSON Parse Error</span>
            <p className="font-mono mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Dual Column Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              JSON Input
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputJson(''); setOutputXml(''); setError(null); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Enter JSON here..."
            rows={14}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              XML Output
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!outputXml}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!outputXml}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <textarea
            value={outputXml}
            readOnly
            placeholder="Converted XML will appear here..."
            rows={14}
            className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-indigo-900 dark:text-indigo-300 focus:outline-none resize-y select-all"
          />
        </div>
      </div>
    </div>
  );
}
