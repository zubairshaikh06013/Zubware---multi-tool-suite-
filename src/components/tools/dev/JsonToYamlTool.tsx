import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, ArrowRightLeft, AlertCircle, RefreshCw } from 'lucide-react';

interface JsonToYamlToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_JSON = `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "zubware-app",
    "labels": {
      "app": "frontend",
      "env": "production"
    }
  },
  "spec": {
    "replicas": 3,
    "strategy": {
      "type": "RollingUpdate"
    },
    "template": {
      "spec": {
        "containers": [
          {
            "name": "web-server",
            "image": "nginx:1.25-alpine",
            "ports": [
              {
                "containerPort": 80
              }
            ]
          }
        ]
      }
    }
  }
}`;

// Recursive JSON to YAML Serializer
function jsonToYaml(obj: any, indentLevel = 0, indentSpaces = 2): string {
  const indent = ' '.repeat(indentLevel * indentSpaces);

  if (obj === null) return 'null';
  if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    // If string has newlines or special chars, quote it
    if (obj.includes('\n') || /[:#[\]{}&*!|>'%@`]/.test(obj) || obj.trim() === '') {
      return JSON.stringify(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj
      .map(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const itemYaml = jsonToYaml(item, indentLevel + 1, indentSpaces);
          const trimmed = itemYaml.trimStart();
          return `${indent}- ${trimmed}`;
        }
        return `${indent}- ${jsonToYaml(item, indentLevel + 1, indentSpaces)}`;
      })
      .join('\n');
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    return keys
      .map(k => {
        const val = obj[k];
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
            if (val.length === 0) return `${indent}${k}: []`;
            return `${indent}${k}:\n${jsonToYaml(val, indentLevel + 1, indentSpaces)}`;
          } else {
            if (Object.keys(val).length === 0) return `${indent}${k}: {}`;
            return `${indent}${k}:\n${jsonToYaml(val, indentLevel + 1, indentSpaces)}`;
          }
        }
        return `${indent}${k}: ${jsonToYaml(val, indentLevel + 1, indentSpaces)}`;
      })
      .join('\n');
  }

  return String(obj);
}

export const JsonToYamlTool: React.FC<JsonToYamlToolProps> = ({ onShowToast }) => {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const convertedYaml = React.useMemo(() => {
    if (!inputJson.trim()) {
      setError(null);
      return '';
    }
    try {
      const parsed = JSON.parse(inputJson);
      setError(null);
      return jsonToYaml(parsed, 0, indentSize);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      return '';
    }
  }, [inputJson, indentSize]);

  const copyYaml = () => {
    if (!convertedYaml) return;
    navigator.clipboard.writeText(convertedYaml);
    setCopied(true);
    onShowToast('Copied YAML to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    if (!convertedYaml) return;
    const blob = new Blob([convertedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.yaml';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded converted.yaml!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔄</span> JSON to YAML Converter
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Convert JSON configuration objects to human-readable YAML with proper indentation, lists, and formatting.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadFile}
            disabled={!convertedYaml}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .yaml</span>
          </button>
          <button
            onClick={copyYaml}
            disabled={!convertedYaml}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy YAML</span>
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-500" />
              <span>Input JSON</span>
            </span>
            <button
              onClick={() => setInputJson('')}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={18}
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
            placeholder="Paste valid JSON here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* YAML Output */}
        <div className="glass-card p-6 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>Output YAML</span>
            </span>

            {/* Indent option */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Indent:</span>
              <button
                onClick={() => setIndentSize(2)}
                className={`px-2 py-0.5 rounded font-bold ${
                  indentSize === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                2
              </button>
              <button
                onClick={() => setIndentSize(4)}
                className={`px-2 py-0.5 rounded font-bold ${
                  indentSize === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                4
              </button>
            </div>
          </div>

          <textarea
            readOnly
            rows={18}
            value={convertedYaml}
            placeholder="YAML will appear here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed outline-none text-slate-900 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
