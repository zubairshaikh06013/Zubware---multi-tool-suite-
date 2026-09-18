import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Scissors, FileText } from 'lucide-react';

interface TextSplitterToolProps {
  onShowToast: (message: string) => void;
}

export const TextSplitterTool: React.FC<TextSplitterToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `The quick brown fox jumps over the lazy dog.
SplitDrop tools process all your text locally in your browser.
No data is ever sent to any remote server.
Enjoy instant speeds and complete privacy with client-side processing.`
  );
  const [splitMode, setSplitMode] = useState<'chars' | 'words' | 'lines' | 'delimiter'>('lines');
  const [splitValue, setSplitValue] = useState<number>(2);
  const [customDelimiter, setCustomDelimiter] = useState<string>('.');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const getChunks = (): string[] => {
    if (!inputText) return [];

    if (splitMode === 'lines') {
      const lines = inputText.split('\n');
      const chunkSize = Math.max(1, splitValue);
      const chunks: string[] = [];
      for (let i = 0; i < lines.length; i += chunkSize) {
        chunks.push(lines.slice(i, i + chunkSize).join('\n'));
      }
      return chunks;
    }

    if (splitMode === 'words') {
      const words = inputText.trim().split(/\s+/);
      const chunkSize = Math.max(1, splitValue);
      const chunks: string[] = [];
      for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
      }
      return chunks;
    }

    if (splitMode === 'chars') {
      const chunkSize = Math.max(1, splitValue);
      const chunks: string[] = [];
      for (let i = 0; i < inputText.length; i += chunkSize) {
        chunks.push(inputText.slice(i, i + chunkSize));
      }
      return chunks;
    }

    if (splitMode === 'delimiter') {
      if (!customDelimiter) return [inputText];
      return inputText.split(customDelimiter).map(c => c.trim()).filter(Boolean);
    }

    return [inputText];
  };

  const chunks = getChunks();

  const handleCopyChunk = (chunkText: string, index: number) => {
    navigator.clipboard.writeText(chunkText);
    setCopiedIndex(index);
    onShowToast(`Copied chunk #${index + 1}!`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!chunks.length) return;
    navigator.clipboard.writeText(chunks.join('\n\n--- CHUNK SEPARATOR ---\n\n'));
    setCopiedAll(true);
    onShowToast('Copied all chunks!');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadAll = () => {
    if (!chunks.length) return;
    const blob = new Blob([chunks.join('\n\n--- CHUNK SEPARATOR ---\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `split_chunks_${chunks.length}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${chunks.length} chunks!`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options Panel */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Split By:
            </span>
            {(['lines', 'words', 'chars', 'delimiter'] as const).map(m => (
              <button
                key={m}
                onClick={() => setSplitMode(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  splitMode === m
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {m === 'lines' ? 'Line Count' : m === 'words' ? 'Word Count' : m === 'chars' ? 'Character Count' : 'Custom Delimiter'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {splitMode === 'delimiter' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Delimiter:</span>
                <input
                  type="text"
                  value={customDelimiter}
                  onChange={(e) => setCustomDelimiter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white w-24"
                  placeholder="e.g. ; or ,"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Every:</span>
                <input
                  type="number"
                  min={1}
                  value={splitValue}
                  onChange={(e) => setSplitValue(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white w-20"
                />
                <span className="text-xs text-slate-500 font-medium">
                  {splitMode === 'lines' ? 'lines' : splitMode === 'words' ? 'words' : 'chars'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
          <span>Text to Split</span>
          <div className="flex items-center gap-2">
            <span>{inputText.length} characters</span>
            {inputText && (
              <button
                onClick={() => { setInputText(''); onShowToast('Cleared'); }}
                className="text-rose-500 hover:text-rose-600 flex items-center gap-1 ml-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={6}
          placeholder="Paste or type long text here to divide into chunks..."
          className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      </div>

      {/* Chunks Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Generated Chunks ({chunks.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              disabled={!chunks.length}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy All Chunks'}</span>
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={!chunks.length}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {chunks.map((chunk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Chunk #{idx + 1}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {chunk.length} chars • {chunk.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    onClick={() => handleCopyChunk(chunk, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 transition-all"
                  >
                    {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              <pre className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                {chunk}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
