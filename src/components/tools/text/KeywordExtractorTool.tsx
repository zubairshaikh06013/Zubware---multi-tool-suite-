import React, { useState } from 'react';
import { Copy, Check, Download, Trash2, Key, BarChart3, Sparkles } from 'lucide-react';

interface KeywordExtractorToolProps {
  onShowToast: (message: string) => void;
}

interface KeywordStat {
  word: string;
  count: number;
  frequency: number; // percentage
}

const COMMON_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while',
  'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll',
  'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

export const KeywordExtractorTool: React.FC<KeywordExtractorToolProps> = ({ onShowToast }) => {
  const [inputText, setInputText] = useState<string>(
    `Zubware is a powerful collection of free online browser tools designed for productivity, document processing, image editing, and text manipulation. All processing takes place 100% client-side in your browser, guaranteeing zero file uploads and complete data privacy. Boost your workflow with instant image compressors, PDF mergers, typing tests, and keyword extractors.`
  );
  const [removeStopWords, setRemoveStopWords] = useState<boolean>(true);
  const [minWordLength, setMinWordLength] = useState<number>(3);
  const [phraseMode, setPhraseMode] = useState<'1' | '2' | '3'>('1'); // 1-word, 2-word bigrams, 3-word trigrams
  const [copied, setCopied] = useState<boolean>(false);

  const getKeywords = (): KeywordStat[] => {
    if (!inputText.trim()) return [];

    // Clean punctuation and normalize
    const cleanedText = inputText.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
    const rawTokens = cleanedText.split(/\s+/).filter(w => w.length >= minWordLength);

    const tokens = removeStopWords
      ? rawTokens.filter(w => !COMMON_STOP_WORDS.has(w))
      : rawTokens;

    if (!tokens.length) return [];

    const frequencyMap = new Map<string, number>();
    const n = parseInt(phraseMode, 10);

    if (n === 1) {
      tokens.forEach(w => {
        frequencyMap.set(w, (frequencyMap.get(w) || 0) + 1);
      });
    } else {
      for (let i = 0; i <= tokens.length - n; i++) {
        const phrase = tokens.slice(i, i + n).join(' ');
        frequencyMap.set(phrase, (frequencyMap.get(phrase) || 0) + 1);
      }
    }

    const totalOccurrences = Array.from(frequencyMap.values()).reduce((sum, c) => sum + c, 0);

    const results: KeywordStat[] = [];
    frequencyMap.forEach((count, word) => {
      results.push({
        word,
        count,
        frequency: totalOccurrences > 0 ? (count / totalOccurrences) * 100 : 0
      });
    });

    results.sort((a, b) => b.count - a.count);
    return results.slice(0, 50); // top 50
  };

  const keywords = getKeywords();
  const maxCount = keywords.length > 0 ? keywords[0].count : 1;

  const handleCopy = () => {
    if (!keywords.length) return;
    const textToCopy = keywords.map(k => `${k.word} (${k.count})`).join(', ');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onShowToast(`Copied ${keywords.length} keywords!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!keywords.length) return;
    const csv = 'Keyword,Count,FrequencyPercent\n' + keywords.map(k => `"${k.word}",${k.count},${k.frequency.toFixed(1)}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keywords_${phraseMode}gram.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Downloaded CSV keyword report!');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      {/* Options */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Keyword Type:
            </span>
            {(['1', '2', '3'] as const).map(n => (
              <button
                key={n}
                onClick={() => setPhraseMode(n)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  phraseMode === n
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {n === '1' ? 'Single Words' : n === '2' ? '2-Word Phrases' : '3-Word Phrases'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Min Length:</span>
            <input
              type="number"
              min={2}
              max={10}
              value={minWordLength}
              onChange={(e) => setMinWordLength(Math.max(2, parseInt(e.target.value, 10) || 2))}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white w-16"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Filter Common English Stop Words (the, is, and, of, to, in, with...)</span>
          </label>
        </div>
      </div>

      {/* Editor & Keywords Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>Input Article / Content</span>
            {inputText && (
              <button
                onClick={() => { setInputText(''); onShowToast('Cleared text'); }}
                className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            placeholder="Paste text or article here to analyze keywords and density..."
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        {/* Frequency Results */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
              <Key className="w-3.5 h-3.5" /> Top Keywords ({keywords.length})
            </span>
            <span className="text-slate-400">Frequency & Density</span>
          </div>

          <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 h-72 overflow-y-auto space-y-2">
            {keywords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                <BarChart3 className="w-6 h-6 mb-1 opacity-40" />
                <span>No keywords found with current filters</span>
              </div>
            ) : (
              keywords.map((kw, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate mr-2">
                      #{idx + 1} {kw.word}
                    </span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      {kw.count}× ({kw.frequency.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
                      style={{ width: `${Math.min(100, (kw.count / maxCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          disabled={!keywords.length}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Top Keywords'}</span>
        </button>

        <button
          onClick={handleDownloadCsv}
          disabled={!keywords.length}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download CSV</span>
        </button>
      </div>
    </div>
  );
};
