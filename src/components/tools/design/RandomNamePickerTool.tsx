import React, { useState, useEffect } from 'react';
import { Shuffle, Copy, Trash2, RotateCcw, Check, Sparkles, UserCheck, History } from 'lucide-react';

interface RandomNamePickerToolProps {
  onShowToast: (message: string) => void;
}

export const RandomNamePickerTool: React.FC<RandomNamePickerToolProps> = ({ onShowToast }) => {
  const [namesText, setNamesText] = useState<string>(
    'Alice Johnson\nBob Smith\nCharlie Davis\nDiana Prince\nEvan Wright\nFiona Gallagher\nGeorge Clark'
  );
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [tempDisplay, setTempDisplay] = useState<string>('');
  const [removeAfterPick, setRemoveAfterPick] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const getNamesList = () => {
    return namesText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);
  };

  const handlePick = () => {
    const list = getNamesList();
    if (list.length === 0) {
      onShowToast('Please enter at least one name to pick from!');
      return;
    }
    if (list.length === 1) {
      setSelectedName(list[0]);
      setHistory(prev => [list[0], ...prev]);
      if (removeAfterPick) setNamesText('');
      onShowToast(`Picked: ${list[0]}`);
      return;
    }

    setIsPicking(true);
    let counter = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      const randomCandidate = list[Math.floor(Math.random() * list.length)];
      setTempDisplay(randomCandidate);
      counter++;

      if (counter >= maxIterations) {
        clearInterval(interval);
        const winner = list[Math.floor(Math.random() * list.length)];
        setSelectedName(winner);
        setTempDisplay('');
        setIsPicking(false);
        setHistory(prev => [winner, ...prev]);

        if (removeAfterPick) {
          const updated = list.filter(n => n !== winner);
          setNamesText(updated.join('\n'));
        }
        onShowToast(`🎉 Selected Winner: ${winner}`);
      }
    }, 60);
  };

  const copyWinner = () => {
    if (!selectedName) return;
    navigator.clipboard.writeText(selectedName);
    setCopied(true);
    onShowToast(`Copied name: ${selectedName}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setNamesText('Alice Johnson\nBob Smith\nCharlie Davis\nDiana Prince\nEvan Wright\nFiona Gallagher\nGeorge Clark');
    setSelectedName(null);
    setHistory([]);
    onShowToast('Reset to default names!');
  };

  const nameCount = getNamesList().length;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎲</span> Random Name Picker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Draw a random name or raffle winner from your custom list with animated selection and history tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetAll}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handlePick}
            disabled={isPicking || nameCount === 0}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Shuffle className={`w-4 h-4 ${isPicking ? 'animate-spin' : ''}`} />
            <span>{isPicking ? 'Drawing...' : 'Pick a Name'}</span>
          </button>
        </div>
      </div>

      {/* Winner Display Hero Card */}
      <div className="glass-card p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-tr from-indigo-600/10 via-purple-600/5 to-pink-600/10 text-center space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>{isPicking ? 'Drawing Random Entry...' : 'Selected Name'}</span>
        </span>

        <div className="min-h-[70px] flex items-center justify-center">
          {isPicking ? (
            <div className="text-3xl sm:text-5xl font-black font-mono text-indigo-500 animate-pulse">
              {tempDisplay || '...'}
            </div>
          ) : selectedName ? (
            <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-wide">
              {selectedName}
            </div>
          ) : (
            <div className="text-base text-slate-400 font-medium">
              Click &quot;Pick a Name&quot; below to select a winner
            </div>
          )}
        </div>

        {selectedName && !isPicking && (
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={copyWinner}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Winner'}</span>
            </button>
            <button
              onClick={handlePick}
              className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Pick Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Input and Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Name List Input */}
        <div className="md:col-span-8 glass-card p-6 rounded-3xl space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Names List ({nameCount} total)
            </label>
            <button
              onClick={() => setNamesText('')}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          <textarea
            rows={8}
            value={namesText}
            onChange={e => setNamesText(e.target.value)}
            placeholder="Enter one name or item per line..."
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={removeAfterPick}
                onChange={e => setRemoveAfterPick(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
              <span>Remove chosen name from list after picking</span>
            </label>
          </div>
        </div>

        {/* History Panel */}
        <div className="md:col-span-4 glass-card p-6 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <History className="w-4 h-4 text-indigo-500" />
              <span>Pick History ({history.length})</span>
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400">No draws made yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {history.map((hName, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium flex justify-between items-center"
                  >
                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                      #{history.length - idx}. {hName}
                    </span>
                    <span className="text-[10px] text-slate-400">Won</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
