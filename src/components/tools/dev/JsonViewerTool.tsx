import React, { useState, useMemo } from 'react';
import {
  ListTree,
  Copy,
  Check,
  Search,
  ChevronRight,
  ChevronDown,
  Trash2,
  AlertCircle,
  FileCode,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface JsonViewerToolProps {
  onShowToast: (message: string) => void;
}

const SAMPLE_JSON = `{
  "site": "Zubware Developer Tools",
  "version": "2.5.0",
  "status": "operational",
  "features": {
    "clientSide": true,
    "security": {
      "encryption": "AES-256",
      "noTracking": true
    },
    "supportedCategories": [
      "Developer Tools",
      "PDF Utilities",
      "Image Processing",
      "Calculators"
    ]
  },
  "metrics": {
    "totalTools": 211,
    "activeUsers": 45800,
    "uptimePercent": 99.98
  }
}`;

// Recursive Node Component with Search Highlighting
const TreeNode: React.FC<{
  nodeKey: string;
  value: any;
  searchTerm: string;
  isExpandedDefault: boolean;
  onCopyPath: (path: string) => void;
  currentPath: string;
}> = ({ nodeKey, value, searchTerm, isExpandedDefault, onCopyPath, currentPath }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  const keyMatches = searchTerm && nodeKey.toLowerCase().includes(searchTerm.toLowerCase());
  const valMatches =
    searchTerm && !isObject && String(value).toLowerCase().includes(searchTerm.toLowerCase());

  const renderValue = () => {
    if (value === null) return <span className="text-rose-500 font-mono">null</span>;
    if (typeof value === 'boolean')
      return <span className="text-amber-500 font-mono font-bold">{String(value)}</span>;
    if (typeof value === 'number')
      return <span className="text-emerald-500 font-mono font-bold">{value}</span>;
    if (typeof value === 'string')
      return (
        <span
          className={`font-mono ${
            valMatches ? 'bg-yellow-400 text-slate-950 px-1 rounded' : 'text-sky-500'
          }`}
        >
          &quot;{value}&quot;
        </span>
      );
    return null;
  };

  if (!isObject) {
    return (
      <div className="flex items-center gap-1.5 py-0.5 text-xs font-mono group hover:bg-slate-500/5 px-2 rounded">
        <span
          onClick={() => onCopyPath(currentPath)}
          className={`cursor-pointer font-bold select-none ${
            keyMatches
              ? 'bg-yellow-400 text-slate-950 px-1 rounded'
              : 'text-indigo-600 dark:text-indigo-400'
          }`}
          title="Click to copy path"
        >
          {nodeKey}:
        </span>
        <span className="truncate">{renderValue()}</span>
      </div>
    );
  }

  const entries = Object.entries(value);

  return (
    <div className="text-xs font-mono">
      <div
        className="flex items-center gap-1 py-1 cursor-pointer select-none group hover:bg-slate-500/5 px-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-slate-400">
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
        <span
          className={`font-bold ${
            keyMatches
              ? 'bg-yellow-400 text-slate-950 px-1 rounded'
              : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {nodeKey}
        </span>
        <span className="text-slate-400 text-[10px]">
          {isArray ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </div>

      {isOpen && (
        <div className="pl-4 border-l border-slate-200 dark:border-slate-800 ml-3 space-y-0.5 my-0.5">
          {entries.map(([childKey, childVal]) => (
            <TreeNode
              key={childKey}
              nodeKey={isArray ? `[${childKey}]` : childKey}
              value={childVal}
              searchTerm={searchTerm}
              isExpandedDefault={isExpandedDefault}
              onCopyPath={onCopyPath}
              currentPath={currentPath ? `${currentPath}.${childKey}` : childKey}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const JsonViewerTool: React.FC<JsonViewerToolProps> = ({ onShowToast }) => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const parsedData = useMemo(() => {
    try {
      if (!jsonInput.trim()) {
        setParseError(null);
        return null;
      }
      const parsed = JSON.parse(jsonInput);
      setParseError(null);
      return parsed;
    } catch (err: any) {
      setParseError(err.message || 'Invalid JSON syntax');
      return null;
    }
  }, [jsonInput]);

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    onShowToast(`Copied JSON path: "${path}"`);
  };

  const copyFormatted = () => {
    if (!parsedData) return;
    navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
    setCopied(true);
    onShowToast('Copied formatted JSON to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🌲</span> JSON Tree Viewer & Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore and navigate nested JSON structures with interactive collapsible tree nodes, key/value search, and path copying.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Load Sample
          </button>
          <button
            onClick={copyFormatted}
            disabled={!parsedData}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Clean JSON</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Raw Input Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-500" />
              <span>Paste JSON</span>
            </span>
            <button
              onClick={() => setJsonInput('')}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={18}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder="Paste your JSON string here..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {parseError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}
        </div>

        {/* Tree Explorer Column */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ListTree className="w-4 h-4 text-emerald-500" />
              <span>Visual Tree Structure</span>
            </span>

            {/* Search within JSON */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search keys or values..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-60"
              />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl min-h-[440px] max-h-[560px] overflow-y-auto border border-slate-200 dark:border-slate-800">
            {parsedData ? (
              <TreeNode
                nodeKey="root"
                value={parsedData}
                searchTerm={searchTerm}
                isExpandedDefault={true}
                onCopyPath={copyPath}
                currentPath=""
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center text-slate-400 space-y-2">
                <ListTree className="w-8 h-8 opacity-30" />
                <p className="text-xs">
                  {parseError ? 'Fix JSON syntax errors to view tree' : 'Enter valid JSON to explore tree nodes'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
