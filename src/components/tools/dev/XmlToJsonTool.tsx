import React, { useState } from 'react';
import { FileCode2, Copy, Check, Download, Trash2, Upload, Sparkles, AlertCircle } from 'lucide-react';

export function XmlToJsonTool({ onShowToast }: { onShowToast: (msg: string) => void }) {
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<store name="Zubware Digital Hub" location="Global">
  <metadata>
    <version>2.4</version>
    <online>true</online>
  </metadata>
  <products>
    <product id="101" category="productivity">
      <title>PDF Suite</title>
      <price>0.00</price>
      <free>true</free>
      <tags>
        <tag>pdf</tag>
        <tag>convert</tag>
        <tag>excel</tag>
      </tags>
    </product>
    <product id="102" category="security">
      <title>Checksum Verifier</title>
      <price>0.00</price>
      <free>true</free>
      <tags>
        <tag>crypto</tag>
        <tag>sha256</tag>
      </tags>
    </product>
  </products>
</store>`;

  const [inputXml, setInputXml] = useState<string>(sampleXml);
  const [outputJson, setOutputJson] = useState<string>('');
  const [includeAttributes, setIncludeAttributes] = useState<boolean>(true);
  const [coerceTypes, setCoerceTypes] = useState<boolean>(true);
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const coerceValue = (val: string): any => {
    if (!coerceTypes) return val;
    const trimmed = val.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(trimmed) && !isNaN(Number(trimmed))) {
      return Number(trimmed);
    }
    return val;
  };

  const xmlToJson = () => {
    if (!inputXml.trim()) {
      setOutputJson('');
      setError(null);
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(inputXml, 'application/xml');

      // Check for parsererror
      const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
      if (parserError) {
        throw new Error(parserError.textContent || 'Syntax error in XML');
      }

      const parseNode = (node: Node): any => {
        // Element node
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const result: Record<string, any> = {};

          // Collect attributes
          if (includeAttributes && element.attributes.length > 0) {
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i];
              result[`@${attr.name}`] = coerceValue(attr.value);
            }
          }

          // Count child elements by tagName to handle arrays
          const childElements: Element[] = [];
          for (let i = 0; i < element.childNodes.length; i++) {
            const child = element.childNodes[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
              childElements.push(child as Element);
            }
          }

          if (childElements.length === 0) {
            // Pure text node element
            const textContent = element.textContent?.trim() || '';
            if (Object.keys(result).length > 0) {
              if (textContent) {
                result['#text'] = coerceValue(textContent);
              }
              return result;
            }
            return coerceValue(textContent);
          }

          // Group child elements
          const counts: Record<string, number> = {};
          childElements.forEach((child) => {
            counts[child.tagName] = (counts[child.tagName] || 0) + 1;
          });

          childElements.forEach((child) => {
            const tag = child.tagName;
            const parsedChild = parseNode(child);

            if (counts[tag] > 1) {
              if (!Array.isArray(result[tag])) {
                result[tag] = [];
              }
              result[tag].push(parsedChild);
            } else {
              result[tag] = parsedChild;
            }
          });

          return result;
        }

        return null;
      };

      const root = xmlDoc.documentElement;
      const rootObject: Record<string, any> = {};
      rootObject[root.tagName] = parseNode(root);

      const formatted = JSON.stringify(rootObject, null, indentSpaces === 0 ? undefined : indentSpaces);
      setOutputJson(formatted);
      setError(null);
      onShowToast('Converted XML to JSON!');
    } catch (err: any) {
      setError(err.message || 'Invalid XML syntax');
      onShowToast('Failed to parse XML');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setInputXml(content);
        onShowToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    if (!outputJson) return;
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    onShowToast('JSON copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded output.json!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            XML to JSON Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert XML documents and feeds into structured JSON with array grouping and type detection.
          </p>
        </div>
        <button
          onClick={() => { setInputXml(sampleXml); setOutputJson(''); setError(null); onShowToast('Sample XML loaded'); }}
          className="px-3.5 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all cursor-pointer self-start sm:self-auto"
        >
          Load Sample XML
        </button>
      </div>

      {/* Settings bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAttributes}
              onChange={(e) => setIncludeAttributes(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
            />
            Include Attributes (@attr)
          </label>

          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={coerceTypes}
              onChange={(e) => setCoerceTypes(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
            />
            Parse Numbers & Booleans
          </label>

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
        </div>

        <button
          onClick={xmlToJson}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" /> Convert to JSON
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block">XML Parse Error</span>
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
              XML Input
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload XML
                <input
                  type="file"
                  accept=".xml,text/xml,application/xml"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => { setInputXml(''); setOutputJson(''); setError(null); onShowToast('Cleared input'); }}
                className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={inputXml}
            onChange={(e) => setInputXml(e.target.value)}
            placeholder="Enter XML here..."
            rows={14}
            className="w-full p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200 resize-y"
          />
        </div>

        {/* Output Panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              JSON Output
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
            placeholder="Converted JSON will appear here..."
            rows={14}
            className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-indigo-900 dark:text-indigo-300 focus:outline-none resize-y select-all"
          />
        </div>
      </div>
    </div>
  );
}
