import React, { useState } from 'react';
import { RotateCw, RotateCcw, Dices, Sparkles, History, Plus, Minus } from 'lucide-react';

interface DiceRollerToolProps {
  onShowToast: (message: string) => void;
}

type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

export const DiceRollerTool: React.FC<DiceRollerToolProps> = ({ onShowToast }) => {
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceType, setDiceType] = useState<DiceType>(6);
  const [modifier, setModifier] = useState<number>(0);
  const [results, setResults] = useState<number[]>([3, 5]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [history, setHistory] = useState<{ rolls: number[]; type: number; total: number; mod: number }[]>([
    { rolls: [3, 5], type: 6, total: 8, mod: 0 }
  ]);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    setTimeout(() => {
      const newRolls: number[] = [];
      for (let i = 0; i < diceCount; i++) {
        newRolls.push(Math.floor(Math.random() * diceType) + 1);
      }

      setResults(newRolls);
      setIsRolling(false);

      const rollSum = newRolls.reduce((a, b) => a + b, 0) + modifier;
      setHistory(prev => [{ rolls: newRolls, type: diceType, total: rollSum, mod: modifier }, ...prev].slice(0, 20));
      onShowToast(`Rolled ${diceCount}d${diceType}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}: Total ${rollSum}`);
    }, 450);
  };

  const rawSum = results.reduce((a, b) => a + b, 0);
  const totalWithMod = rawSum + modifier;

  // Dice dot renderer for standard d6
  const renderD6Dots = (val: number) => {
    const dotPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const active = dotPositions[val] || [4];

    return (
      <div className="grid grid-cols-3 gap-1 w-12 h-12 p-1.5 bg-white dark:bg-slate-900 border-2 border-indigo-600 rounded-xl shadow-md">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {active.includes(i) && (
              <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🎲</span> Dice Roller (d4 to d100)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-dice simulator for tabletop RPGs, board games, and probability calculation with modifiers.
          </p>
        </div>
        <button
          onClick={rollDice}
          disabled={isRolling}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RotateCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
          <span>Roll Dice</span>
        </button>
      </div>

      {/* Main Board */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl text-center space-y-6 border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 via-slate-500/5 to-transparent">
        {/* Total Display */}
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
            Grand Total
          </span>
          <div className="text-5xl sm:text-7xl font-black font-mono text-slate-900 dark:text-white tracking-tight mt-1">
            {isRolling ? '...' : totalWithMod}
          </div>
          {modifier !== 0 && (
            <span className="text-xs text-slate-400 font-mono">
              (Dice Sum: {rawSum} {modifier > 0 ? `+ ${modifier}` : `- ${Math.abs(modifier)}`})
            </span>
          )}
        </div>

        {/* Dice Visual Stage */}
        <div className="flex flex-wrap items-center justify-center gap-4 min-h-[80px]">
          {results.map((val, idx) => (
            <div
              key={idx}
              className={`transition-all duration-300 ${
                isRolling ? 'animate-spin scale-90' : 'scale-100'
              }`}
            >
              {diceType === 6 ? (
                renderD6Dots(val)
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex flex-col items-center justify-center shadow-lg border-2 border-indigo-400/50">
                  <span>{val}</span>
                  <span className="text-[9px] font-bold uppercase opacity-70">d{diceType}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dice Type */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Dice Type</label>
          <div className="grid grid-cols-4 gap-1.5">
            {([4, 6, 8, 10, 12, 20, 100] as DiceType[]).map(d => (
              <button
                key={d}
                onClick={() => setDiceType(d)}
                className={`py-2 rounded-xl text-xs font-black border transition-all ${
                  diceType === d
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                d{d}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Dice */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Number of Dice: <span className="text-indigo-600 font-mono">{diceCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={diceCount}
            onChange={e => setDiceCount(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 bg-slate-200 dark:bg-slate-800 mt-3"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1 Die</span>
            <span>3 Dice</span>
            <span>6 Dice</span>
          </div>
        </div>

        {/* Modifier */}
        <div className="glass-card p-5 rounded-2xl space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Modifier (+/-)</label>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setModifier(m => m - 1)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={modifier}
              onChange={e => setModifier(Number(e.target.value) || 0)}
              className="w-full text-center py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border font-bold text-sm font-mono"
            />
            <button
              onClick={() => setModifier(m => m + 1)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Roll History */}
      {history.length > 0 && (
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4" />
              <span>Roll History (Recent {history.length})</span>
            </span>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-rose-500 font-medium"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
              >
                [{h.rolls.join(', ')}]{h.mod !== 0 ? (h.mod > 0 ? `+${h.mod}` : h.mod) : ''} = <span className="text-indigo-600 dark:text-indigo-400">{h.total}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
