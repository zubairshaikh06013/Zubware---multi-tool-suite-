import React, { useState } from 'react';
import { CheckCircle2, Check, AlertTriangle, Copy, Trash2, ArrowRight, Wrench, Download, Upload, Code2, Sparkles } from 'lucide-react';

interface JsonValidatorToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_JSONS = [
  {
    name: 'User Profile API',
    json: `{\n  "userId": 10429,\n  "username": "sarah_dev",\n  "verified": true,\n  "profile": {\n    "firstName": "Sarah",\n    "lastName": "Connor",\n    "roles": ["admin", "developer"],\n    "settings": {\n      "theme": "dark",\n      "notifications": true\n    }\n  },\n  "lastLogin": "2026-09-29T10:00:00Z"\n}`
  },
  {
    name: 'Package Config',
    json: `{\n  "name": "zubware-app",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "react": "^19.0.0",\n    "lucide-react": "^0.500.0"\n  }\n}`
  }
];

export const JsonValidatorTool: React.FC<JsonValidatorToolProps> = ({ onShowToast }) => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  // Validation
  let isValid: boolean | null = null;
  let parsedObj: any = null;
  let errorMessage = '';
  let errorLine: number | null = null;
  let errorColumn: number | null = null;

  if (jsonInput.trim()) {
    try {
      parsedObj = JSON.parse(jsonInput);
      isValid = true;
    } catch (err: any) {
      isValid = false;
      errorMessage = err instanceof Error ? err.message : 'Invalid JSON syntax';

      // Prefer the parser's exact position when the browser exposes it.
      const positionMatch = errorMessage.match(/position\s+(\d+)/i);
      const lineColumnMatch = errorMessage.match(/line\s+(\d+)(?:\s+column\s+(\d+))?/i);

      let position: number | null = null;

      if (positionMatch) {
        position = Math.min(Number(positionMatch[1]), jsonInput.length);
      } else if (lineColumnMatch) {
        errorLine = Number(lineColumnMatch[1]);
        if (lineColumnMatch[2]) errorColumn = Number(lineColumnMatch[2]);
      }

      // Fallback for common errors when the parser gives no location.
      if (position === null && errorLine === null) {
        let inString = false;
        let escaped = false;
        let line = 1;
        let column = 1;
        let found = false;

        for (let i = 0; i < jsonInput.length; i++) {
          const ch = jsonInput[i];

          if (inString) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === '"') inString = false;
          } else {
            if (ch === '"') {
              inString = true;
            } else if (ch === ':' && /^\s*(?:,|}|]|$)/.test(jsonInput.slice(i + 1))) {
              errorLine = line;
              errorColumn = column + 1;
              found = true;
              break;
            } else if (ch === ',' && /^\s*[}\]]/.test(jsonInput.slice(i + 1))) {
              const remainder = jsonInput.slice(i + 1);
              const whitespace = remainder.match(/^\s*/)?.[0] ?? '';
              const targetOffset = i + 1 + whitespace.length;
              const beforeTarget = jsonInput.slice(0, targetOffset);
              errorLine = beforeTarget.split('\n').length;
              errorColumn = targetOffset - beforeTarget.lastIndexOf('\n');
              found = true;
              break;
            }
          }

          if (ch === '\n') {
            line++;
            column = 1;
          } else {
            column++;
          }
        }
      }

      if (position !== null) {
        const beforeError = jsonInput.slice(0, position);
        errorLine = beforeError.split('\n').length;
        errorColumn = position - beforeError.lastIndexOf('\n');
      }
    }
  }

  // Statistics
  const charCount = jsonInput.length;
  const byteSize = new Blob([jsonInput]).size;
  const linesCount = jsonInput.split('\n').length;
  let keysCount = 0;

  if (isValid && parsedObj && typeof parsedObj === 'object') {
    const countKeys = (obj: any): number => {
      let count = 0;
      if (Array.isArray(obj)) {
        obj.forEach(item => { count += countKeys(item); });
      } else if (obj !== null && typeof obj === 'object') {
        const keys = Object.keys(obj);
        count += keys.length;
        keys.forEach(k => { count += countKeys(obj[k]); });
      }
      return count;
    };
    keysCount = countKeys(parsedObj);
  }

  const formatJson = (spaces: number) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, spaces));
      onShowToast(spaces === 0 ? 'Minified JSON' : `Beautified JSON (${spaces} spaces)`);
    } catch {
      onShowToast('Please fix JSON syntax errors before formatting.');
    }
  };

  const autoRepairJson = () => {
    const input = jsonInput;

    if (!input.trim()) {
      onShowToast('Please enter JSON before using Auto-Repair.');
      return;
    }

    // Never modify already-valid JSON.
    try {
      JSON.parse(input);
      onShowToast('JSON is already valid. No repair needed.');
      return;
    } catch {
      // Continue with conservative repair.
    }

    // Token-aware scanner: only transform characters outside strings.
    const transformOutsideStrings = (
      text: string,
      transform: (outside: string) => string
    ): string => {
      let result = '';
      let outside = '';
      let inString = false;
      let escaped = false;

      const flush = () => {
        result += transform(outside);
        outside = '';
      };

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
          result += ch;

          if (escaped) {
            escaped = false;
          } else if (ch === '\\') {
            escaped = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }

        if (ch === '"') {
          flush();
          result += ch;
          inString = true;
        } else {
          outside += ch;
        }
      }

      flush();
      return result;
    };

    let repaired = input;

    // Convert single-quoted strings without touching double-quoted strings.
    // A small scanner handles escapes and preserves the content.
    {
      let output = '';
      let inDouble = false;
      let inSingle = false;
      let escaped = false;

      for (let i = 0; i < repaired.length; i++) {
        const ch = repaired[i];

        if (inDouble) {
          output += ch;
          if (escaped) escaped = false;
          else if (ch === '\\') escaped = true;
          else if (ch === '"') inDouble = false;
          continue;
        }

        if (inSingle) {
          if (escaped) {
            if (ch === "'") output += "'";
            else if (ch === '\\') output += '\\';
            else output += '\\' + ch;
            escaped = false;
          } else if (ch === '\\') {
            escaped = true;
          } else if (ch === "'") {
            output += '"';
            inSingle = false;
          } else if (ch === '"') {
            output += '\\"';
          } else {
            output += ch;
          }
          continue;
        }

        if (ch === '"') {
          inDouble = true;
          output += ch;
        } else if (ch === "'") {
          inSingle = true;
          output += '"';
        } else {
          output += ch;
        }
      }

      if (inSingle) {
        onShowToast('Could not safely repair an unterminated quoted string.');
        return;
      }

      repaired = output;
    }

    // Remove trailing commas only outside JSON strings.
    repaired = transformOutsideStrings(
      repaired,
      outside => outside.replace(/,(\s*[}\]])/g, '$1')
    );

    // Quote simple unquoted object keys only outside strings.
    repaired = transformOutsideStrings(
      repaired,
      outside => outside.replace(
        /([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g,
        '$1"$2":'
      )
    );

    try {
      const parsed = JSON.parse(repaired);
      setJsonInput(JSON.stringify(parsed, null, indentSpaces));
      onShowToast('JSON repaired successfully.');
    } catch {
      onShowToast('Some errors remain. Review the JSON; input was not overwritten.');
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setJsonInput(content);
        onShowToast(`Loaded ${file.name} (${file.size} bytes)`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    onShowToast('JSON copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonInput], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Exported JSON file');
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Code2 className="w-5 h-5" />
            </span>
            JSON Validator, Formatter & Auto-Fixer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time JSON syntax validator with error line pinpointing, 1-click auto-repair, and beautify/minify formatting.
          </p>
        </div>

        {/* Validation Status Badge */}
        {isValid === true && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Valid JSON Syntax</span>
          </div>
        )}
        {isValid === false && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold shrink-0">
            <AlertTriangle className="w-4 h-4" />
            <span>Invalid JSON {errorLine ? `(Line ${errorLine}${errorColumn ? `, Column ${errorColumn}` : ''})` : ''}</span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Sample presets */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Presets:</span>
          {SAMPLE_JSONS.map(s => (
            <button
              key={s.name}
              onClick={() => { setJsonInput(s.json); onShowToast(`Loaded ${s.name}`); }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Tools: Beautify, Minify, Auto-Fix */}
        <div className="flex items-center gap-2">
          <button
            onClick={autoRepairJson}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Auto-fix single quotes, trailing commas & unquoted keys"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Auto-Repair</span>
          </button>

          <button
            onClick={() => formatJson(2)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Beautify (2s)
          </button>

          <button
            onClick={() => formatJson(4)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            4s
          </button>

          <button
            onClick={() => formatJson(0)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Minify
          </button>
        </div>
      </div>

      {/* Error Message Box (if invalid) */}
      {isValid === false && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-rose-700 dark:text-rose-300 block">
              JSON Syntax Error {errorLine ? `at Line ${errorLine}${errorColumn ? `, Column ${errorColumn}` : ''}` : ''}:
            </span>
            <p className="font-mono text-rose-600 dark:text-rose-400">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Editor Main Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>JSON Content Editor</span>
          <div className="flex items-center gap-3">
            <span>{linesCount} lines</span>
            <span>•</span>
            <span>{charCount.toLocaleString()} chars</span>
            <span>•</span>
            <span>{(byteSize / 1024).toFixed(1)} KB</span>
            {keysCount > 0 && (
              <>
                <span>•</span>
                <span>{keysCount} keys</span>
              </>
            )}
          </div>
        </div>

        <textarea
          rows={16}
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder="Paste or write raw JSON here..."
          className="w-full p-4 rounded-3xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-800 shadow-xl selection:bg-indigo-500/30"
          spellCheck={false}
        />
      </div>

      {/* Bottom Bar: Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload JSON File</span>
            <input
              type="file"
              accept=".json,.txt"
              onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={() => { setJsonInput(''); onShowToast('Cleared JSON'); }}
            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            title="Clear editor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            disabled={!jsonInput.trim()}
            className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export File</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!jsonInput.trim()}
            className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-600/25 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
